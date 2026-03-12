import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, ArrowLeft } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

// Modular Components
import QuestionStats from './components/QuestionBank/QuestionStats';
import QuestionFilters from './components/QuestionBank/QuestionFilters';
import QuestionTable from './components/QuestionBank/QuestionTable';
import QuestionArchitect from './components/QuestionBank/QuestionArchitect';

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('all');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false
    });

    const [bulkConfig, setBulkConfig] = useState({ position: '', level: 'Basic' });
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [qData, vData] = await Promise.all([
                ApiService.get('/questions'),
                ApiService.get('/vacancies')
            ]);
            setQuestions(qData);
            setVacancies(vData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load data from server. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSelection = async (question) => {
        try {
            const updated = { ...question, selected: !question.selected };
            await ApiService.put(`/questions/${question.id}`, updated);
            setQuestions(prev => prev.map(q => q.id === question.id ? updated : q));
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update question status. Please try again.');
        }
    };

    const handleBulkSelect = async (select) => {
        try {
            const filtered = [...filteredQuestions];
            const updatedQuestions = [];
            
            // Sequential processing is more stable for json-server file writes
            for (const q of filtered) {
                try {
                    const updated = { ...q, selected: select };
                    await ApiService.put(`/questions/${q.id}`, updated);
                    updatedQuestions.push(updated);
                } catch (err) {
                    console.error(`Failed to update question ${q.id}:`, err);
                }
            }

            setQuestions(prev => prev.map(q => {
                const update = updatedQuestions.find(u => u.id === q.id);
                return update ? update : q;
            }));

            if (updatedQuestions.length < filtered.length) {
                alert(`Updated ${updatedQuestions.length} of ${filtered.length} questions. Some failed.`);
            }
        } catch (error) {
            console.error('Error in bulk update:', error);
            alert('Failed to perform bulk update. Please check your connection.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await ApiService.delete(`/questions/${id}`);
            setQuestions(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete question. It might be referenced elsewhere.');
        }
    };


    const [viewMode, setViewMode] = useState('pool'); // 'pool' or 'architect'

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await ApiService.put(`/questions/${formData.id}`, formData);
            } else {
                if (!bulkConfig.position) return alert('Please select a target vacancy first.');
                
                const validRows = rows.filter(r => r.text.trim());
                if (validRows.length === 0) return alert('Please add at least one question.');

                await Promise.all(validRows.map(row => ApiService.post('/questions', {
                    ...row,
                    position: bulkConfig.position,
                    level: bulkConfig.level,
                    type: 'mcq',
                    id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                    selected: false
                })));
            }
            fetchData();
            setViewMode('pool');
            setFormData({ id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false });
            setRows([]);
            setBulkConfig({ position: '', level: 'Basic' });
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save. Please check your network and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (q) => {
        // Prepare for architect view in "edit" mode (single row)
        setFormData(q);
        setBulkConfig({ position: q.position, level: q.level });
        setRows([{ ...q, tempId: q.id }]);
        setViewMode('architect');
    };

    const handleArchitectMode = () => {
        setFormData({ id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false });
        setBulkConfig({ position: selectedPosition === 'all' ? '' : selectedPosition, level: 'Basic' });
        setRows([{ tempId: Date.now(), text: '', options: ['', '', '', ''], correct: '' }]);
        setViewMode('architect');
    };

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPosition = selectedPosition === 'all' || q.position === selectedPosition;
        return matchesSearch && matchesPosition;
    });

    const activeCount = questions.filter(q => q.selected).length;
    if (loading) return <Loader />;

    return (
        <div className="space-y-6 page-fade-in min-h-screen">
            <PageHeader
                title={viewMode === 'pool' ? "Question Bank" : "Architect Assessment"}
                subtitle={viewMode === 'pool' ? "Manage and curate vacancy-specific assessment pools." : "Create and configure high-quality assessment questions."}
                actions={
                    <div className="flex items-center gap-3">
                        {viewMode === 'pool' && (
                            <>
                                <div className="relative group">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search keywords..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all w-64 shadow-sm"
                                    />
                                </div>
                                <Button
                                    icon={Plus}
                                    variant="secondary"
                                    onClick={handleArchitectMode}
                                >
                                    Architect Questions
                                </Button>
                            </>
                        )}
                        {viewMode === 'architect' && (
                            <Button variant="ghost" onClick={() => setViewMode('pool')} icon={ArrowLeft}>
                                Back to Pool
                            </Button>
                        )}
                    </div>
                }
            />

            {viewMode === 'pool' ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <QuestionStats activeCount={activeCount} />
                        <QuestionFilters
                            selectedPosition={selectedPosition}
                            setSelectedPosition={setSelectedPosition}
                            vacancies={vacancies}
                            onBulkSelect={handleBulkSelect}
                            stats={{
                                active: filteredQuestions.filter(q => q.selected).length,
                                inactive: filteredQuestions.filter(q => !q.selected).length
                            }}
                        />
                    </div>

                    <QuestionTable
                        questions={filteredQuestions}
                        vacancies={vacancies}
                        onToggleSelection={handleToggleSelection}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </>
            ) : (
                <QuestionArchitect
                    vacancies={vacancies}
                    bulkConfig={bulkConfig}
                    setBulkConfig={setBulkConfig}
                    rows={rows}
                    setRows={setRows}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    onBack={() => setViewMode('pool')}
                />
            )}
        </div>
    );
};

export default QuestionBank;
