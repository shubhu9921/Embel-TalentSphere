import React, { useState, useEffect } from 'react';
import { Plus, Briefcase } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

// Modular Components
import VacancyStats from './components/Vacancies/VacancyStats';
import VacancyCard from './components/Vacancies/VacancyCard';
import VacancyFormModal from './components/Vacancies/VacancyFormModal';

const Vacancies = () => {
    const [vacancies, setVacancies] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [formData, setFormData] = useState({ id: '', title: '', description: '', isOpen: true });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [vData, cData] = await Promise.all([
                ApiService.get('/vacancies'),
                ApiService.get('/candidates')
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

    const filteredVacancies = React.useMemo(() => {
        if (filter === 'active') return vacancies.filter(v => v.isOpen);
        if (filter === 'closed') return vacancies.filter(v => !v.isOpen);
        return vacancies; // 'all' or any unrecognised value → show everything
    }, [vacancies, filter]);

    const getApplicantsForVacancy = (positionId) => {
        return candidates.filter(c => c.position === positionId).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id && vacancies.find(v => v.id === formData.id)) {
                await ApiService.put(`/vacancies/${formData.id}`, formData);
            } else {
                await ApiService.post('/vacancies', {
                    ...formData,
                    id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
                });
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
            await ApiService.put(`/vacancies/${vacancy.id}`, updated);
            setVacancies(prev => prev.map(v => v.id === vacancy.id ? updated : v));
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleDelete = async (vacancyId) => {
        if (!window.confirm('Are you sure you want to delete this vacancy?')) return;
        try {
            await ApiService.delete(`/vacancies/${vacancyId}`);
            setVacancies(prev => prev.filter(v => v.id !== vacancyId));
        } catch (error) {
            console.error('Error deleting vacancy:', error);
        }
    };



    return (
        <div className="space-y-10 page-fade-in">
            <PageHeader
                title="Active Vacancies"
                subtitle="Manage open positions and recruitment status for Embel Talentry."
                icon={Briefcase}
                actions={
                    <Button
                        onClick={() => {
                            setFormData({ id: '', title: '', description: '', isOpen: true });
                            setIsModalOpen(true);
                        }}
                        icon={Plus}
                        variant="secondary"
                    >
                        Post New Role
                    </Button>
                }
            />

            <VacancyStats stats={stats} setFilter={setFilter} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVacancies.map((vacancy) => (
                    <VacancyCard
                        key={vacancy.id}
                        vacancy={vacancy}
                        applicantsCount={getApplicantsForVacancy(vacancy.id)}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                        onEdit={(v) => { setFormData(v); setIsModalOpen(true); }}
                    />
                ))}
            </div>

            <VacancyFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Vacancies;
