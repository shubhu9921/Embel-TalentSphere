import React, { useState, useEffect } from 'react';
import { Send, Mail, CheckCircle2, AlertTriangle, Clock, History, FileText, ChevronRight } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const CommunicationPortal = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('invite');
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [sending, setSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [activities, setActivities] = useState([]);
    
    // Dynamic Fields
    const [assessmentDate, setAssessmentDate] = useState('');
    const [assessmentTime, setAssessmentTime] = useState('');
    const [interviewRound, setInterviewRound] = useState('Technical');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [candData, actData] = await Promise.all([
                    ApiService.get('/candidates'),
                    ApiService.get('/activities?_sort=timestamp&_order=desc&_limit=5')
                ]);
                setCandidates(candData);
                setActivities(actData);
            } catch (error) {
                console.error('Error fetching portal data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredCandidates = React.useMemo(() => {
        switch (selectedType) {
            case 'invite':
                return candidates.filter(c => c.status === 'registered');
            case 'shortlist':
                return candidates.filter(c => c.examScore !== null && c.examScore >= 40); // Assuming 40 is pass mark
            case 'rejection':
                return candidates.filter(c => c.status === 'rejected' || c.status === 'not selected');
            default:
                return [];
        }
    }, [candidates, selectedType]);

    // Reset selection when template changes
    useEffect(() => {
        setSelectedCandidates([]);
    }, [selectedType]);

    const toggleCandidate = (id) => {
        setSelectedCandidates(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedCandidates.length === filteredCandidates.length) {
            setSelectedCandidates([]);
        } else {
            setSelectedCandidates(filteredCandidates.map(c => c.id));
        }
    };

    const emailTemplates = {
        invite: {
            subject: 'Assessment Invitation: {company_name}',
            body: 'Dear {candidate_name}, You are invited to participate in the assessment scheduled on {assessment_date}. Please use the direct login link if you have already registered.'
        },
        shortlist: {
            subject: 'Shortlisted for {interview_round} Round',
            body: 'Congratulations {candidate_name}! You have been shortlisted for the {interview_round} interview round. Our team will contact you soon.'
        },
        rejection: {
            subject: 'Application Status: {company_name}',
            body: 'Thank you {candidate_name} for your interest in {company_name}. After careful review, we have decided not to move forward with your application at this time.'
        }
    };

    const getPreviewContent = (text) => {
        if (!text) return '';
        return text
            .replace(/{candidate_name}/g, 'John Doe')
            .replace(/{assessment_date}/g, assessmentDate ? `${assessmentDate} ${assessmentTime}` : '[Select Date/Time]')
            .replace(/{interview_round}/g, interviewRound)
            .replace(/{company_name}/g, 'Embel Talentry');
    };

    const handleSendBulk = async () => {
        if (selectedCandidates.length === 0) return;
        setSending(true);
        try {
            const template = emailTemplates[selectedType];
            const timestamp = new Date().toISOString();
            
            // Log activity for each candidate or as a batch?
            // User requested: "Sent Shortlist email to X candidates" or "Sent Assessment Invite to candidate name"
            let logMessage = '';
            if (selectedCandidates.length === 1) {
                const cand = candidates.find(c => c.id === selectedCandidates[0]);
                const typeLabel = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
                logMessage = `Sent ${typeLabel} email to ${cand?.name || 'Unknown Candidate'}`;
            } else {
                const typeLabel = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
                logMessage = `Sent ${typeLabel} email to ${selectedCandidates.length} candidates`;
            }

            await ApiService.post('/activities', {
                type: selectedType,
                count: selectedCandidates.length,
                message: logMessage,
                timestamp: timestamp
            });

            // Simulate actual email sending
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setSuccessMsg(`Success! Notifications have been sent to ${selectedCandidates.length} candidates.`);
            setSelectedCandidates([]);
            
            // Refresh activities
            const actData = await ApiService.get('/activities?_sort=timestamp&_order=desc&_limit=5');
            setActivities(actData);
            
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {
            console.error('Error sending emails:', error);
            alert('Failed to send notifications.');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-8 page-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#19325c] tracking-tight">Communication Portal</h1>
                    <p className="text-slate-500 font-medium mt-1">Send personalized or automated status updates via email.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SMTP System Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 border-none ring-1 ring-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Template Selector</h3>
                        <div className="space-y-3">
                            {Object.keys(emailTemplates).map((type) => (
                                <Button
                                    key={type}
                                    variant={selectedType === type ? 'secondary' : 'ghost'}
                                    size="md"
                                    icon={ChevronRight}
                                    onClick={() => setSelectedType(type)}
                                    className={`w-full justify-between hover:scale-[1.02] shadow-lg ${selectedType === type ? 'shadow-orange-500/20' : 'border-slate-100 hover:border-[#ff6e00]'}`}
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 border-none bg-slate-900 text-white shadow-xl shadow-slate-900/40 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6e00]/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <History className="w-5 h-5 text-[#ff6e00]" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#ff6e00]">Recent Activity</h3>
                        </div>
                        <div className="space-y-4 relative z-10">
                            {activities.length > 0 ? activities.map((act, i) => (
                                <div key={i} className={`pb-4 ${i !== activities.length - 1 ? 'border-b border-white/5' : ''}`}>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                        {new Date(act.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-xs font-medium mt-1 text-slate-300">
                                        {act.message.split(new RegExp(`(${act.type})`, 'i')).map((part, index) => 
                                            part.toLowerCase() === act.type.toLowerCase() ? 
                                            <span key={index} className="text-[#ff6e00] font-bold">{part}</span> : part
                                        )}
                                    </p>
                                </div>
                            )) : (
                                <div className="py-4 text-center">
                                    <p className="text-xs text-slate-500 italic">No recent activity</p>
                                </div>
                            )}
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

                    <Card className="p-8 border-none ring-1 ring-slate-100 h-full">
                        <div className="mb-8 space-y-6">
                            {(selectedType === 'invite' || selectedType === 'shortlist') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                                    {selectedType === 'invite' ? (
                                        <>
                                            <div className="space-y-2">
                                                <label htmlFor="assessment-date" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Date</label>
                                                <input 
                                                    id="assessment-date"
                                                    type="date" 
                                                    value={assessmentDate}
                                                    onChange={(e) => setAssessmentDate(e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="assessment-time" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Time</label>
                                                <input 
                                                    id="assessment-time"
                                                    type="time" 
                                                    value={assessmentTime}
                                                    onChange={(e) => setAssessmentTime(e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] outline-none transition-all"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-2 col-span-2">
                                            <label htmlFor="interview-round" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Interview Round</label>
                                            <select 
                                                id="interview-round"
                                                value={interviewRound}
                                                onChange={(e) => setInterviewRound(e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Technical">Technical Interview</option>
                                                <option value="HR">HR Interview</option>
                                                <option value="Face-to-Face">Face-to-Face Interview</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="p-6 bg-orange-50/30 rounded-3xl border border-orange-100/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-orange-100 shadow-sm">
                                        <FileText className="w-4 h-4 text-[#ff6e00]" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Template Preview</span>
                                </div>
                                <h2 className="text-xl font-black text-[#19325c] mb-2">{getPreviewContent(emailTemplates[selectedType].subject)}</h2>
                                <div className="h-1 bg-[#ff6e00] w-12 rounded-full mb-4"></div>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    {getPreviewContent(emailTemplates[selectedType].body)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Recipients ({filteredCandidates.length})</h3>
                                {filteredCandidates.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={toggleAll}
                                        className="text-[#ff6e00]"
                                    >
                                        {selectedCandidates.length === filteredCandidates.length ? 'Deselect All' : 'Select All Group'}
                                    </Button>
                                )}
                            </div>
                            
                            <div className="max-h-[240px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                {filteredCandidates.length > 0 ? filteredCandidates.map((c) => (
                                    <Button
                                        key={c.id}
                                        variant={selectedCandidates.includes(c.id) ? 'secondary' : 'ghost'}
                                        size="md"
                                        onClick={() => toggleCandidate(c.id)}
                                        className={`w-full justify-between items-center transition-all cursor-pointer ${selectedCandidates.includes(c.id) ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-500/5' : 'bg-white border-slate-100 hover:border-orange-100'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${selectedCandidates.includes(c.id) ? 'bg-[#ff6e00] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                {c.name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-900 leading-none">{c.name}</p>
                                                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">{c.email}</p>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedCandidates.includes(c.id) ? 'bg-[#ff6e00] border-[#ff6e00]' : 'bg-white border-slate-200'}`}>
                                            {selectedCandidates.includes(c.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </Button>
                                )) : (
                                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No candidates found for this stage</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex -space-x-3 overflow-hidden p-1">
                                    {selectedCandidates.length > 0 ? candidates.filter(c => selectedCandidates.includes(c.id)).slice(0, 5).map((c, i) => (
                                        <div key={i} className="flex h-10 w-10 rounded-full ring-2 ring-white bg-orange-50 items-center justify-center text-[10px] font-black text-[#ff6e00]">
                                            {c.name.charAt(0)}
                                        </div>
                                    )) : (
                                        <div className="h-10 px-4 bg-slate-50 rounded-full flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                            No recipients selected
                                        </div>
                                    )}
                                    {selectedCandidates.length > 5 && (
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-[#ff6e00] text-white text-[10px] font-black">
                                            +{selectedCandidates.length - 5}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={handleSendBulk}
                                    variant="secondary"
                                    size="lg"
                                    disabled={selectedCandidates.length === 0}
                                    loading={sending}
                                    icon={Send}
                                    className="flex-1 md:flex-none"
                                >
                                    Send to {selectedCandidates.length} Selected
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
