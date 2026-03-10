import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Eye, CheckCircle2, XCircle, Calendar, Clock, Download, User, Users, Mail, Phone, BookOpen, Briefcase, GraduationCap, Award, AlertCircle, History, Trash2, ShieldCheck } from 'lucide-react';
import apiService from '../../services/apiService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const KpiCard = ({ title, value, icon: Icon }) => (
    <Card className="p-6 shadow-md shadow-orange-100/50 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 ring-1 ring-slate-100 hover:ring-[#ff6e00] border-none hover:bg-orange-50">
        <div className="flex items-start justify-between">
            <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{title}</span>
                <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100/50 flex items-center justify-center text-[#ff6e00] shadow-sm">
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </Card>
);

const CandidatesList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [interviewData, setInterviewData] = useState({ date: '', time: '', interviewerId: '' });
    const [interviewers, setInterviewers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [candData, adminData, qData] = await Promise.all([
                apiService.get('/candidates'),
                apiService.get('/admin_users'),
                apiService.get('/questions')
            ]);
            setCandidates(candData);
            setInterviewers(adminData.filter(u => u.role === 'interviewer'));
            setQuestions(qData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: candidates.length,
        shortlisted: candidates.filter(c => c.status === 'shortlisted').length,
        rejected: candidates.filter(c => c.status === 'rejected').length,
        pending: candidates.filter(c => c.status === 'applied' || c.status === 'pending').length
    };

    const handleUpdateStatus = async (id, status, extraData = {}) => {
        try {
            const updatePayload = { status, ...extraData };
            await apiService.patch(`/candidates/${id}`, updatePayload);
            setCandidates(candidates.map(c => c.id === id ? { ...c, ...updatePayload } : c));
            if (selectedCandidate?.id === id) {
                setSelectedCandidate({ ...selectedCandidate, ...updatePayload });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteCandidate = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Are you sure you want to permanently delete this candidate?')) return;

        try {
            await apiService.delete(`/candidates/${id}`);
            setCandidates(candidates.filter(c => c.id !== id));
            if (selectedCandidate?.id === id) {
                setIsDetailModalOpen(false);
                setSelectedCandidate(null);
            }
        } catch (error) {
            console.error('Error deleting candidate:', error);
            alert('Failed to delete candidate.');
        }
    };

    const handleScheduleInterview = async () => {
        const selectedDateTime = new Date(`${interviewData.date}T${interviewData.time}`);
        const now = new Date();

        if (selectedDateTime <= now) {
            alert('Interview must be scheduled for a future date and time.');
            return;
        }

        try {
            const newInterview = {
                candidateId: selectedCandidate.id,
                interviewerId: parseInt(interviewData.interviewerId),
                date: interviewData.date,
                time: interviewData.time,
                status: 'scheduled',
                createdAt: now.toISOString()
            };

            await apiService.post('/interviews', newInterview);
            await handleUpdateStatus(selectedCandidate.id, 'shortlisted');
            setIsInterviewModalOpen(false);
            setInterviewData({ date: '', time: '', interviewerId: '' });
        } catch (error) {
            console.error('Error scheduling interview:', error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            applied: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
            shortlisted: 'bg-orange-50 text-[#ff6e00] ring-orange-100',
            rejected: 'bg-red-50 text-red-600 ring-red-100',
            hired: 'bg-indigo-50 text-indigo-600 ring-indigo-100'
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${styles[status] || 'bg-slate-50 text-slate-500 ring-slate-100'}`}>
                {status}
            </span>
        );
    };

    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Candidates Talent Pool</h1>
                    <p className="text-slate-500 font-medium mt-1">Review applicant profiles, assessment scores, and manage hiring stages.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                        <input
                            type="text"
                            placeholder="Find application..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all w-64 shadow-sm"
                        />
                    </div>
                    <Button variant="outline" className="rounded-2xl flex items-center gap-2 hover:border-[#ff6e00] hover:text-[#ff6e00]">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div onClick={() => setStatusFilter('all')} className="cursor-pointer">
                    <KpiCard title="All Applicants" value={stats.total} icon={Users} />
                </div>
                <div onClick={() => setStatusFilter('shortlisted')} className="cursor-pointer">
                    <KpiCard title="Shortlisted" value={stats.shortlisted} icon={CheckCircle2} />
                </div>
                <div onClick={() => setStatusFilter('rejected')} className="cursor-pointer">
                    <KpiCard title="Rejected" value={stats.rejected} icon={XCircle} />
                </div>
                <div onClick={() => setStatusFilter('applied')} className="cursor-pointer">
                    <KpiCard title="New Applied" value={stats.pending} icon={Clock} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCandidates.map((candidate) => (
                    <Card
                        key={candidate.id}
                        onClick={() => { setSelectedCandidate(candidate); setIsDetailModalOpen(true); }}
                        className="p-8 border-none shadow-md shadow-orange-100/50 ring-1 ring-slate-100 group transition-all duration-500 hover:ring-[#ff6e00] hover:bg-orange-50 cursor-pointer overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="flex items-start justify-between relative z-10 mb-8">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[2rem] bg-[#ff6e00] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#ff6e00]/20 transform group-hover:rotate-6 transition-transform">
                                    {candidate.name.charAt(0)}
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#ff6e00] transition-colors">{candidate.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span className="text-xs font-bold">{candidate.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(candidate.status)}
                                    <button
                                        onClick={(e) => handleDeleteCandidate(candidate.id, e)}
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl ring-1 ring-emerald-100 shadow-sm transition-all group-hover:bg-emerald-500 group-hover:text-white group-hover:ring-emerald-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Score</span>
                                    <span className="text-sm font-black leading-none">{candidate.examScore ?? '--'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100 relative z-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Position</p>
                                <div className="flex items-center gap-2.5 text-slate-700">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#ff6e00]">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold capitalize">{candidate.position}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Contact Status</p>
                                <div className="flex items-center gap-2.5 justify-end text-slate-700">
                                    <span className="text-sm font-bold">{candidate.phone || 'Verified'}</span>
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Card>
                ))}
            </div>

            {/* Candidate Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Application Profile"
                size="xl"
            >
                {selectedCandidate && (
                    <div className="space-y-8 py-2">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-[2rem] bg-[#ff6e00] flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-[#ff6e00]/30">
                                    {selectedCandidate.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedCandidate.name}</h2>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedCandidate.position}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        {getStatusBadge(selectedCandidate.status)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl ring-1 ring-emerald-100 shadow-sm">
                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Exam Score</span>
                                    <span className="text-xl font-black">{selectedCandidate.examScore ?? '--'}</span>
                                </div>
                                <Button variant="outline" className="rounded-xl flex items-center gap-2 h-10 py-1 text-xs">
                                    <Download className="w-4 h-4" />
                                    <span>Download CV</span>
                                </Button>
                            </div>
                        </div>

                        {selectedCandidate.submissionReason && (
                            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-[#ff6e00]" />
                                    <div>
                                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Assessment Integrity</p>
                                        <p className="text-sm font-bold text-slate-700">{selectedCandidate.submissionReason}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Timestamp</p>
                                    <p className="text-xs font-bold text-slate-500">{new Date(selectedCandidate.submittedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Contact Infomation</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedCandidate.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedCandidate.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedCandidate.dob || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Academic Background</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">College / University</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5 uppercase">{selectedCandidate.college || selectedCandidate.education}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                            <GraduationCap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Degree / Specification</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5 uppercase">{selectedCandidate.education}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                                <History className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passing Year</p>
                                                <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedCandidate.passingYear}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CGPA / %</p>
                                                <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedCandidate.cgpa || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedCandidate.activeBacklogs === 'yes' && (
                                        <div className="flex items-center gap-4 group p-3 bg-red-50 rounded-2xl border border-red-100">
                                            <div className="w-10 h-10 rounded-xl bg-white text-red-500 flex items-center justify-center shadow-sm">
                                                <AlertCircle className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Active Backlogs</p>
                                                <p className="text-sm font-black text-red-600 mt-0.5">{selectedCandidate.backlogCount} Pending</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Assessment Questions</h3>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black">{selectedCandidate.assignedQuestions?.length || 0} Questions</span>
                            </div>
                            {selectedCandidate.assignedQuestions?.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedCandidate.assignedQuestions.map(qId => {
                                        const question = questions.find(q => q.id === qId);
                                        return question ? (
                                            <div key={qId} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between group/q">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                        {question.level?.charAt(0) || 'G'}
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-700 leading-relaxed max-w-[400px]">{question.text}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const updated = selectedCandidate.assignedQuestions.filter(id => id !== qId);
                                                        handleUpdateStatus(selectedCandidate.id, selectedCandidate.status, { assignedQuestions: updated });
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover/q:opacity-100 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            ) : (
                                <div className="py-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No questions assigned yet</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 pt-4 border-t border-slate-100">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Professional Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience Type</p>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5 uppercase">{selectedCandidate.experienceType || 'Fresher'}</p>
                                    </div>
                                </div>
                                {selectedCandidate.experienceType === 'experienced' && (
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Experience</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedCandidate.yearsOfExperience}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => handleUpdateStatus(selectedCandidate.id, 'rejected')}
                                    variant="danger"
                                    className="rounded-xl px-6 flex items-center gap-2"
                                    disabled={selectedCandidate.status === 'rejected'}
                                >
                                    <XCircle className="w-4 h-4" />
                                    <span>Reject</span>
                                </Button>
                                <Button
                                    onClick={() => handleUpdateStatus(selectedCandidate.id, 'shortlisted')}
                                    variant="outline"
                                    className="rounded-xl px-6 flex items-center gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Approved</span>
                                </Button>
                            </div>
                            <Button
                                onClick={() => setIsInterviewModalOpen(true)}
                                className="rounded-xl px-8 bg-[#19325c] hover:bg-[#112445] flex items-center gap-2 border-none shadow-xl shadow-blue-900/10"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Schedule Interview</span>
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Schedule Interview Modal */}
            <Modal
                isOpen={isInterviewModalOpen}
                onClose={() => setIsInterviewModalOpen(false)}
                title="Schedule Technical Interview"
            >
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Select Interviewer</label>
                        <select
                            value={interviewData.interviewerId}
                            onChange={(e) => setInterviewData({ ...interviewData, interviewerId: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none"
                        >
                            <option value="">Choose expert...</option>
                            {interviewers.map(i => (
                                <option key={i.id} value={i.id}>{i.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Interview Date</label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={interviewData.date}
                                onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Start Time</label>
                            <input
                                type="time"
                                value={interviewData.time}
                                onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleScheduleInterview}
                            className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-[#ff6e00] hover:bg-[#e05d00] border-none shadow-xl shadow-orange-500/20"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Confirm Schedule</span>
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CandidatesList;
