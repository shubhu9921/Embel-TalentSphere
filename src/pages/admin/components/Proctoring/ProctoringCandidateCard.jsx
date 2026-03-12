import React from 'react';
import { Eye, Clock, Image as ImageIcon } from 'lucide-react';
import Button from '../../../../components/Button';

const ProctoringCandidateCard = ({ candidate, onSelect }) => {
    const logs = candidate.proctoringLogs || [];
    const violationCount = logs.length;
    const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
    const latestEvidence = latestLog?.evidence;
    const latestTimestamp = latestLog?.timestamp;
    const terminated = candidate.submissionReason?.toLowerCase().includes('terminated');

    return (
        <div
            className={`group relative bg-white rounded-[2.5rem] p-6 border transition-all duration-500 hover-lift ${terminated ? 'border-red-200 bg-red-50/10' : 'border-slate-100'}`}
        >
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
                    {latestTimestamp ? new Date(latestTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live Monitoring'}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{candidate.name || 'Anonymous candidate'}</h3>
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

                <Button
                    onClick={() => onSelect?.(candidate)}
                    variant="primary"
                    size="lg"
                    icon={Eye}
                    className="w-full hover:bg-orange-600 shadow-xl"
                >
                    View Detailed Log
                </Button>
            </div>
        </div>
    );
};

export default ProctoringCandidateCard;
