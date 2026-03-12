import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Users } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

// Modular Components
import CandidateStats from './components/CandidatesList/CandidateStats';
import CandidateCard from './components/CandidatesList/CandidateCard';
import CandidateDetailModal from './components/CandidatesList/CandidateDetailModal';
import InterviewScheduleModal from './components/CandidatesList/InterviewScheduleModal';

const CandidatesList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialStatus = queryParams.get('status') || 'all';

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [interviewData, setInterviewData] = useState({ date: '', time: '', interviewerId: '' });
    const [interviewers, setInterviewers] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [statusFilter, setStatusFilter] = useState(initialStatus);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [candData, adminData, qData, intData] = await Promise.all([
                ApiService.get('/candidates'),
                ApiService.get('/admin_users'),
                ApiService.get('/questions'),
                ApiService.get('/interviews')
            ]);
            setCandidates(candData);
            setInterviewers(adminData.filter(u => u.role === 'interviewer'));
            setQuestions(qData);
            setInterviews(intData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusGroups = React.useMemo(() => ({
        shortlisted: ['shortlisted', 'interview scheduled'],
        rejected: ['rejected', 'not selected'],
        applied: ['applied', 'pending', 'registered']
    }), []);

    const stats = React.useMemo(() => ({
        total: candidates.length,
        shortlisted: candidates.filter(c => statusGroups.shortlisted.includes(c.status)).length,
        rejected: candidates.filter(c => statusGroups.rejected.includes(c.status)).length,
        pending: candidates.filter(c => statusGroups.applied.includes(c.status)).length
    }), [candidates, statusGroups]);

    const handleUpdateStatus = async (id, status, extraData = {}) => {
        try {
            const updatePayload = { status, ...extraData };
            await ApiService.patch(`/candidates/${id}`, updatePayload);
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updatePayload } : c));
            if (selectedCandidate?.id === id) {
                setSelectedCandidate(prev => ({ ...prev, ...updatePayload }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update candidate status. Please check your connection.');
        }
    };

    const handleDeleteCandidate = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this candidate?')) return;
        try {
            await ApiService.delete(`/candidates/${id}`);
            setCandidates(prev => prev.filter(c => c.id !== id));
            if (selectedCandidate?.id === id) {
                setIsDetailModalOpen(false);
                setSelectedCandidate(null);
            }
        } catch (error) {
            console.error('Error deleting candidate:', error);
            alert('Failed to delete candidate. Please try again.');
        }
    };

    const handleScheduleInterview = async () => {
        try {
            if (!interviewData.date || !interviewData.time) {
                return alert('Please select both a date and time for the interview.');
            }
            const selectedDateTime = new Date(`${interviewData.date}T${interviewData.time}`);
            const now = new Date();
            if (selectedDateTime <= now) return alert('Interview must be scheduled for a future date/time.');

            await ApiService.post('/interviews', {
                candidateId: selectedCandidate.id,
                interviewerId: parseInt(interviewData.interviewerId),
                date: interviewData.date,
                time: interviewData.time,
                status: 'scheduled',
                createdAt: now.toISOString()
            });
            await handleUpdateStatus(selectedCandidate.id, 'interview scheduled');
            setIsInterviewModalOpen(false);
            setInterviewData({ date: '', time: '', interviewerId: '' });
            fetchData(); // Refresh all data including interviews
        } catch (error) {
            console.error('Error scheduling interview:', error);
            alert('Failed to schedule interview. Ensure an interviewer is selected.');
        }
    };

    const filteredCandidates = React.useMemo(() => {
        return candidates.filter(c => {
            const matchesSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.email || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || 
                                 (statusGroups[statusFilter] ? statusGroups[statusFilter].includes(c.status) : c.status === statusFilter);
            return matchesSearch && matchesStatus;
        });
    }, [candidates, searchTerm, statusFilter, statusGroups]);


    if (loading) return <div className="p-10 flex justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 page-fade-in">
            <PageHeader
                title="Candidates Talent Pool"
                subtitle="Review applicant profiles, assessment scores, and manage hiring stages."
                actions={
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                type="text"
                                placeholder="Find application..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all w-64 shadow-sm"
                            />
                        </div>
                        <Button 
                            variant="outline" 
                            icon={Filter} 
                            onClick={() => console.log('Filter clicked')}
                        >
                            Filter
                        </Button>
                    </div>
                }
            />

            <CandidateStats stats={stats} setStatusFilter={setStatusFilter} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCandidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        interviews={interviews}
                        interviewers={interviewers}
                        onClick={() => { setSelectedCandidate(candidate); setIsDetailModalOpen(true); }}
                        onDelete={handleDeleteCandidate}
                    />
                ))}
            </div>

            <CandidateDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                candidate={selectedCandidate}
                questions={questions}
                interviews={interviews}
                interviewers={interviewers}
                onUpdateStatus={handleUpdateStatus}
                onScheduleInterview={() => setIsInterviewModalOpen(true)}
            />

            <InterviewScheduleModal
                isOpen={isInterviewModalOpen}
                onClose={() => setIsInterviewModalOpen(false)}
                interviewData={interviewData}
                setInterviewData={setInterviewData}
                interviewers={interviewers}
                onSchedule={handleScheduleInterview}
            />
        </div>
    );
};

export default CandidatesList;
