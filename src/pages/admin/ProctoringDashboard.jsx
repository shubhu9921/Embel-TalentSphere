import React, { useState, useEffect } from 'react';
import {
    Users, AlertTriangle, ShieldAlert, CheckCircle2,
    Eye, History, Clock, MapPin, Search, Filter,
    ChevronRight, X, Image as ImageIcon, ExternalLink
} from 'lucide-react';
import apiService from '../../services/apiService';
import Loader from '../../components/Loader';

const ProctoringDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const data = await apiService.get('/candidates');
            // Filter candidates who have proctoring logs or are currently in exam
            setCandidates(data.filter(c => c.status === 'applied' || (c.proctoringLogs && c.proctoringLogs.length > 0)));
        } catch (error) {
            console.error('Error fetching proctoring data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getViolationCount = (logs) => logs ? logs.length : 0;
    const isTerminated = (c) => c.submissionReason === 'Interview terminated due to suspicious activity.';

    if (loading && candidates.length === 0) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <Loader size="lg" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <ShieldAlert className="text-orange-500" size={32} />
                        Live Proctoring <span className="text-orange-500">Center</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time integrity monitoring and malpractice detection.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 w-64 font-bold text-slate-700 transition-all"
                        />
                    </div>
                    <button className="p-3.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Active</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">{filteredCandidates.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                        <AlertTriangle size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Violations Found</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                            {filteredCandidates.reduce((acc, c) => acc + getViolationCount(c.proctoringLogs), 0)}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Terminated</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                            {filteredCandidates.filter(isTerminated).length}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Clear Exams</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                            {filteredCandidates.filter(c => getViolationCount(c.proctoringLogs) === 0).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Candidate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCandidates.map((candidate) => {
                    const logs = candidate.proctoringLogs || [];
                    const violationCount = logs.length;
                    const latestEvidence = logs.length > 0 ? logs[logs.length - 1].evidence : null;
                    const terminated = isTerminated(candidate);

                    return (
                        <div
                            key={candidate.id}
                            className={`group relative bg-white rounded-[2.5rem] p-6 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${terminated ? 'border-red-200 bg-red-50/10' : 'border-slate-100'
                                }`}
                        >
                            {/* Evidence Thumnail */}
                            <div className="aspect-video w-full bg-slate-100 rounded-3xl mb-6 overflow-hidden relative border border-slate-100 group">
                                {latestEvidence ? (
                                    <img src={latestEvidence} alt="Evidence" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <ImageIcon size={32} strokeWidth={1.5} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">No Evidence Captured</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                    <Clock size={12} />
                                    Just Now
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{candidate.name}</h3>
                                        <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mt-1">
                                            {candidate.position}
                                        </p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${terminated
                                            ? 'bg-red-500 text-white border-red-400 animate-pulse'
                                            : violationCount > 0
                                                ? 'bg-orange-50 text-orange-600 border-orange-100'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        }`}>
                                        {terminated ? 'TERMINATED' : violationCount > 0 ? 'WARNINGS' : 'CLEAR'}
                                    </div>
                                </div>

                                {/* Violation Stripes */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strikes</span>
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map((strike) => (
                                            <div
                                                key={strike}
                                                className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${violationCount >= strike
                                                        ? 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                                        : 'bg-white border-slate-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedCandidate(candidate)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#ff6e00] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    <Eye size={16} />
                                    View Detailed Log
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detailed Log Modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedCandidate(null)}></div>
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-8 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-800 shadow-sm border border-slate-100">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{selectedCandidate.name}</h2>
                                    <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">Malpractice Investigation Log</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCandidate(null)}
                                className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all hover:rotate-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-6">
                                {selectedCandidate.proctoringLogs?.length > 0 ? (
                                    selectedCandidate.proctoringLogs.slice().reverse().map((log, idx) => (
                                        <div key={idx} className="flex gap-6 group">
                                            <div className="flex flex-col items-center gap-2 mt-2">
                                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                                                    {selectedCandidate.proctoringLogs.length - idx}
                                                </div>
                                                <div className="w-0.5 h-full bg-slate-100 rounded-full group-last:hidden"></div>
                                            </div>
                                            <div className="flex-1 space-y-4 pb-8">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-black text-slate-800 tracking-tight">{log.type}</h4>
                                                    <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                        {new Date(log.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>

                                                {log.evidence && (
                                                    <div className="relative group/img max-w-md">
                                                        <img
                                                            src={log.evidence}
                                                            alt="Violation Evidence"
                                                            className="w-full rounded-2xl border-4 border-slate-50 shadow-lg group-hover/img:scale-[1.02] transition-transform duration-500"
                                                        />
                                                        <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all">
                                                            <button className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-[#ff6e00] transition-colors">
                                                                <ExternalLink size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                <p className="text-sm font-medium text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    Detected during live assessment. System recorded event as <span className="text-orange-600 font-bold font-mono">{log.category || 'violation'}</span>.
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800">Clear Record</h3>
                                        <p className="text-slate-400 font-medium max-w-sm mt-2">No suspicious activity or proctoring violations detected for this candidate yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <History size={20} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-Refreshed via Embel AI Proctoring</span>
                            </div>
                            <button
                                className="px-10 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all uppercase tracking-widest text-xs"
                                onClick={() => setSelectedCandidate(null)}
                            >
                                Done Reviewing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProctoringDashboard;
