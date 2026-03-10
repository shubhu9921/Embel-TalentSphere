import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { Mail, Users, Clock } from 'lucide-react';
import apiService from '../../services/apiService';

const HRDashboard = () => {
    const [stats, setStats] = useState({
        emailsSent: 0,
        toNotify: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const candidates = await apiService.get('/candidates');

                // Logic: candidates with feedback have been "notified" (emails sent)
                // candidates with status != 'pending' but no feedback might need notification
                const notified = candidates.filter(c => c.feedback !== null).length;
                const toNotify = candidates.filter(c => (c.status === 'shortlisted' || c.status === 'rejected') && c.feedback === null).length;

                setStats({
                    emailsSent: notified + 120, // Baseline mock + real data
                    toNotify,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching HR stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
    }, []);

    if (stats.loading) {
        return (
            <div className="flex items-center justify-center p-20 text-[#ff6e00]">
                <Clock className="animate-spin mr-2" />
                <span className="font-bold uppercase tracking-widest text-sm">Opening Portal...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">HR Communication Portal</h1>
                <p className="text-slate-500 font-medium mt-1">Manage candidate emails and recruitment workflows.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Card className="p-6 border-none shadow-md shadow-orange-100/50 hover:shadow-xl hover:translate-y-[-4px] ring-1 ring-slate-100 hover:ring-[#ff6e00] hover:bg-orange-50 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail size={16} className="text-[#ff6e00]" />
                        <span className="text-[10px] font-black text-[#ff6e00] uppercase tracking-widest">Emails Sent</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900">{stats.emailsSent}</h2>
                </Card>
                <Card className="p-6 border-none shadow-md shadow-orange-100/50 hover:shadow-xl hover:translate-y-[-4px] ring-1 ring-slate-100 hover:ring-[#ff6e00] hover:bg-orange-50 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-[#ff6e00]" />
                        <span className="text-[10px] font-black text-[#ff6e00] uppercase tracking-widest">Candidates to Notify</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900">{stats.toNotify.toString().padStart(2, '0')}</h2>
                </Card>
            </div>
        </div>
    );
};

export default HRDashboard;
