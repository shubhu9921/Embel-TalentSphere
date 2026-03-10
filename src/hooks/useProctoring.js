import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import apiService from '../services/apiService';

const useProctoring = (maxViolations = 3, onAutoSubmit, videoRef, candidateId) => {
    const onAutoSubmitRef = useRef(onAutoSubmit);
    useEffect(() => {
        onAutoSubmitRef.current = onAutoSubmit;
    }, [onAutoSubmit]);

    const [violations, setViolations] = useState(0);
    const [lastViolationType, setLastViolationType] = useState('');
    const [isFaceMissing, setIsFaceMissing] = useState(false);
    const [isMultipleFaces, setIsMultipleFaces] = useState(false);
    const [isSuspiciousMovement, setIsSuspiciousMovement] = useState(false);
    const [isVoiceDetected, setIsVoiceDetected] = useState(false);
    const [isTabViolation, setIsTabViolation] = useState(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const faceDetectionIntervalRef = useRef(null);
    const noFaceStartRef = useRef(null);
    const suspiciousMovementStartRef = useRef(null);
    const voiceStartRef = useRef(null);
    const violationLoggedRef = useRef(false);
    const multipleFaceViolationLoggedRef = useRef(false);
    const movementViolationLoggedRef = useRef(false);
    const voiceViolationLoggedRef = useRef(false);
    const tabViolationLoggedRef = useRef(false);

    const captureScreenshot = () => {
        if (videoRef?.current) {
            try {
                return videoRef.current.getScreenshot();
            } catch (err) {
                console.error('Failed to capture screenshot', err);
            }
        }
        return null;
    };

    const logViolationToDB = async (type, evidence = null) => {
        if (!candidateId) return;
        try {
            const candidate = await apiService.get(`/candidates/${candidateId}`);
            const logs = candidate.proctoringLogs || [];
            if (logs.some(log => log.type === type && (new Date() - new Date(log.timestamp)) < 10000)) {
                return; // Prevent duplicate logs within 10s
            }
            const newLog = {
                type,
                timestamp: new Date().toISOString(),
                category: 'malpractice',
                evidence: evidence // Base64 screenshot
            };
            await apiService.patch(`/candidates/${candidateId}`, {
                proctoringLogs: [...logs, newLog]
            });
            console.log(`Violation logged to DB with evidence: ${type}`);
        } catch (err) {
            console.error('Failed to log violation to DB:', err);
        }
    };

    const addViolation = (type, immediate = false) => {
        console.warn(`Proctoring violation: ${type}`);
        setLastViolationType(type);

        // Capture evidence
        const evidence = captureScreenshot();
        logViolationToDB(type, evidence);

        // Immediate submission for critical issues (tab switch etc.)
        if (immediate) {
            if (onAutoSubmitRef.current) onAutoSubmitRef.current(`CRITICAL MALPRACTICE: ${type}`);
            return;
        }

        setViolations((prev) => {
            const next = prev + 1;
            // Rule Engine: Terminate at 3 violations
            if (next >= maxViolations) {
                if (onAutoSubmitRef.current) onAutoSubmitRef.current('Interview terminated due to suspicious activity.');
            }
            return next;
        });
    };

    useEffect(() => {
        const loadModels = async () => {
            try {
                // Point to remote weights repo if local /models is missing/incomplete
                const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                console.log('FaceAPI: Models loaded successfully from remote source');
                startFaceDetection();
            } catch (err) {
                console.error('FaceAPI: Model loading failed', err);
            }
        };

        const startFaceDetection = () => {
            faceDetectionIntervalRef.current = setInterval(async () => {
                if (!videoRef?.current?.video) return;

                const video = videoRef.current.video;
                if (video.readyState !== 4) return;

                // Detect with landmarks for pose estimation
                const detections = await faceapi.detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceLandmarks();

                if (detections.length === 0) {
                    if (!noFaceStartRef.current) {
                        noFaceStartRef.current = Date.now();
                    } else {
                        const duration = (Date.now() - noFaceStartRef.current) / 1000;
                        if (duration > 5) {
                            setIsFaceMissing(true);
                            if (!violationLoggedRef.current || Math.floor(duration) % 15 === 0) {
                                addViolation('Face Not Detected for > 5s');
                                violationLoggedRef.current = true;
                            }
                        }
                    }
                    setIsMultipleFaces(false);
                } else if (detections.length > 1) {
                    noFaceStartRef.current = null;
                    setIsFaceMissing(false);
                    setIsMultipleFaces(true);
                    if (!multipleFaceViolationLoggedRef.current) {
                        addViolation('Multiple Faces Detected');
                        multipleFaceViolationLoggedRef.current = true;
                    }
                } else {
                    noFaceStartRef.current = null;
                    setIsFaceMissing(false);
                    setIsMultipleFaces(false);
                    violationLoggedRef.current = false;
                    multipleFaceViolationLoggedRef.current = false;
                    movementViolationLoggedRef.current = false;
                    setIsSuspiciousMovement(false);

                    // Head Pose Estimation (Yaw/Pitch)
                    const landmarks = detections[0].landmarks;
                    const nose = landmarks.getNose()[3]; // Tip of the nose
                    const leftEye = landmarks.getLeftEye()[0];
                    const rightEye = landmarks.getRightEye()[3];
                    const jawOutline = landmarks.getJawOutline();
                    const leftJaw = jawOutline[0];
                    const rightJaw = jawOutline[16];

                    // Simple Head Pose Calculation (Yaw)
                    const faceWidth = rightJaw.x - leftJaw.x;
                    const nosePos = (nose.x - leftJaw.x) / faceWidth;

                    // Simple Pitch Calculation (Up/Down)
                    const eyeY = (leftEye.y + rightEye.y) / 1.1; // Slight adjustment for pitch sensitivity
                    const noseY = nose.y;
                    const vertRatio = (noseY - eyeY) / faceWidth;

                    const isLookingAway = nosePos < 0.35 || nosePos > 0.65 || vertRatio < 0.1 || vertRatio > 0.45;

                    if (isLookingAway) {
                        if (!suspiciousMovementStartRef.current) {
                            suspiciousMovementStartRef.current = Date.now();
                        } else {
                            const duration = (Date.now() - suspiciousMovementStartRef.current) / 1000;
                            if (duration > 3) {
                                setIsSuspiciousMovement(true);
                                if (!movementViolationLoggedRef.current) {
                                    addViolation('Suspicious Head Movement');
                                    movementViolationLoggedRef.current = true;
                                }
                            }
                        }
                    } else {
                        suspiciousMovementStartRef.current = null;
                        setIsSuspiciousMovement(false);
                        movementViolationLoggedRef.current = false;
                    }
                }
            }, 1000);
        };

        loadModels();

        // Tab Visibility & Focus
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsTabViolation(true);
                addViolation('Tab Switch Detected');
            }
        };

        const handleBlur = () => {
            setIsTabViolation(true);
            addViolation('Window Minimized / Lost Focus');
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            addViolation('Right Click Attempted');
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                addViolation('Fullscreen Exited', true);
            }
        };

        // Background Noise Detection
        const startAudioMonitoring = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current);
                analyserRef.current.fftSize = 256;

                const bufferLength = analyserRef.current.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const checkNoise = () => {
                    if (!analyserRef.current) return;
                    analyserRef.current.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((p, c) => p + c, 0) / bufferLength;

                    // Threshold for voice detection
                    if (average > 50) {
                        if (!voiceStartRef.current) {
                            voiceStartRef.current = Date.now();
                        } else {
                            const duration = (Date.now() - voiceStartRef.current) / 1000;
                            if (duration > 2) {
                                setIsVoiceDetected(true);
                                if (!voiceViolationLoggedRef.current) {
                                    addViolation('Background Voice Detected');
                                    voiceViolationLoggedRef.current = true;
                                }
                            }
                        }
                    } else {
                        voiceStartRef.current = null;
                        setIsVoiceDetected(false);
                        voiceViolationLoggedRef.current = false;
                    }
                    requestAnimationFrame(checkNoise);
                };
                checkNoise();
            } catch (err) {
                console.error('Error starting audio monitoring:', err);
                addViolation('Microphone Access Denied', true);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        startAudioMonitoring();

        return () => {
            if (faceDetectionIntervalRef.current) clearInterval(faceDetectionIntervalRef.current);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => { track.stop(); });
                streamRef.current = null;
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            analyserRef.current = null;
        };
    }, []);

    return {
        violations,
        lastViolationType,
        isFaceMissing,
        isMultipleFaces,
        isSuspiciousMovement,
        isVoiceDetected,
        isTabViolation,
        resetTabViolation: () => setIsTabViolation(false)
    };
};

export default useProctoring;
