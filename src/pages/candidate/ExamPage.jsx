import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { 
    ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck, CheckCircle2, 
    Users, EyeOff, Mic, MonitorX 
} from 'lucide-react';
import Button from '../../components/Button';
import useTimer from '../../hooks/useTimer';
import useProctoring from '../../hooks/useProctoring';
import CodingEditor from './CodingEditor';
import Timer from '../../components/Timer';
import Loader from '../../components/Loader';
import ApiService from '../../services/ApiService';

const ViolationOverlay = ({ active, type, icon: Icon, title, message, color, onAction, actionLabel, violations }) => {
    if (!active) return null;
    return (
        <div className={`fixed inset-0 z-150 ${color} backdrop-blur-2xl flex flex-col items-center justify-center text-white p-10 animate-in zoom-in duration-300`}>
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
                <Icon size={56} className="text-white" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-center">{title}</h2>
            <div className="bg-white/20 px-6 py-2 rounded-full mb-6 border border-white/30 backdrop-blur-md">
                <span className="text-sm font-black tracking-widest uppercase">Warning {violations} of 3</span>
            </div>
            <p className="text-xl font-bold opacity-80 max-w-lg text-center leading-relaxed mb-10">{message}</p>
            {onAction && (
                <Button onClick={onAction} variant="primary" size="lg" className="px-12 bg-white text-slate-900 border-none shadow-2xl">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

const FullscreenPrompt = ({ active, onEnter }) => {
    if (!active) return null;
    return (
        <div className="fixed inset-0 z-100 bg-[#002D5E]/95 backdrop-blur-xl flex flex-col items-center justify-center text-white p-10 text-center">
            <ShieldCheck size={80} className="text-orange-500 mb-8 animate-bounce" />
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Enter Fullscreen Mode</h2>
            <p className="text-slate-300 mb-10 max-w-md font-medium text-lg leading-relaxed">
                To maintain assessment integrity, this exam must be taken in fullscreen mode.
                <span className="block text-orange-500 mt-2 font-bold italic">After 3 violations, the test will be automatically submitted.</span>
                <span className="block text-red-400 mt-1 font-bold">Exiting fullscreen results in immediate auto-submission.</span>
            </p>
            <Button onClick={onEnter} variant="secondary" size="lg" className="px-12 shadow-2xl shadow-orange-500/20">
                Enable Fullscreen & Begin
            </Button>
        </div>
    );
};

const ExamHeader = ({ candidate, violations, seconds, onSubmit }) => (
    <header className="bg-linear-to-r from-[#002D5E] to-[#112240] border-b border-white/10 px-8 py-4 flex items-center justify-between z-30 shadow-2xl relative">
        <div className="flex items-center gap-12">
            <img src="https://www.embel.co.in/images/logos/logo-embel.png" alt="Embel" className="h-8 object-contain mix-blend-screen brightness-200" />
            <div className="hidden lg:flex items-center gap-6">
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Candidate</span>
                    <span className="text-sm font-bold text-white uppercase leading-none mt-1">{candidate?.name}</span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Violation Strikes</span>
                    <div className="flex gap-1.5 mt-1.5">
                        {[1, 2, 3].map((strike) => (
                            <div key={strike} className={`w-3 h-3 rounded-full border ${violations >= strike ? 'bg-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-transparent border-white/20'} transition-all duration-500`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <ShieldCheck className="w-4 h-4" /> AI Proctoring Active
            </div>
            <div className="flex items-center gap-6 pl-6 border-l border-white/10">
                <Timer seconds={seconds} light />
                <Button onClick={onSubmit} variant="secondary" size="md" className="shadow-xl shadow-orange-500/20">Submit Paper</Button>
            </div>
        </div>
    </header>
);

const Sidebar = ({ webcamRef, violations, questions, answers, currentQuestion, setCurrentQuestion }) => (
    <aside className="w-80 bg-white border-r border-slate-100 flex flex-col overflow-y-auto lg:flex shadow-2xl relative z-10">
        <div className="p-8">
            <div className="aspect-video bg-slate-900 rounded-4xl overflow-hidden border-[6px] border-slate-50 shadow-2xl relative mb-8 group">
                <Webcam audio={false} ref={webcamRef} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 bg-red-500/90 backdrop-blur-sm text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Live REC
                </div>
            </div>
            <div className="space-y-8">
                <div className="p-6 rounded-4xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity Rank</span>
                        <span className={`text-sm font-black ${violations > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{Math.max(0, 100 - (violations * 33.3)).toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${violations >= 2 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.max(0, 100 - (violations * 33.3))}%` }}></div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Matrix</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{Object.keys(answers).length}/{questions.length} Saved</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        {questions.map((q, idx) => (
                            <Button
                                key={q.id}
                                onClick={() => setCurrentQuestion(idx)}
                                variant={currentQuestion === idx ? 'primary' : answers[q.id] ? 'success' : 'ghost'}
                                size="sm"
                                className={`h-11 font-black rounded-xl border-2 ${currentQuestion === idx ? 'shadow-xl shadow-blue-500/20' : answers[q.id] ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                            >
                                {idx + 1}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </aside>
);

import { isMobileDevice } from '../../utils/deviceDetection';

const MobileBlockingOverlay = () => (
    <div className="fixed inset-0 z-[1000] bg-[#002D5E] flex flex-col items-center justify-center text-white p-10 text-center">
        <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-orange-500 mb-8 border border-white/20 shadow-2xl">
            <MonitorX size={56} />
        </div>
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Desktop Access Required</h2>
        <p className="text-slate-300 mb-10 max-w-md font-medium text-lg leading-relaxed">
            This exam cannot be taken on a smartphone or tablet. Please switch to a 
            <span className="text-orange-500 font-bold block mt-2">Desktop or Laptop computer</span> 
            to continue with the assessment.
        </p>
    </div>
);

const ExamPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [candidate, setCandidate] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const containerRef = useRef(null);

    const enterFullscreen = () => {
        if (containerRef.current) {
            const elem = containerRef.current;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message}`));
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }
    };

    useEffect(() => {
        if (isMobileDevice()) {
            setIsMobile(true);
            setLoading(false);
            return;
        }

        const storedCandidate = JSON.parse(localStorage.getItem('candidate'));
        if (!storedCandidate) {
            navigate('/login');
            return;
        }
        setCandidate(storedCandidate);

        const fetchQuestions = async () => {
            try {
                const data = await ApiService.get('/questions');
                const activePool = data.filter(q => q.position === storedCandidate.position && q.selected === true);
                const shuffled = [...activePool].sort(() => Math.random() - 0.5);
                setQuestions(shuffled);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [navigate]);

    const onSubmit = useCallback(async (reason = 'Manual submission') => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const isMalpractice = reason.includes('terminated') || reason.includes('MALPRACTICE');
            
            let score = 0;
            if (!isMalpractice) {
                let correctCount = 0;
                questions.forEach((q) => {
                    // Normalize answers for comparison
                    const userAnswer = answers[q.id];
                    const correctAnswer = q.correctAnswer || q.correct;
                    if (userAnswer === correctAnswer) correctCount++;
                });
                score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
            }

            const updateData = {
                examScore: Math.round(score),
                status: isMalpractice ? 'DISQUALIFIED' : 'applied',
                submissionReason: reason,
                submittedAt: new Date().toISOString(),
                assignedQuestions: questions.map(q => q.id)
            };

            await ApiService.patch(`/candidates/${candidate?.id}`, updateData);

            localStorage.setItem('candidate', JSON.stringify({
                ...candidate,
                ...updateData
            }));

            localStorage.removeItem(`exam_expiry_${candidate?.id}`);

            if (document.fullscreenElement) {
                document.exitFullscreen();
            }

            navigate('/exam-instructions', { state: { finished: true, reason } });
        } catch (error) {
            console.error('Error submitting exam:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [navigate, questions, answers, candidate, isSubmitting]);

    // Fix timer duration: 45 minutes
    const { seconds } = useTimer(45, () => onSubmit('Timer expired'));
    
    const { 
        violations, isFaceMissing, isMultipleFaces, isSuspiciousMovement, 
        isVoiceDetected, isTabViolation, resetTabViolation 
    } = useProctoring(onSubmit, webcamRef, candidate?.id, 3);

    const handleAnswerSelect = (option) => {
        const qId = questions[currentQuestion]?.id;
        if (qId) setAnswers(prev => ({ ...prev, [qId]: option }));
    };

    const handleCodingChange = (code) => {
        const qId = questions[currentQuestion]?.id;
        if (qId) setAnswers(prev => ({ ...prev, [qId]: code }));
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#002D5E] to-[#112240] text-white">
            <Loader size="lg" className="mb-6" />
            <p className="font-black uppercase tracking-[0.2em] animate-pulse">Initializing Environment</p>
        </div>
    );

    if (isMobile) return <MobileBlockingOverlay />;

    if (questions.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#002D5E] to-[#112240] p-10 text-center relative">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-orange-500 mb-8 backdrop-blur-xl border border-white/10">
                <AlertTriangle size={48} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">No Questions Available</h2>
            <p className="text-slate-400 mb-10 max-w-md font-medium">We couldn't find any questions for your selected position. Please contact HR to resolve this.</p>
            <Button onClick={() => navigate('/login')} variant="primary" size="lg" className="bg-[#ff6e00] text-white border-none shadow-[0_10px_40px_rgba(255,110,0,0.3)] hover:shadow-[0_20px_60px_rgba(255,110,0,0.45)] hover:bg-[#e05d00] font-black tracking-widest px-12 rounded-2xl transition-all duration-300 transform hover:-translate-y-1">Return to Login</Button>
        </div>
    );

    const activeQuestion = questions[currentQuestion];
    const isLastQuestion = currentQuestion === questions.length - 1;

    return (
        <div ref={containerRef} className="h-screen bg-slate-50 flex flex-col font-sans antialiased overflow-hidden select-none relative">
            <ViolationOverlay 
                active={isTabViolation} 
                icon={MonitorX} 
                title="Malpractice Attempt Detected" 
                message="You switched tabs or minimized the window. This event has been recorded." 
                color="bg-purple-900/95" 
                onAction={resetTabViolation} 
                actionLabel="Accept & Continue" 
                violations={violations}
            />
            <ViolationOverlay 
                active={isMultipleFaces} 
                icon={Users} 
                title="Multiple Faces Detected" 
                message="Please ensure you are alone. Integrity violation has been logged." 
                color="bg-orange-600/90" 
                violations={violations}
            />
            <ViolationOverlay 
                active={isSuspiciousMovement} 
                icon={EyeOff} 
                title="Suspicious Head Movement" 
                message="Suspicious head movement detected. Please focus on the screen." 
                color="bg-yellow-600/90" 
                violations={violations}
            />
            <ViolationOverlay 
                active={isVoiceDetected} 
                icon={Mic} 
                title="Background Voice Detected" 
                message="Background voice detected. Please ensure you are alone." 
                color="bg-indigo-600/90" 
                violations={violations}
            />
            <ViolationOverlay 
                active={isFaceMissing} 
                icon={AlertTriangle} 
                title="Face Not Detected" 
                message="You moved away from the screen. Please remain visible during the interview." 
                color="bg-red-600/90" 
                violations={violations}
            />
            
            <FullscreenPrompt 
                active={!loading && typeof document !== 'undefined' && !document.fullscreenElement} 
                onEnter={enterFullscreen} 
            />

            <ExamHeader candidate={candidate} violations={violations} seconds={seconds} onSubmit={() => onSubmit('Manual submission')} />

            <div className="flex-1 flex overflow-hidden relative">
                <Sidebar 
                    webcamRef={webcamRef} 
                    violations={violations} 
                    questions={questions} 
                    answers={answers} 
                    currentQuestion={currentQuestion} 
                    setCurrentQuestion={setCurrentQuestion} 
                />

                <main className="flex-1 overflow-y-auto bg-slate-50/30 p-8 md:p-12 relative">
                    <div className="max-w-4xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white p-10 md:p-14 mb-8">
                            <div className="flex flex-wrap items-start justify-between gap-6 mb-12">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-3xl bg-[#002D5E] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-900/20">
                                        {(currentQuestion + 1).toString().padStart(2, '0')}
                                    </div>
                                    <div>
                                        <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] inline-block mb-2">
                                            {activeQuestion.type === 'mcq' ? 'Multiple Choice' : 'Coding Challenge'}
                                        </span>
                                        <h3 className="text-2xl font-black text-slate-800 leading-tight">{activeQuestion.text}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                {activeQuestion.type === 'mcq' ? (
                                    <div className="grid grid-cols-1 gap-5">
                                        {activeQuestion.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswerSelect(option)}
                                                className={`w-full p-8 text-left rounded-4xl border-2 transition-all group relative overflow-hidden ${answers[activeQuestion.id] === option
                                                    ? 'bg-orange-50 border-orange-500 text-slate-900 shadow-xl shadow-orange-500/10'
                                                    : 'bg-white border-slate-100 text-slate-600 hover:border-orange-200 hover:bg-slate-50/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-6 relative z-10">
                                                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm transition-colors ${answers[activeQuestion.id] === option ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600'}`}>
                                                        {String.fromCodePoint(65 + idx)}
                                                    </div>
                                                    <span className="font-bold text-lg">{option}</span>
                                                </div>
                                                {answers[activeQuestion.id] === option && (
                                                    <div className="absolute top-1/2 -translate-y-1/2 right-10">
                                                        <CheckCircle2 className="w-6 h-6 text-orange-500" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-125 rounded-4xl overflow-hidden border-4 border-slate-50 shadow-inner">
                                        <CodingEditor
                                            initialCode={activeQuestion.initialCode || ''}
                                            language={activeQuestion.language || 'javascript'}
                                            onSave={handleCodingChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-4 pb-12">
                            <Button
                                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestion === 0}
                                variant="outline"
                                size="md"
                                icon={ChevronLeft}
                                className="bg-white text-slate-600 border-slate-200 shadow-xl"
                            >
                                Previous
                            </Button>

                            <div className="flex items-center gap-2">
                                {questions.map((_, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setCurrentQuestion(idx)}
                                        className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${currentQuestion === idx ? 'w-10 bg-orange-500' : 'w-2 bg-slate-300'}`}
                                    ></div>
                                ))}
                            </div>

                            <Button
                                onClick={() => {
                                    if (isLastQuestion) onSubmit('Manual submission');
                                    else setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1));
                                }}
                                variant="primary"
                                size="lg"
                                icon={ChevronRight}
                                className="shadow-xl"
                            >
                                {isLastQuestion ? 'Finish Assessment' : 'Next Question'}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>

            {isSubmitting && (
                <div className="fixed inset-0 z-[200] bg-[#002D5E]/95 backdrop-blur-xl flex flex-col items-center justify-center text-white p-10 page-fade-in">
                    <div className="relative mb-12">
                        <div className="w-24 h-24 border-8 border-white/20 border-t-orange-500 rounded-full animate-spin"></div>
                        <ShieldCheck className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">Securing Assessment</h3>
                    <p className="text-slate-400 font-medium tracking-wide text-lg text-center max-w-md">Syncing your encrypted responses with Embel Talentry Integrity Engine...</p>
                    <div className="mt-12 w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 animate-[loading_2s_ease-in-out_infinite] w-1/3"></div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}</style>
        </div>
    );
};

export default ExamPage;
