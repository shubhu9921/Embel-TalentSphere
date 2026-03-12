import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Star, MessageSquare, Terminal, Award } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const TechnicalReview = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [feedback, setFeedback] = useState({ rating: 0, notes: '', decision: '' });

    useEffect(() => {
        const fetchReviewCandidates = async () => {
            try {
                const data = await ApiService.get('/candidates');
                // Only show candidates who have finished the exam or are shortlisted
                setCandidates(data.filter(c => c.status === 'shortlisted' || c.status === 'applied'));
            } catch (error) {
                console.error('Error fetching review candidates:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviewCandidates();
    }, []);

    const handleSubmitFeedback = async () => {
        if (!feedback.decision || !feedback.rating) return;

        try {
            await ApiService.patch(`/candidates/${selectedCandidate.id}`, {
                status: feedback.decision === 'hire' ? 'hired' : 'rejected',
                feedback: {
                    interviewerRating: feedback.rating,
                    technicalNotes: feedback.notes,
                    submittedAt: new Date().toISOString()
                }
            });
            setCandidates(candidates.filter(c => c.id !== selectedCandidate.id));
            setSelectedCandidate(null);
            setFeedback({ rating: 0, notes: '', decision: '' });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 page-fade-in">
            <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md pb-4 pt-4 border-b border-slate-200/50 mb-4">
                    <h1 className="text-3xl font-black text-[#19325c] tracking-tight">Technical Review</h1>
                    <p className="text-slate-500 font-medium mt-1">Select a candidate to submit evaluation.</p>
                </div>

                <div className="space-y-3">
                    {candidates.map((c) => (
                        <Card
                            key={c.id}
                            onClick={() => setSelectedCandidate(c)}
                            noPadding={true}
                            className={`p-4 cursor-pointer transition-all border-none shadow-elevation-high ${selectedCandidate?.id === c.id ? 'bg-[#ff6e00] text-white ring-4 ring-[#ff6e00]/20' : 'bg-white ring-1 ring-slate-100 hover:ring-[#ff6e00]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${selectedCandidate?.id === c.id ? 'bg-white/20 text-white' : 'bg-orange-50 text-[#ff6e00]'}`}>
                                    {c.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm leading-tight">{c.name}</p>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${selectedCandidate?.id === c.id ? 'text-orange-100' : 'text-slate-400'}`}>
                                        {c.position}
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${selectedCandidate?.id === c.id ? 'bg-white/20 text-white' : 'bg-[#ff6e00]/10 text-[#ff6e00]'}`}>
                                        {c.examScore || 'â€”'}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-8">
                {selectedCandidate ? (
                    <Card noPadding={true} className="p-8 border-none shadow-elevation-high ring-1 ring-slate-100 min-h-full ">
                        <div className="flex items-start justify-between mb-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-3xl bg-orange-50 flex items-center justify-center border border-orange-100">
                                    <Terminal className="w-7 h-7 text-[#ff6e00]" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-[#19325c] tracking-tight">{selectedCandidate.name}</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Full Assessment Detail</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Performance</p>
                                    <p className="text-3xl font-black text-emerald-500">{selectedCandidate.examScore || 'TBD'}/100</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center ring-4 ring-emerald-500/5">
                                    <Award className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Technical Proficiency</p>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Button
                                                key={s}
                                                variant={feedback.rating >= s ? 'secondary' : 'ghost'}
                                                size="sm"
                                                icon={Star}
                                                onClick={() => setFeedback({ ...feedback, rating: s })}
                                                className={`rounded-xl ${feedback.rating >= s ? 'shadow-lg shadow-secondary-500/30' : 'text-slate-300 border border-slate-100 hover:border-secondary-300'}`}
                                            >
                                                {/* No text needed, icon handles it */}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Final Decision</p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant={feedback.decision === 'hire' ? 'success' : 'ghost'}
                                            size="sm"
                                            onClick={() => setFeedback({ ...feedback, decision: 'hire' })}
                                            className={`flex-1 ${feedback.decision === 'hire' ? 'shadow-lg shadow-emerald-500/30' : 'text-emerald-600 border-emerald-100'}`}
                                        >
                                            Hire
                                        </Button>
                                        <Button
                                            variant={feedback.decision === 'reject' ? 'danger' : 'ghost'}
                                            size="sm"
                                            onClick={() => setFeedback({ ...feedback, decision: 'reject' })}
                                            className={`flex-1 ${feedback.decision === 'reject' ? 'shadow-lg shadow-red-500/30' : 'text-red-600 border-red-100'}`}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-slate-400 px-1">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <label className="text-[10px] font-black uppercase tracking-widest">Interviewer Notes & Internal Feedback</label>
                                </div>
                                <textarea
                                    rows={6}
                                    value={feedback.notes}
                                    onChange={(e) => setFeedback({ ...feedback, notes: e.target.value })}
                                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-4xl text-sm focus:outline-none focus:bg-white focus:ring-8 focus:ring-primary-500/5 transition-all resize-none font-medium text-slate-700"
                                    placeholder="Provide detailed feedback on data structures, problem solving, and cultural fit..."
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleSubmitFeedback}
                                    variant="primary"
                                    size="lg"
                                    icon={CheckCircle2}
                                    className="w-full shadow-2xl"
                                >
                                    Submit Final Evaluation
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-10 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-100 border-dashed">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-sm mb-8">
                            <Terminal className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-[#19325c] tracking-tight">Ready for Assessment</h3>
                        <p className="text-slate-500 font-medium max-w-sm mt-3">Select a candidate from the left panel to begin your technical review and record feedback.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicalReview;
