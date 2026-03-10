import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import apiService from '../../services/apiService';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import Button from '../../components/Button';

const AssignedInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('admin_user'));

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const [intData, candData] = await Promise.all([
                    apiService.get('/interviews'),
                    apiService.get('/candidates')
                ]);

                const myInterviews = (intData || [])
                    .filter(i => i.interviewerId === user.id)
                    .map(i => ({
                        ...i,
                        candidate: candData.find(c => c.id === i.candidateId)
                    }));

                setInterviews(myInterviews);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, [user.id]);

    const stats = {
        total: interviews.length,
        today: interviews.filter(i => i.date === new Date().toISOString().split('T')[0]).length,
        completed: interviews.filter(i => i.status === 'completed').length
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assigned Interviews</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your upcoming technical rounds and candidate discussions.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                    { label: 'Assigned Rounds', value: stats.total, icon: User },
                    { label: 'Scheduled Today', value: stats.today, icon: Clock },
                    { label: 'Evaluations Done', value: stats.completed, icon: CheckCircle2 }
                ].map((s, i) => (
                    <Card key={i} className="p-6 shadow-md shadow-orange-100/50 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 ring-1 ring-slate-100 hover:ring-[#ff6e00] border-none hover:bg-orange-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100/50 flex items-center justify-center text-[#ff6e00]">
                                <s.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                                <p className="text-2xl font-black text-slate-900">{s.value.toString().padStart(2, '0')}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {interviews.length > 0 ? interviews.map((interview) => (
                    <Card key={interview.id} className="p-6 border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex items-center justify-between group hover:ring-primary-100 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-all">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Day</span>
                                <span className="text-lg font-black text-slate-900 leading-none group-hover:text-primary-600">
                                    {new Date(interview.date).getDate()}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base font-black text-slate-900">{interview.candidate?.name}</h3>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">
                                        {interview.candidate?.position}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{interview.time} (UTC+5:30)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-xl flex items-center gap-2 border-slate-200">
                                <ExternalLink className="w-4 h-4" />
                                <span>Join Round</span>
                            </Button>
                            <Button className="rounded-xl flex items-center gap-2">
                                <span>Fill Feedback</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                )) : (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900">No Interviews Scheduled</h3>
                        <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">You don't have any assigned interviews at the moment. Take a break!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignedInterviews;
