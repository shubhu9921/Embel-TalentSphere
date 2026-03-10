import React, { useState, useEffect } from 'react';
import { Search, Mail, Send, CheckCircle2, XCircle, User, Users, Info, Briefcase, Phone, BookOpen, Download, Eye, Calendar, GraduationCap, Award, AlertCircle, History, Clock } from 'lucide-react';
import apiService from '../../services/apiService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const HRProfiles = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

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

    const stats = {
        total: candidates.length,
        hired: candidates.filter(c => c.status === 'hired').length,
        rejected: candidates.filter(c => c.status === 'rejected').length
    };

    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">HR Candidate Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Track recruitment status and manage candidate communication.</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all w-64 shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Database', value: stats.total, icon: Users, id: 'all' },
                    { label: 'Successful Hires', value: stats.hired, icon: CheckCircle2, id: 'hired' },
                    { label: 'Closed Files', value: stats.rejected, icon: XCircle, id: 'rejected' }
                ].map((s, i) => (
                    <Card
                        key={i}
                        onClick={() => setStatusFilter(s.id)}
                        className={`p-6 shadow-md transition-all duration-300 ring-1 border-none cursor-pointer hover:translate-y-[-4px] active:scale-95 ${statusFilter === s.id ? 'ring-[#ff6e00] bg-orange-50 shadow-orange-200' : 'shadow-orange-100/50 ring-slate-100 hover:ring-[#ff6e00] hover:bg-orange-50'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100/50 flex items-center justify-center text-[#ff6e00]">
                                <s.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                                <p className="text-2xl font-black text-slate-900">{s.value.toString().padStart(2, '0')}</p>
                            </div>
                        </div>
                    </Card>
                ))}
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
                                {getStatusBadge(candidate.status)}
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl ring-1 ring-emerald-100 shadow-sm">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Exam Score</span>
                                    <span className="text-sm font-black">{candidate.examScore || '--'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100 relative z-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied Role</p>
                                <div className="flex items-center gap-2.5 text-slate-700">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#ff6e00]">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold capitalize">{candidate.position}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Contact Info</p>
                                <div className="flex items-center gap-2.5 justify-end text-slate-700">
                                    <span className="text-sm font-bold">{candidate.phone || 'Verified'}</span>
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex gap-2 relative z-10">
                            <Button
                                onClick={(e) => { e.stopPropagation(); setSelectedCandidate(candidate); setIsDetailModalOpen(true); }}
                                variant="outline"
                                className="flex-1 py-2.5 rounded-xl border-slate-100 text-slate-600 hover:bg-white hover:border-[#ff6e00] hover:text-[#ff6e00] transition-all"
                            >
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </Button>
                            <Button
                                onClick={(e) => { e.stopPropagation(); }} // Prevents card click
                                className="flex-2 py-2.5 rounded-xl flex items-center justify-center gap-2 bg-[#ff6e00] hover:bg-[#e05d00] border-none shadow-lg shadow-orange-500/20"
                            >
                                <Send className="w-4 h-4" />
                                <span>Notify</span>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Candidate Registration Profile"
                size="xl"
            >
                {selectedCandidate && (
                    <div className="space-y-8 py-2">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-[2rem] bg-[#ff6e00] flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-[#ff6e00]/30">
                                    {selectedCandidate.name.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedCandidate.name}</h2>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedCandidate.position}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        {getStatusBadge(selectedCandidate.status)}
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="rounded-xl flex items-center gap-2 h-11 border-slate-200">
                                <Download className="w-4 h-4" />
                                <span>Download Resume</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Contact Details</h3>
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
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedCandidate.phone || '+91 00000 00000'}</p>
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

                        <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Button
                                onClick={() => setIsDetailModalOpen(false)}
                                variant="outline"
                                className="px-8 rounded-xl border-slate-200 text-slate-500"
                            >
                                Close
                            </Button>
                            <Button className="px-8 rounded-xl bg-[#19325c] hover:bg-[#112445] border-none shadow-xl shadow-blue-900/10">
                                Send Notification
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default HRProfiles;
