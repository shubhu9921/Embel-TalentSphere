import React, { useState, useEffect } from 'react';
import {
    Users, UserPlus, Search, Filter, Mail, Shield,
    MoreVertical, Trash2, Edit3, CheckCircle2, XCircle,
    ChevronRight, Briefcase, Award, Globe, Loader2
} from 'lucide-react';
import apiService from '../../services/apiService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const TeamManagement = () => {
    const [team, setTeam] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'interviewer',
        domain: ''
    });

    const roles = [
        { id: 'interviewer', label: 'Interviewer', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
        { id: 'hr', label: 'HR Manager', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [users, jobs] = await Promise.all([
                apiService.get('/admin_users'),
                apiService.get('/vacancies')
            ]);
            // Exclude superadmin from management list for safety
            setTeam(users.filter(u => u.role !== 'superadmin'));
            setVacancies(jobs);
        } catch (error) {
            console.error('Error fetching team data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                email: member.email,
                password: member.password,
                role: member.role,
                domain: member.domain || ''
            });
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'interviewer',
                domain: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingMember) {
                await apiService.patch(`/admin_users/${editingMember.id}`, formData);
            } else {
                await apiService.post('/admin_users', {
                    ...formData,
                    createdAt: new Date().toISOString()
                });
            }
            await fetchData();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving team member:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this team member?')) return;
        try {
            await apiService.delete(`/admin_users/${id}`);
            setTeam(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error deleting team member:', error);
        }
    };

    const filteredTeam = team.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Shield className="text-[#ff6e00] w-8 h-8" />
                        Team Administration
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage platform authorities, interview domains, and recruitment personnel.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-[#ff6e00] text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-[#e05d00] transition-all active:scale-95 whitespace-nowrap"
                >
                    <UserPlus size={20} />
                    ADD TEAM MEMBER
                </button>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Stats & Search Column */}
                <div className="space-y-8">
                    <Card className="p-8 border-none shadow-xl shadow-slate-200/50 bg-[#002D5E] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/20 transition-colors"></div>
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Internal Workforce</h3>
                            <div className="flex items-end gap-3">
                                <span className="text-6xl font-black tracking-tighter leading-none">{team.length.toString().padStart(2, '0')}</span>
                                <span className="text-xs font-bold opacity-60 mb-2 uppercase tracking-widest text-[#ff6e00]">Active Members</span>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, email or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all shadow-xl shadow-slate-200/20"
                            />
                        </div>
                        <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100/50">
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Globe className="w-3 h-3" />
                                Recruitment Engine Insight
                            </p>
                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                                Interviewers assigned to specific domains will automatically see candidates applying for those positions in their dedicated dashboard.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team List Column */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredTeam.map((member) => (
                        <Card key={member.id} className="p-6 border-none shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 group hover:ring-[#ff6e00]/30 transition-all">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-colors">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-black text-slate-800 text-lg tracking-tight uppercase">{member.name}</h3>
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${member.role === 'interviewer' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {member.role}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-slate-400 font-bold text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={12} />
                                                {member.email}
                                            </div>
                                            {member.role === 'interviewer' && member.domain && (
                                                <div className="flex items-center gap-1.5 text-orange-500">
                                                    <Award size={12} />
                                                    Domain: {vacancies.find(v => v.id === member.domain)?.title || member.domain}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleOpenModal(member)}
                                        className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Edit Member"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Remove Member"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filteredTeam.length === 0 && (
                        <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold tracking-tight">No matching team members found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-[#002D5E]/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowModal(false)}></div>
                    <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300 border border-white/20">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#002D5E] to-[#112240] px-10 py-8 text-white">
                            <h2 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">
                                {editingMember ? 'Update Authority' : 'Create Authority'}
                            </h2>
                            <p className="text-white/60 text-sm font-medium mt-1">Configure access levels and technical domains.</p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff6e00] transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff6e00] transition-colors" />
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all"
                                            placeholder="doe@embel.co.in"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff6e00] transition-colors" />
                                        <input
                                            required
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                                    <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                                        {roles.map(r => (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: r.id })}
                                                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === r.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {formData.role === 'interviewer' && (
                                <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Domain (Assessment Position)</label>
                                    <select
                                        value={formData.domain}
                                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Domain Expertise</option>
                                        {vacancies.map(v => (
                                            <option key={v.id} value={v.id}>{v.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-4 bg-[#ff6e00] text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-[#e05d00] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {editingMember ? 'UPDATE ACCESS' : 'CONFIRM ACCESS'}
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;
