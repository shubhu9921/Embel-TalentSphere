import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Edit2, Trash2, FileText, CheckCircle2,
    HelpCircle, Layers, Search, ArrowRight, Filter,
    CheckSquare, Square, ChevronDown, List, Grid,
    Upload, Briefcase
} from 'lucide-react';
import apiService from '../../services/apiService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('all');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        position: '',
        type: 'mcq',
        level: 'Basic',
        text: '',
        options: ['', '', '', ''],
        correct: '',
        selected: false
    });

    const [bulkConfig, setBulkConfig] = useState({
        position: '',
        level: 'Basic'
    });

    const [rows, setRows] = useState([]);
    const fileInputRef = useRef(null);

    const handleCSVImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const lines = content.split('\n');
            // Assuming format: Question, Option A, Option B, Option C, Option D, Correct Answer
            const dataRows = lines.slice(1).filter(line => line.trim());

            const newQuestions = dataRows.map(line => {
                const columns = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
                if (columns.length < 6) return null;

                return {
                    tempId: Date.now() + Math.random(),
                    text: columns[0],
                    options: [columns[1], columns[2], columns[3], columns[4]],
                    correct: columns[5]
                };
            }).filter(q => q !== null);

            if (newQuestions.length > 0) {
                // Combine with existing rows, remove empty first row if it exists
                setRows(prev => {
                    const filteredPrev = prev.filter(r => r.text || r.correct);
                    return [...filteredPrev, ...newQuestions];
                });
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset for same file re-import
    };

    const addRow = () => {
        setRows([...rows, {
            tempId: Date.now() + Math.random(),
            text: '',
            options: ['', '', '', ''],
            correct: ''
        }]);
    };

    const removeRow = (index) => {
        if (rows.length > 1) {
            setRows(rows.filter((_, i) => i !== index));
        }
    };

    const updateRow = (index, field, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const updateOption = (rowIndex, optIndex, value) => {
        const newRows = [...rows];
        const newOptions = [...newRows[rowIndex].options];
        newOptions[optIndex] = value;
        newRows[rowIndex].options = newOptions;
        setRows(newRows);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [qData, vData] = await Promise.all([
                apiService.get('/questions'),
                apiService.get('/vacancies')
            ]);
            setQuestions(qData);
            setVacancies(vData);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSelection = async (question) => {
        try {
            const updated = { ...question, selected: !question.selected };
            await apiService.put(`/questions/${question.id}`, updated);
            setQuestions(prev => prev.map(q => q.id === question.id ? updated : q));
        } catch (error) {
            console.error('Error toggling selection:', error);
        }
    };

    const handleBulkSelect = async (select) => {
        const filtered = filteredQuestions;
        try {
            const updates = filtered.map(q => ({ ...q, selected: select }));
            await Promise.all(updates.map(u => apiService.put(`/questions/${u.id}`, u)));
            setQuestions(prev => prev.map(q => {
                const update = updates.find(u => u.id === q.id);
                return update ? update : q;
            }));
        } catch (error) {
            console.error('Error in bulk update:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                // Edit mode
                await apiService.put(`/questions/${formData.id}`, formData);
            } else {
                // Bulk Add mode
                if (!bulkConfig.position || !bulkConfig.level) {
                    alert('Please select Vacancy and Level for the assessment pool.');
                    setSubmitting(false);
                    return;
                }

                const isValid = rows.every(r => r.text && r.correct && r.options.every(o => o));
                if (!isValid) {
                    alert('Please fill all fields for all question rows.');
                    setSubmitting(false);
                    return;
                }

                await Promise.all(rows.map(row => {
                    const { tempId, ...q } = row;
                    return apiService.post('/questions', {
                        ...q,
                        position: bulkConfig.position,
                        level: bulkConfig.level,
                        type: 'mcq',
                        id: Date.now() + Math.random(),
                        selected: false
                    });
                }));
            }
            await fetchData();
            setIsModalOpen(false);
            setFormData({ id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false });
            setRows([]);
        } catch (error) {
            console.error('Error saving question:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('Are you sure you want to remove this question?')) return;
        try {
            await apiService.delete(`/questions/${id}`);
            setQuestions(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPosition = selectedPosition === 'all' || q.position === selectedPosition;
        return matchesSearch && matchesPosition;
    });

    const activeCount = questions.filter(q => q.selected).length;

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FileText className="text-[#ff6e00] w-8 h-8" />
                        Question Bank
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and curate vacancy-specific assessment pools.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all w-64 shadow-sm"
                        />
                    </div>
                    <Button onClick={() => {
                        setFormData({ id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false });
                        setBulkConfig({
                            position: selectedPosition === 'all' ? '' : selectedPosition,
                            level: 'Basic'
                        });
                        setRows([{ tempId: Date.now(), text: '', options: ['', '', '', ''], correct: '' }]);
                        setIsModalOpen(true);
                    }} className="rounded-2xl flex items-center gap-2 bg-[#ff6e00] hover:bg-[#e05d00] shadow-xl shadow-orange-500/20 px-6 py-3.5">
                        <Plus className="w-5 h-5" />
                        <span className="font-black uppercase tracking-widest text-[11px]">Architect Questions</span>
                    </Button>
                </div>
            </div>

            {/* Selection Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="p-6 border-none shadow-xl shadow-slate-200/50 flex flex-col justify-between bg-[#002D5E] text-white">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Active Pool</p>
                        <h2 className="text-4xl font-black tracking-tighter">{activeCount.toString().padStart(2, '0')}</h2>
                    </div>
                    <p className="text-[10px] font-bold opacity-60 mt-4 leading-relaxed italic uppercase tracking-widest">Questions currently live in assessments.</p>
                </Card>

                <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 w-full md:w-auto">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Filter by Vacancy</p>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select
                                value={selectedPosition}
                                onChange={(e) => setSelectedPosition(e.target.value)}
                                className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#ff6e00] transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Vacancies</option>
                                {vacancies.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                            onClick={() => handleBulkSelect(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-orange-50 text-[#ff6e00] font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-orange-100 transition-all active:scale-95"
                        >
                            <CheckSquare size={16} /> Activate All
                        </button>
                        <button
                            onClick={() => handleBulkSelect(false)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                        >
                            <Square size={16} /> Deactivate All
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabular Question Bank */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden rounded-[2.5rem]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 text-center">Active</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[300px]">Question Details</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vacancy</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredQuestions.map((q) => (
                                <tr key={q.id} className={`group transition-all hover:bg-orange-50/30 ${q.selected ? 'bg-orange-50/10' : ''}`}>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleToggleSelection(q)}
                                                className={`w-6 h-6 rounded-lg transition-all flex items-center justify-center border-2 ${q.selected ? 'bg-[#ff6e00] border-[#ff6e00] text-white' : 'bg-white border-slate-200 text-transparent'}`}
                                            >
                                                <CheckCircle2 size={14} className={q.selected ? 'opacity-100' : 'opacity-0'} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-800 leading-relaxed group-hover:text-[#ff6e00] transition-colors">{q.text}</p>
                                            <div className="flex flex-wrap gap-2 pt-2 opacity-60 group-hover:opacity-100 transition-all">
                                                {q.options.map((opt, i) => (
                                                    <span key={i} className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${opt === q.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {opt}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                                            {vacancies.find(v => v.id === q.position)?.title || q.position}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${q.level === 'Basic' ? 'bg-emerald-50 text-emerald-600' :
                                            q.level === 'Intermediate' ? 'bg-amber-50 text-amber-600' :
                                                'bg-rose-50 text-rose-600'
                                            }`}>
                                            {q.level || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setFormData(q); setIsModalOpen(true); }}
                                                className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteQuestion(q.id)}
                                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-24 bg-white">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                                <Search size={32} />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No questions found matching criteria</p>
                        </div>
                    )}
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={formData.id ? 'Refine Question' : 'Architect Assessment Pool'}
                size="xl"
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
                    {!formData.id && (
                        // SHARED CONFIG FOR BULK (PREMIUM COMMAND HEADER)
                        <div className="sticky top-[-25px] z-20 bg-white pt-2 pb-6 border-b border-slate-100 mb-2">
                            <div className="bg-gradient-to-br from-slate-900 to-[#002D5E] p-8 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6e00]/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:bg-[#ff6e00]/20 transition-all duration-700" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full -ml-16 -mb-16 pointer-events-none" />

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-10">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 ml-1">
                                            <Briefcase className="w-3 h-3 text-[#ff6e00]" />
                                            <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Target Vacancy</label>
                                        </div>
                                        <div className="relative group/select">
                                            <select
                                                required
                                                value={bulkConfig.position}
                                                onChange={(e) => setBulkConfig({ ...bulkConfig, position: e.target.value })}
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-[#ff6e00] focus:ring-4 focus:ring-[#ff6e00]/10 transition-all appearance-none cursor-pointer backdrop-blur-md"
                                            >
                                                <option value="" className="bg-slate-900">Select vacancy...</option>
                                                {vacancies.map(v => <option key={v.id} value={v.id} className="bg-slate-900">{v.title}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within/select:text-[#ff6e00] pointer-events-none transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 ml-1">
                                            <Layers className="w-3 h-3 text-[#ff6e00]" />
                                            <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Assigned Level</label>
                                        </div>
                                        <div className="relative group/select">
                                            <select
                                                required
                                                value={bulkConfig.level}
                                                onChange={(e) => setBulkConfig({ ...bulkConfig, level: e.target.value })}
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-[#ff6e00] focus:ring-4 focus:ring-[#ff6e00]/10 transition-all appearance-none cursor-pointer backdrop-blur-md"
                                            >
                                                <option value="Basic" className="bg-slate-900">Basic (Entry Level)</option>
                                                <option value="Intermediate" className="bg-slate-900">Intermediate (Professional)</option>
                                                <option value="Advanced" className="bg-slate-900">Advanced (Specialist)</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within/select:text-[#ff6e00] pointer-events-none transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 w-full md:w-auto pt-4 md:pt-0">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleCSVImport}
                                        accept=".csv"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full md:w-auto px-8 py-5 bg-[#ff6e00] text-white rounded-3xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-[#e05d00] hover:shadow-2xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-3 group/btn active:scale-95 border-none"
                                    >
                                        <Upload size={16} className="group-hover/btn:translate-y-[-1px] transition-transform" />
                                        Import Project CSV
                                    </button>
                                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest text-center mt-3 italic">Supported format: .csv / .xlsx</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-1">
                        {formData.id ? (
                            // SINGLE EDIT FORM
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Vacancy</label>
                                        <select
                                            required
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#ff6e00] transition-all"
                                        >
                                            <option value="">Select vacancy...</option>
                                            {vacancies.map(v => (
                                                <option key={v.id} value={v.id}>{v.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Complexity Level</label>
                                        <select
                                            required
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#ff6e00] transition-all"
                                        >
                                            <option value="Basic">Basic (Entry Level)</option>
                                            <option value="Intermediate">Intermediate (Professional)</option>
                                            <option value="Advanced">Advanced (Specialist)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Question Statement</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        placeholder="Enter the technical challenge here..."
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#ff6e00] transition-all resize-none shadow-inner"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.options.map((option, idx) => (
                                        <div key={idx} className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">
                                                {String.fromCharCode(idx + 65)}
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                value={option}
                                                onChange={(e) => {
                                                    const newOps = [...formData.options];
                                                    newOps[idx] = e.target.value;
                                                    setFormData({ ...formData, options: newOps });
                                                }}
                                                placeholder={`Option ${idx + 1}`}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#ff6e00] transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 pt-2 border-t border-slate-50">
                                    <label className="text-[10px] font-black text-[#ff6e00] uppercase tracking-[0.2em] ml-1">Key Verification (Correct Answer)</label>
                                    <select
                                        required
                                        value={formData.correct}
                                        onChange={(e) => setFormData({ ...formData, correct: e.target.value })}
                                        className="w-full px-5 py-4 bg-orange-50 border border-orange-100 rounded-2xl text-sm font-black text-[#ff6e00] focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">Define correctly assigned value...</option>
                                        {formData.options.map((opt, i) => opt && (
                                            <option key={i} value={opt}>Option {String.fromCharCode(65 + i)}: {opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            // BULK TABULAR FORM
                            <div className="overflow-x-auto lg:overflow-x-visible">
                                <table className="w-full border-separate border-spacing-y-3 min-w-[900px] lg:min-w-full">
                                    <thead className="sticky top-0 z-10 bg-white">
                                        <tr className="text-left">
                                            <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[300px]">Question Statement</th>
                                            <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[400px]">Options (A | B | C | D)</th>
                                            <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Correct Answer</th>
                                            <th className="px-4 py-2 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, rowIndex) => (
                                            <tr key={row.tempId} className="group">
                                                <td className="px-2">
                                                    <textarea
                                                        required
                                                        rows={1}
                                                        value={row.text}
                                                        onChange={(e) => updateRow(rowIndex, 'text', e.target.value)}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:border-[#ff6e00] outline-none resize-none"
                                                        placeholder="Enter question..."
                                                    />
                                                </td>
                                                <td className="px-2">
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {row.options.map((opt, optIndex) => (
                                                            <input
                                                                key={optIndex}
                                                                required
                                                                type="text"
                                                                value={opt}
                                                                onChange={(e) => updateOption(rowIndex, optIndex, e.target.value)}
                                                                className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold focus:border-[#ff6e00] outline-none"
                                                                placeholder={String.fromCharCode(65 + optIndex)}
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-2">
                                                    <select
                                                        required
                                                        value={row.correct}
                                                        onChange={(e) => updateRow(rowIndex, 'correct', e.target.value)}
                                                        className="w-full px-4 py-3 bg-orange-50 border border-orange-100 text-[#ff6e00] rounded-xl text-[10px] font-black uppercase outline-none"
                                                    >
                                                        <option value="">Select Option...</option>
                                                        {row.options.map((opt, i) => opt && (
                                                            <option key={i} value={opt}>{String.fromCharCode(65 + i)}: {opt.substring(0, 15)}...</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(rowIndex)}
                                                        disabled={rows.length === 1}
                                                        className="p-3 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-0"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={addRow}
                                    className="w-full py-4 mt-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:border-[#ff6e00] hover:text-[#ff6e00] transition-all flex items-center justify-center gap-3 group"
                                >
                                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Add Another Question Row</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-[-25px] z-20 bg-white pt-6 border-t border-slate-50 flex justify-end gap-4 mt-4">
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="px-10 py-5 bg-[#ff6e00] text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-[#e05d00] transition-all active:scale-[0.98] flex items-center gap-3"
                        >
                            {submitting ? <Loader /> : (
                                <>
                                    <span className="uppercase tracking-widest">{formData.id ? 'Save Changes' : `Publish ${rows.length} Questions`}</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default QuestionBank;
