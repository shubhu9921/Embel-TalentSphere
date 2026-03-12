import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Filter } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

// Modular Components
import ProctoringStats from './components/Proctoring/ProctoringStats';
import ProctoringCandidateCard from './components/Proctoring/ProctoringCandidateCard';
import ProctoringLogModal from './components/Proctoring/ProctoringLogModal';

const ProctoringDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const data = await ApiService.get('/candidates');
            // Filter candidates who have proctoring logs or are currently in exam
            setCandidates(data.filter(c => c.status === 'applied' || (c.proctoringLogs && c.proctoringLogs.length > 0)));
        } catch (error) {
            console.error('Error fetching proctoring data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getViolationCount = (logs) => logs ? logs.length : 0;
    const isTerminated = (c) => c.submissionReason === 'Interview terminated due to suspicious activity.';

    const stats = {
        violationCount: filteredCandidates.reduce((acc, c) => acc + getViolationCount(c.proctoringLogs), 0),
        terminatedCount: filteredCandidates.filter(isTerminated).length,
        clearCount: filteredCandidates.filter(c => getViolationCount(c.proctoringLogs) === 0).length
    };


    if (loading) return <div className="p-10 flex justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-8 page-fade-in">
            <PageHeader
                title={<>Live Proctoring <span className="text-orange-500">Center</span></>}
                subtitle="Real-time integrity monitoring and malpractice detection."
                icon={ShieldAlert}
                actions={
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <label htmlFor="proctoring-search" className="sr-only">Search candidates</label>
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                            <input
                                id="proctoring-search"
                                type="text"
                                placeholder="Search candidates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 w-64 font-bold text-slate-700 transition-all shadow-sm"
                            />
                        </div>
                        <Button
                            onClick={() => console.log('Filter clicked')}
                            variant="ghost"
                            size="md"
                            icon={Filter}
                            className="bg-slate-50 border-slate-100 shadow-sm"
                        />
                    </div>
                }
            />

            <ProctoringStats
                candidates={filteredCandidates}
                violationCount={stats.violationCount}
                terminatedCount={stats.terminatedCount}
                clearCount={stats.clearCount}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCandidates.map((candidate) => (
                    <ProctoringCandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onSelect={setSelectedCandidate}
                    />
                ))}
            </div>

            <ProctoringLogModal
                isOpen={!!selectedCandidate}
                onClose={() => setSelectedCandidate(null)}
                candidate={selectedCandidate}
            />
        </div>
    );
};

export default ProctoringDashboard;
