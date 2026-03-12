import React from 'react';
import { X, Users, History, CheckCircle2, ExternalLink } from 'lucide-react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';

const ProctoringLogModal = ({ isOpen, onClose, candidate }) => {
    if (!candidate) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={candidate.name}
            subtitle="Malpractice Investigation Log"
            size="xl"
        >
            <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">
                {candidate.proctoringLogs?.length > 0 ? (
                    candidate.proctoringLogs.slice().reverse().map((log, idx) => (
                        <div key={log.id || `${log.timestamp}-${idx}`} className="flex gap-6 group">
                            <div className="flex flex-col items-center gap-2 mt-2">
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                                    {candidate.proctoringLogs.length - idx}
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
                                            <Button
                                                onClick={() => window.open(log.evidence, '_blank', 'noopener,noreferrer')}
                                                variant="ghost"
                                                size="xs"
                                                icon={ExternalLink}
                                                className="bg-black/60 backdrop-blur-md text-white hover:bg-[#ff6e00] rounded-xl"
                                            />
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
                    <div className="py-10 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Clear Record</h3>
                        <p className="text-slate-400 font-medium max-w-sm mt-2">No suspicious activity or proctoring violations detected for this candidate yet.</p>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <History size={20} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-Refreshed via Embel AI Proctoring</span>
                </div>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={onClose}
                >
                    Done Reviewing
                </Button>
            </div>
        </Modal>
    );
};

export default ProctoringLogModal;
