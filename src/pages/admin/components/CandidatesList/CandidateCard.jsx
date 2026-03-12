import React from 'react';
import { Mail, Trash2, Briefcase, Phone, Calendar, ShieldCheck } from 'lucide-react';
import Card from '../../../../components/Card';
import Badge from '../../../../components/Badge';
import Button from '../../../../components/Button';

const CandidateCard = ({ candidate, interviews = [], interviewers = [], onClick, onDelete }) => {
    const interview = interviews.find(i => String(i.candidateId) === String(candidate.id));
    const interviewer = interview ? interviewers.find(i => String(i.id) === String(interview.interviewerId)) : null;

    const getStatusVariant = (status) => {
        switch (status) {
            case 'applied': return 'success';
            case 'shortlisted': return 'warning';
            case 'interview scheduled': return 'primary';
            case 'rejected':
            case 'not selected': return 'danger';
            case 'hired': return 'success';
            default: return 'neutral';
        }
    };

    return (
        <Card
            onClick={onClick}
            className={`p-8 border-none shadow-elevation-high ring-1 ring-slate-100 group transition-all duration-500 hover:ring-[#ff6e00] overflow-hidden relative ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="flex items-start justify-between relative z-10 mb-8">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-4xl bg-[#ff6e00] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#ff6e00]/20 transform group-hover:rotate-6 transition-transform">
                        {candidate.name?.charAt(0) || '?'}
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-xl font-black text-[#19325c] group-hover:text-[#ff6e00] transition-colors">{candidate.name || 'Anonymous candidate'}</h3>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{candidate.email || 'No email provided'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(candidate.status)} size="sm" className="uppercase tracking-widest">
                            {candidate.status}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={(e) => { e.stopPropagation(); onDelete?.(candidate.id); }}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 border-none bg-transparent"
                            aria-label="Delete candidate"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl ring-1 ring-emerald-100 shadow-sm transition-all group-hover:bg-emerald-500 group-hover:text-white group-hover:ring-emerald-500">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Score</span>
                        <span className="text-sm font-black leading-none">{candidate.examScore ?? '--'}</span>
                    </div>
                </div>
            </div>
            
            {interview && (
                <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between group/int animate-in fade-in slide-in-from-top-2 duration-500 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white text-[#19325c] flex items-center justify-center shadow-sm border border-blue-50 group-hover/int:bg-blue-500 group-hover/int:text-white transition-colors">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Technical Interview</p>
                            <p className="text-xs font-bold text-[#19325c]">
                                {interviewer ? interviewer.name : 'Interviewer TBD'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pr-1">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                            <p className="text-[11px] font-bold text-slate-700">{interview.date || 'TBD'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                            <p className="text-[11px] font-bold text-slate-700">{interview.time || 'TBD'}</p>
                        </div>
                    </div>
                </div>
            )}

            {candidate.submissionReason && (
                <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between group animate-in fade-in slide-in-from-top-2 duration-500 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white text-[#ff6e00] flex items-center justify-center shadow-sm border border-orange-50">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Assessment Integrity</p>
                            <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                                {candidate.submissionReason}
                            </p>
                        </div>
                    </div>
                    <div className="text-right pr-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Timestamp</p>
                        <p className="text-[10px] font-bold text-slate-500">
                            {candidate.submittedAt ? new Date(candidate.submittedAt).toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' }) : 'N/A'}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100 relative z-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Position</p>
                    <div className="flex items-center gap-2.5 text-slate-700">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#ff6e00]">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold capitalize">{candidate.position || 'Not specified'}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Contact Status</p>
                    <div className="flex items-center gap-2.5 justify-end text-slate-700">
                        <span className="text-sm font-bold">{candidate.phone || 'No phone info'}</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600" title="Contact Verification Status">
                            <Phone className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CandidateCard;
