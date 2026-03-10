import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import apiService from '../../services/apiService';

const InterviewerDashboard = () => {
    const [stats, setStats] = useState({
        pending: 0,
        completedToday: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const candidates = await apiService.get('/candidates');
                const interviews = await apiService.get('/interviews') || [];

                const pending = candidates.filter(c => c.examScore !== null && c.status === 'pending').length;
                const today = new Date().toISOString().split('T')[0];
                const completedToday = interviews.filter(i => i.date === today && i.status === 'completed').length;

                setStats({
                    pending,
                    completedToday,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching interviewer stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
    }, []);

    if (stats.loading) {
        return (
            <div className="flex items-center justify-center p-20 text-[#ff6e00]">
                <Clock className="animate-spin mr-2" />
                <span className="font-bold uppercase tracking-widest text-sm">Loading Workspace...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interviewer Workspace</h1>
                <p className="text-slate-500 font-medium mt-1">Review assigned candidates and conduct technical assessments.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Card className="p-6 border-none shadow-md shadow-orange-100/50 hover:shadow-xl hover:translate-y-[-4px] ring-1 ring-slate-100 hover:ring-[#ff6e00] hover:bg-orange-50 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-[#ff6e00]" />
                        <span className="text-[10px] font-black text-[#ff6e00] uppercase tracking-widest">Pending Reviews</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900">{stats.pending.toString().padStart(2, '0')}</h2>
                </Card>
                <Card className="p-6 border-none shadow-md shadow-orange-100/50 hover:shadow-xl hover:translate-y-[-4px] ring-1 ring-slate-100 hover:ring-[#ff6e00] hover:bg-orange-50 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={16} className="text-[#ff6e00]" />
                        <span className="text-[10px] font-black text-[#ff6e00] uppercase tracking-widest">Completed Today</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900">{stats.completedToday.toString().padStart(2, '0')}</h2>
                </Card>
            </div>
        </div>
    );
};

export default InterviewerDashboard;
