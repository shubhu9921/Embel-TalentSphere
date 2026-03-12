import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera, ShieldAlert, MonitorOff, Users, CheckCircle, ChevronRight, Info, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';

const ExamInstructions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cameraReady, setCameraReady] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const webcamRef = useRef(null);
    const webcamStreamRef = useRef(null);

    const handleUserMedia = (stream) => {
        webcamStreamRef.current = stream;
        setCameraReady(true);
    };

    React.useEffect(() => {
        return () => {
            if (webcamStreamRef.current) {
                webcamStreamRef.current.getTracks().forEach(track => {
                    track.stop();
                    console.log('ExamInstructions: Calibration track stopped');
                });
                webcamStreamRef.current = null;
            }
        };
    }, []);

    const isFinished = location.state?.finished;
    const reason = location.state?.reason;

    const rules = [
        { icon: Camera, text: "Camera must stay ON throughout the exam", color: "text-blue-500" },
        { icon: MonitorOff, text: "Tab switching or window blurring is strictly prohibited", color: "text-orange-500" },
        { icon: Users, text: "Multiple faces or extra people in the frame are not allowed", color: "text-purple-500" },
        { icon: ShieldAlert, text: "Malpractice detection will result in auto-submission", color: "text-red-500" },
        { icon: CheckCircle, text: "Candidates caught violating rules will be banned for 8 months", color: "text-slate-900" },
    ];

    if (isFinished) {
        const isMalpractice = reason && reason !== 'Manual submission' && reason !== 'Timer expired';

        return (
            <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 text-center overflow-hidden relative ${isMalpractice ? 'bg-red-950' : 'bg-gradient-to-br from-[#002D5E] to-[#112240]'
                }`}>
                <div className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] -ml-64 -mt-64 pointer-events-none ${isMalpractice ? 'bg-red-500/10' : 'bg-orange-500/5'
                    }`}></div>
                <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] -mr-64 -mb-64 pointer-events-none ${isMalpractice ? 'bg-red-600/10' : 'bg-blue-500/10'
                    }`}></div>

                <div className="relative z-10 animate-in zoom-in duration-700">
                    <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-white mb-8 mx-auto shadow-2xl ${isMalpractice ? 'bg-red-600 shadow-red-500/30' : 'bg-emerald-500 shadow-emerald-500/30'
                        }`}>
                        {isMalpractice ? <ShieldAlert size={56} className="animate-pulse" /> : <CheckCircle2 size={48} />}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                        {isMalpractice ? 'Assessment Terminated' : 'Assessment Submitted'}
                    </h1>

                    <div className={`mb-4 px-6 py-2 rounded-full inline-block font-black uppercase tracking-widest text-[10px] ${isMalpractice ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {isMalpractice ? 'Malpractice Detected' : 'Success'}
                    </div>

                    <p className={`text-lg max-w-md mx-auto font-medium mb-12 ${isMalpractice ? 'text-red-200' : 'text-slate-400'
                        }`}>
                        {isMalpractice
                            ? `Your assessment was automatically terminated due to: ${reason}`
                            : 'Your responses have been securely synced with the Embel Talentry engine.'}
                        <span className="block mt-4 opacity-70">
                            Our HR team will review the proctoring logs and recordings before finalizing your status.
                        </span>
                    </p>

                    <Button
                        onClick={() => navigate('/login')}
                        variant={isMalpractice ? 'danger' : 'primary'}
                        size="lg"
                        icon={ArrowRight}
                        className="shadow-2xl"
                    >
                        Return to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#002D5E] to-[#112240] p-6 md:p-12 font-sans selection:bg-orange-500/30 relative overflow-hidden flex flex-col items-center">
            {/* Massive decorative blurs */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] -ml-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -mr-64 -mb-64 pointer-events-none"></div>

            <header className="w-full max-w-6xl mb-12 flex items-center justify-between relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
                <img src="https://www.embel.co.in/images/logos/logo-embel.png" alt="Embel" className="h-10 object-contain drop-shadow-md" />
                <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">System Check: Optimal</span>
                </div>
            </header>

            <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter leading-[0.9]">Assessment <span className="text-[#ff6e00]">Guidelines</span></h1>
                        <p className="text-slate-400 mt-4 text-xl font-medium">Please review the integrity protocols carefully.</p>
                    </div>

                    <div className="p-8 bg-white rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6e00]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#ff6e00]/10 transition-colors"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-[#ff6e00]" />
                                Exam Protocols
                            </h3>
                            <div className="space-y-4">
                                {rules.map((rule, idx) => (
                                    <div key={idx} className="flex items-start gap-4 group/item">
                                        <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-[#ff6e00] transition-colors">
                                            <CheckCircle className="w-3.5 h-3.5 text-[#ff6e00] group-hover/item:text-white transition-colors" />
                                        </div>
                                        <span className="font-bold text-slate-600 text-lg leading-tight group-hover/item:text-slate-900 transition-colors">{rule.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Terms & Conditions</h3>

                            <label className="flex items-start gap-4 mb-8 cursor-pointer group/label">
                                <div className="relative flex items-center mt-1">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    />
                                    <div className="w-6 h-6 border-2 border-slate-200 rounded-lg group-hover/label:border-[#ff6e00] peer-checked:bg-[#ff6e00] peer-checked:border-[#ff6e00] transition-all flex items-center justify-center">
                                        <ShieldCheck className={`w-4 h-4 text-white transition-opacity ${acceptedTerms ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-slate-600 leading-relaxed group-hover/label:text-slate-900 transition-colors">
                                    I hereby agree to the proctoring terms and conditions. I understand that my camera, audio, and screen activity will be monitored throughout the assessment.
                                </span>
                            </label>

                            <Button
                                variant="secondary"
                                size="lg"
                                icon={ChevronRight}
                                disabled={!cameraReady || !acceptedTerms}
                                onClick={() => navigate('/exam')}
                                className="w-full shadow-2xl shadow-orange-500/30"
                            >
                                I UNDERSTAND, START NOW
                            </Button>

                            {(!cameraReady || !acceptedTerms) && (
                                <div className="mt-5 flex flex-col items-center gap-2">
                                    {!cameraReady && (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#ff6e00] flex items-center justify-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-[#ff6e00] rounded-full animate-pulse"></div>
                                            Awaiting camera verification
                                        </p>
                                    )}
                                    {!acceptedTerms && cameraReady && (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
                                            Please accept the terms to proceed
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sticky top-12 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-4 sm:p-8 border border-white/10 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Camera Calibration</h3>
                                <p className="text-slate-400 text-sm font-medium">Position your face within the frame</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Camera className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden border-[8px] border-slate-50 shadow-inner relative group">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                onUserMedia={handleUserMedia}
                                onUserMediaError={() => setCameraReady(false)}
                                className="w-full h-full object-cover"
                            />
                            {!cameraReady && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900/80 backdrop-blur-sm">
                                    <div className="w-16 h-16 border-4 border-white/20 border-t-[#ff6e00] rounded-full animate-spin mb-4"></div>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Requesting Stream</p>
                                </div>
                            )}
                            {cameraReady && (
                                <div className="absolute inset-x-8 inset-y-8 border-2 border-white/10 rounded-[4rem] pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-white/20 rounded-[40%] ring-[40px] ring-white/5"></div>
                                </div>
                            )}
                            <div className="absolute bottom-6 left-6 flex items-center gap-3 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                Live Preview
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-[#ff6e00]/20 transition-colors">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mic Audio</span>
                                <span className="text-emerald-500 font-bold text-xs uppercase tracking-wider">Active</span>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-[#ff6e00]/20 transition-colors">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network</span>
                                <span className="text-emerald-500 font-bold text-xs uppercase tracking-wider">Stable</span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-4 p-5 bg-[#ff6e00]/5 rounded-3xl border border-[#ff6e00]/10">
                            <div className="w-10 h-10 bg-[#ff6e00] rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5">
                                <Info className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800">Proctoring Notice</p>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Embel AI Proctoring will detect tab switching, multiple people, and suspicious visual patterns.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-20 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] relative z-10 opacity-50">
                SECURED BY EMBEL TALENTRY AI INTEGRITY
            </footer>
        </div>
    );
};

export default ExamInstructions;
