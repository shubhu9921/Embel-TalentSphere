import React, { useState, useEffect } from 'react';
import { Search, Globe, Shield, UserPlus } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

// Modular Components
import TeamStats from './components/TeamManagement/TeamStats';
import TeamMemberCard from './components/TeamManagement/TeamMemberCard';
import TeamMemberModal from './components/TeamManagement/TeamMemberModal';

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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [users, jobs] = await Promise.all([
                ApiService.get('/admin_users'),
                ApiService.get('/vacancies')
            ]);
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
                await ApiService.patch(`/admin_users/${editingMember.id}`, formData);
            } else {
                await ApiService.post('/admin_users', {
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
            await ApiService.delete(`/admin_users/${id}`);
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


    if (loading) return <div className="p-10 flex justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 page-fade-in">
            <PageHeader
                title="Team Administration"
                subtitle="Manage platform authorities, interview domains, and recruitment personnel."
                icon={Shield}
                actions={
                    <Button
                        onClick={() => handleOpenModal()}
                        icon={UserPlus}
                        variant="secondary"
                    >
                        ADD TEAM MEMBER
                    </Button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Stats & Search Column */}
                <div className="space-y-8">
                    <TeamStats count={team.length} />

                    <div className="space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, email or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all shadow-2xl shadow-slate-200/20"
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
                        <TeamMemberCard
                            key={member.id}
                            member={member}
                            vacancies={vacancies}
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                        />
                    ))}

                    {filteredTeam.length === 0 && (
                        <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <Shield className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold tracking-tight">No matching team members found.</p>
                        </div>
                    )}
                </div>
            </div>

            <TeamMemberModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                editingMember={editingMember}
                formData={formData}
                setFormData={setFormData}
                vacancies={vacancies}
                submitting={submitting}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default TeamManagement;
