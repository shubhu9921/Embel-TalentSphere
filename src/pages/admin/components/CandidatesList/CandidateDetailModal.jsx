import React from 'react';
import { Mail, Phone, Calendar, BookOpen, GraduationCap, History, Award, AlertCircle, ShieldCheck, Download, XCircle, CheckCircle2, Trash2 } from 'lucide-react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import Badge from '../../../../components/Badge';

const CandidateDetailModal = ({
    isOpen,
    onClose,
    candidate,
    questions,
    interviews = [],
    interviewers = [],
    onUpdateStatus,
    onScheduleInterview
}) => {
    const [showDetails, setShowDetails] = React.useState(false);
    if (!candidate) return null;

    const interview = interviews.find(i => String(i.candidateId) === String(candidate.id));
    const interviewer = interview ? interviewers.find(i => String(i.id) === String(interview.interviewerId)) : null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Application Profile"
            size="xl"
            footer={
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => onUpdateStatus(candidate.id, 'rejected')}
                            variant="danger"
                            icon={XCircle}
                            disabled={candidate.status === 'rejected'}
                        >
                            Reject
                        </Button>
                        <Button
                            onClick={() => onUpdateStatus(candidate.id, 'shortlisted')}
                            variant="success"
                            icon={CheckCircle2}
                            disabled={candidate.status === 'shortlisted'}
                        >
                            Approve
                        </Button>
                    </div>
                    <Button
                        onClick={onScheduleInterview}
                        variant="primary"
                        size="md"
                        icon={Calendar}
                        disabled={candidate.status === 'interview scheduled'}
                    >
                        {candidate.status === 'interview scheduled' ? 'Scheduled' : 'Schedule Interview'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-8 py-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-4xl bg-[#ff6e00] flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-[#ff6e00]/30">
                            {candidate.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-[#19325c] tracking-tight">{candidate.name}</h2>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{candidate.position}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <Badge
                                    variant={
                                        candidate.status === 'applied' ? 'success' :
                                            candidate.status === 'shortlisted' ? 'warning' :
                                                candidate.status === 'interview scheduled' ? 'primary' :
                                                    'danger'
                                    }
                                    size="sm"
                                    className="uppercase tracking-widest"
                                >
                                    {candidate.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl ring-1 ring-emerald-100 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Exam Score</span>
                            <span className="text-xl font-black">{candidate.examScore ?? '--'}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            icon={Download}
                            onClick={() => {
                                const rawData = candidate.cvUrl || candidate.resumeData;
                                if (!rawData) return;
                                if (rawData.startsWith('data:')) {
                                    try {
                                        const [header, base64] = rawData.split(',');
                                        const mime = header.match(/:(.*?);/)?.[1] || 'application/pdf';
                                        const bytes = atob(base64);
                                        const arr = new Uint8Array(bytes.length);
                                        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
                                        const blobUrl = URL.createObjectURL(new Blob([arr], { type: mime }));
                                        window.open(blobUrl, '_blank');
                                    } catch {
                                        window.open(rawData, '_blank');
                                    }
                                } else {
                                    window.open(rawData, '_blank');
                                }
                            }}
                            disabled={!candidate.cvUrl && !candidate.resumeData}
                        >
                            {candidate.resumeData || candidate.cvUrl ? (candidate.resumeName ? `View ${candidate.resumeName}` : 'View CV') : 'No CV Available'}
                        </Button>
                    </div>
                </div>

                {interview && (
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between group animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white text-[#19325c] flex items-center justify-center shadow-sm border border-blue-50">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Technical Interview Scheduled</p>
                                <p className="text-sm font-bold text-[#19325c]">
                                    {interviewer ? `Expert: ${interviewer.name}` : 'Interviewer TBD'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 pr-2">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                <p className="text-sm font-bold text-slate-700">{interview.date || 'TBD'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                                <p className="text-sm font-bold text-slate-700">{interview.time || 'TBD'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {candidate.submissionReason && (
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#ff6e00]" />
                            <div>
                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Assessment Integrity</p>
                                <p className="text-sm font-bold text-slate-700">{candidate.submissionReason}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Timestamp</p>
                            <p className="text-xs font-bold text-slate-500">
                                {candidate.submittedAt ? new Date(candidate.submittedAt).toLocaleString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                )}

                {!showDetails ? (
                    <div className="flex justify-center pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowDetails(true)}
                            className="w-full border-dashed border-2 text-slate-400 hover:text-[#ff6e00] hover:border-[#ff6e00]"
                        >
                            View Candidate Detailed Information
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Contact Information</h3>
                        <div className="space-y-4">
                            {[
                                { icon: Mail, label: 'Email Address', value: candidate.email },
                                { icon: Phone, label: 'Phone Number', value: candidate.phone },
                                { icon: Calendar, label: 'Date of Birth', value: candidate.dob || 'Not provided' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                        <item.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Academic Background</h3>
                        <div className="space-y-4">
                            {[
                                { icon: BookOpen, label: 'College / University', value: candidate.college || 'Not specified' },
                                { icon: GraduationCap, label: 'Degree / Specification', value: candidate.education }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                        <item.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5 uppercase">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                        <History size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passing Year</p>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5">{candidate.passingYear || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                        <Award size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CGPA / %</p>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5">{candidate.cgpa || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            {candidate.activeBacklogs === 'yes' && (
                                <div className="flex items-center gap-4 group p-3 bg-red-50 rounded-2xl border border-red-100">
                                    <div className="w-10 h-10 rounded-xl bg-white text-red-500 flex items-center justify-center shadow-sm">
                                        <AlertCircle size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Active Backlogs</p>
                                        <p className="text-sm font-black text-red-600 mt-0.5">{candidate.backlogCount || 0} Pending</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessment Detail</h3>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black">{candidate.assignedQuestions?.length || 0} Questions Assigned</span>
                    </div>
                    {candidate.assignedQuestions?.length > 0 ? (
                        <div className="space-y-3">
                            {candidate.assignedQuestions.map(qId => {
                                const question = questions?.find(q => q.id === qId);
                                return question ? (
                                    <div key={qId} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between group/q">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                                                {question.level?.charAt(0) || 'G'}
                                            </div>
                                            <p className="text-xs font-bold text-slate-700 leading-relaxed">{question.text}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Trash2}
                                            onClick={() => {
                                                const updated = candidate.assignedQuestions.filter(id => id !== qId);
                                                onUpdateStatus(candidate.id, candidate.status, { assignedQuestions: updated });
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover/q:opacity-100 focus:opacity-100 transition-all shrink-0 border-none bg-transparent"
                                            aria-label="Remove question"
                                        />
                                    </div>
                                ) : null;
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No assessment data available</p>
                        </div>
                    )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CandidateDetailModal;
