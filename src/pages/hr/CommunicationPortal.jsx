import React, { useState, useEffect } from 'react';
import { Send, Mail, CheckCircle2, AlertTriangle, Clock, History, FileText, ChevronRight } from 'lucide-react';
import apiService from '../../services/apiService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const CommunicationPortal = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('invite');
    const [sending, setSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const data = await apiService.get('/candidates');
                setCandidates(data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const emailTemplates = {
        invite: {
            subject: 'Action Required: Assessment Invitation from Embel TalentSphere',
            body: 'Dear Candidate, We are pleased to invite you to take our technical assessment for the position you applied for...'
        },
        shortlist: {
            subject: 'Next Round: Your Technical Interview has been scheduled',
            body: 'Congratulations! Your performance in the initial screening was impressive. We have scheduled your F2F interview...'
        },
        rejection: {
            subject: 'Update on your application with Embel',
            body: 'Thank you for your interest in Embel. After careful review, we have decided not to move forward with your application...'
        }
    };

    const handleSendBulk = async () => {
        setSending(true);
        // Simulate background processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSending(false);
        setSuccessMsg(`Success! Notifications have been queued for ${candidates.length} candidates.`);
        setTimeout(() => setSuccessMsg(''), 5000);
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Communication Portal</h1>
                    <p className="text-slate-500 font-medium mt-1">Send personalized or automated status updates via email.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SMTP System Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 border-none shadow-md shadow-orange-100/50 ring-1 ring-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Template Selector</h3>
                        <div className="space-y-3">
                            {Object.keys(emailTemplates).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${selectedType === type ? 'bg-[#ff6e00] text-white border-[#ff6e00] shadow-lg shadow-[#ff6e00]/20' : 'bg-white text-slate-600 border-slate-100 hover:bg-orange-50 hover:border-[#ff6e00] hover:text-[#ff6e00]'
                                        }`}
                                >
                                    <span className="text-xs font-black uppercase tracking-widest">{type}</span>
                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 border-none bg-slate-900 text-white shadow-xl shadow-slate-900/40">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <History className="w-5 h-5 text-[#ff6e00]" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#ff6e00]">Recent Activity</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-white/5">
                                <p className="text-[11px] font-bold text-slate-500">TODAY, 10:45 AM</p>
                                <p className="text-xs font-medium mt-1 text-slate-300">Sent <span className="text-[#ff6e00] font-bold">Shortlist</span> email to 12 candidates</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-500">YESTERDAY, 04:20 PM</p>
                                <p className="text-xs font-medium mt-1 text-slate-300">Sent <span className="text-orange-400 font-bold">Assessment</span> invite to Shubham K.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {successMsg && (
                        <div className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 shadow-xl shadow-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5" />
                            <p className="text-sm font-bold">{successMsg}</p>
                        </div>
                    )}

                    <Card className="p-8 border-none shadow-md shadow-orange-100/50 ring-1 ring-slate-100 h-full">
                        <div className="mb-8 p-6 bg-orange-50/30 rounded-3xl border border-orange-100/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-orange-100 shadow-sm">
                                    <FileText className="w-4 h-4 text-[#ff6e00]" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Template Preview</span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900 mb-2">{emailTemplates[selectedType].subject}</h2>
                            <div className="h-1 bg-[#ff6e00] w-12 rounded-full mb-4"></div>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                {emailTemplates[selectedType].body}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex -space-x-3 overflow-hidden p-1">
                                    {candidates.slice(0, 5).map((c, i) => (
                                        <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-orange-50 flex items-center justify-center text-[10px] font-black text-[#ff6e00]">
                                            {c.name.charAt(0)}
                                        </div>
                                    ))}
                                    {candidates.length > 5 && (
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-[#ff6e00] text-white text-[10px] font-black">
                                            +{candidates.length - 5}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={handleSendBulk}
                                    disabled={sending}
                                    className="px-10 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#ff6e00]/20 bg-[#ff6e00] hover:bg-[#e05d00] border-none"
                                >
                                    {sending ? 'Sending Notifications...' : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send to {candidates.length} Candidates</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CommunicationPortal;
