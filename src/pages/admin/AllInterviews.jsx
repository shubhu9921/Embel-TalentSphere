import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Filter, Search, MoreVertical, ExternalLink, CheckCircle } from 'lucide-react';
import apiService from '../../services/apiService';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import Button from '../../components/Button';

const AllInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [intData, candData, adminData] = await Promise.all([
                    apiService.get('/interviews'),
                    apiService.get('/candidates'),
                    apiService.get('/admin_users')
                ]);

                const enrichedInterviews = intData.map(i => ({
                    ...i,
                    candidate: candData.find(c => c.id === i.candidateId),
                    interviewer: adminData.find(a => a.id === i.interviewerId)
                }));

                setInterviews(enrichedInterviews);
            } catch (error) {
                console.error('Error fetching all interviews:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const stats = {
        total: interviews.length,
        upcoming: interviews.filter(i => i.status === 'scheduled').length,
        completed: interviews.filter(i => i.status === 'completed').length,
        canceled: interviews.filter(i => i.status === 'canceled').length
    };

    const filteredInterviews = interviews.filter(i =>
        i.candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.interviewer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Interview Schedule</h1>
                    <p className="text-slate-500 font-medium mt-1">Monitor all technical rounds and interview performance across the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                        <input
                            type="text"
                            placeholder="Find session..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Sessions', value: stats.total, icon: Calendar },
                    { label: 'Upcoming', value: stats.upcoming, icon: Clock },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle },
                    { label: 'Canceled', value: stats.canceled, icon: Filter }
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
                {filteredInterviews.map((interview) => (
                    <Card key={interview.id} className="p-6 border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex items-center justify-between group hover:ring-primary-100 transition-all">
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100 min-w-[70px]">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(interview.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                <span className="text-xl font-black text-slate-900 leading-none mt-1">{new Date(interview.date).getDate()}</span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-slate-900">{interview.candidate?.name}</h3>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                    <span className="text-xs font-bold text-slate-500">{interview.candidate?.position}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{interview.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <User className="w-3.5 h-3.5" />
                                        <span>Interviewer: <span className="text-slate-600 font-bold">{interview.interviewer?.name}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${interview.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'}`}>
                                {interview.status}
                            </div>
                            <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </Card>
                ))}

                {filteredInterviews.length === 0 && (
                    <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No matching interview sessions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllInterviews;
