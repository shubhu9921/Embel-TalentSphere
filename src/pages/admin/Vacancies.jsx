import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Briefcase, Users, Layout, CheckCircle2 } from 'lucide-react';
import apiService from '../../services/apiService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const Vacancies = () => {
    const [vacancies, setVacancies] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: '', title: '', description: '', isOpen: true });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [vData, cData] = await Promise.all([
                apiService.get('/vacancies'),
                apiService.get('/candidates')
            ]);
            setVacancies(vData);
            setCandidates(cData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: vacancies.length,
        active: vacancies.filter(v => v.isOpen).length,
        applicants: candidates.length
    };

    const getApplicantsForVacancy = (positionId) => {
        return candidates.filter(c => c.position === positionId).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id && vacancies.find(v => v.id === formData.id)) {
                await apiService.put(`/vacancies/${formData.id}`, formData);
            } else {
                await apiService.post('/vacancies', { ...formData, id: formData.title.toLowerCase().replace(/\s+/g, '-') });
            }
            fetchData();
            setIsModalOpen(false);
            setFormData({ id: '', title: '', description: '', isOpen: true });
        } catch (error) {
            console.error('Error saving vacancy:', error);
        }
    };

    const handleToggleStatus = async (vacancy) => {
        try {
            const updated = { ...vacancy, isOpen: !vacancy.isOpen };
            await apiService.put(`/vacancies/${vacancy.id}`, updated);
            setVacancies(vacancies.map(v => v.id === vacancy.id ? updated : v));
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Vacancies</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage open positions and recruitment status for Embel TalentSphere.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl flex items-center gap-2 shadow-2xl shadow-[#ff6e00]/20 bg-[#ff6e00] hover:bg-[#e05d00]">
                    <Plus className="w-5 h-5" />
                    <span>Post New Role</span>
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Openings', value: stats.total, icon: Briefcase },
                    { label: 'Currently Hiring', value: stats.active, icon: CheckCircle2 },
                    { label: 'Total Applicants', value: stats.applicants, icon: Users }
                ].map((s, i) => (
                    <Card key={i} className="p-6 shadow-md shadow-orange-100/50 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 ring-1 ring-slate-100 hover:ring-[#ff6e00] border-none hover:bg-orange-50">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vacancies.map((vacancy) => (
                    <Card key={vacancy.id} className="p-6 border-none shadow-md shadow-orange-100/50 ring-1 ring-slate-100 flex flex-col group hover:ring-[#ff6e00] hover:bg-orange-50 transition-all duration-500">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100/50 text-[#ff6e00] flex items-center justify-center group-hover:bg-[#ff6e00] group-hover:text-white transition-all duration-300">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => handleToggleStatus(vacancy)}
                                    className={`p-2 rounded-xl transition-all ${vacancy.isOpen ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'}`}
                                >
                                    <Power className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => { setFormData(vacancy); setIsModalOpen(true); }}
                                    className="p-2 text-slate-400 hover:text-[#ff6e00] hover:bg-orange-50 rounded-xl transition-all"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-[#ff6e00] transition-colors">{vacancy.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`w-2 h-2 rounded-full ${vacancy.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {vacancy.isOpen ? 'Currently Hiring' : 'Recruitment Paused'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-4 leading-relaxed line-clamp-2">
                                {vacancy.description}
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#ff6e00]" />
                                <span className="text-xs font-bold text-slate-600 truncate max-w-[100px]">{getApplicantsForVacancy(vacancy.id)} Applicants</span>
                            </div>
                            <div className="flex items-center gap-1 text-[#ff6e00]">
                                <Layout className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Standard Set</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={formData.id ? 'Update Position' : 'Create New Vacancy'}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Job Title</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Senior Frontend Engineer"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description & Requirements</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the role and key requirements..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all resize-none"
                        />
                    </div>
                    <div className="pt-4">
                        <Button type="submit" className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-[#ff6e00] hover:bg-[#e05d00] border-none shadow-xl shadow-orange-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{formData.id ? 'Save Changes' : 'Publish Vacancy'}</span>
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Vacancies;
