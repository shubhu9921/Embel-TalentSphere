import React, { useRef } from 'react';
import { Upload, Plus, Trash2, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import Card from '../../../../components/Card';

const QuestionArchitect = ({
    vacancies,
    bulkConfig,
    setBulkConfig,
    rows,
    setRows,
    onSubmit,
    submitting,
    onBack
}) => {
    const fileInputRef = useRef(null);
    const [activeRowIndex, setActiveRowIndex] = React.useState(0);

    // Ensure rows exists
    const currentRows = rows.length > 0 ? rows : [{ tempId: Date.now(), text: '', options: ['', '', '', ''], correct: '' }];
    const currentRow = currentRows[activeRowIndex] || currentRows[0];

    const handleCSVImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const lines = content.split(/\r?\n/);
            const dataRows = lines.slice(1).filter(line => line.trim());

            const newQuestions = dataRows.map(line => {
                const columns = [];
                let current = '';
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"' && line[i + 1] === '"') {
                        current += '"';
                        i++; // skip escaped quote
                    } else if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        columns.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                columns.push(current.trim());

                if (columns.length < 6) return null;
                const options = [columns[1], columns[2], columns[3], columns[4]];
                const correctStr = columns[5];
                const correctIndex = options.findIndex(o => o.trim().toLowerCase() === correctStr.trim().toLowerCase());
                
                return {
                    tempId: Date.now() + Math.random(),
                    text: columns[0],
                    options,
                    correct: correctIndex !== -1 ? String(correctIndex) : ''
                };
            }).filter(q => q !== null);

            if (newQuestions.length > 0) {
                setRows(prevRows => {
                    const existing = prevRows.filter(r => r.text?.trim() || r.correct !== '' || r.options.some(o => o?.trim()));
                    const updated = [...existing, ...newQuestions];
                    setActiveRowIndex(existing.length);
                    return updated;
                });
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const addRow = () => {
        const newRow = { tempId: Date.now() + Math.random(), text: '', options: ['', '', '', ''], correct: '' };
        setRows(prev => {
            const updated = [...prev, newRow];
            setActiveRowIndex(updated.length - 1);
            return updated;
        });
    };

    const removeRow = (index) => {
        setRows(prev => {
            if (prev.length <= 1) return prev;
            const updated = prev.filter((_, i) => i !== index);
            if (activeRowIndex >= updated.length) {
                setActiveRowIndex(updated.length - 1);
            }
            return updated;
        });
    };

    const updateCurrentRow = (field, value) => {
        setRows(prev => {
            const updated = [...prev];
            updated[activeRowIndex] = { ...updated[activeRowIndex], [field]: value };
            return updated;
        });
    };

    const updateOption = (optIndex, value) => {
        setRows(prev => {
            const updated = [...prev];
            const row = { ...updated[activeRowIndex] };
            const newOptions = [...row.options];
            newOptions[optIndex] = value;
            row.options = newOptions;

            // If the correct answer matches the index, it stays. 
            // If it matches the content (old behavior), we already transitioned to index-based.
            // But let's clarify that the Select now uses index as id.
            updated[activeRowIndex] = row;
            return updated;
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-200px)] items-start pb-12">
            {/* Sidebar: Question List */}
            <div className="lg:col-span-3 space-y-4 h-full">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Build Queue ({currentRows.length})</h3>
                    <Button variant="ghost" size="xs" icon={Plus} onClick={addRow} className="text-emerald-500 hover:bg-emerald-50">Add</Button>
                </div>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                    {currentRows.map((row, idx) => (
                        <div 
                            key={row.tempId}
                            onClick={() => setActiveRowIndex(idx)}
                            className={`
                                group p-4 rounded-2xl border-2 transition-all cursor-pointer relative
                                ${activeRowIndex === idx 
                                    ? 'bg-white border-[#ff6e00] shadow-xl shadow-orange-500/10 z-10' 
                                    : 'bg-slate-50 border-transparent hover:border-slate-200'
                                }
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`
                                    w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0
                                    ${activeRowIndex === idx ? 'bg-[#ff6e00] text-white' : 'bg-slate-200 text-slate-500'}
                                `}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[11px] font-bold truncate ${activeRowIndex === idx ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {row.text || 'Draft Question...'}
                                    </p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">
                                        {row.correct !== '' ? `Answer: ${String.fromCharCode(65 + parseInt(row.correct))}` : 'No Answer Set'}
                                    </p>
                                </div>
                                {currentRows.length > 1 && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removeRow(idx); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Form: Redesigned Grid */}
            <div className="lg:col-span-9">
                <Card className="border-none shadow-elevation-high p-8 rounded-[2.5rem] bg-white overflow-visible">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-all">
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-[#19325c]">Architect Assessment</h2>
                                <p className="text-xs font-medium text-slate-400">Assemble vacancy-specific logic and questions.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto overflow-visible">
                        {/* Row 1: Vacancy | Level */}
                        <div className="grid grid-cols-2 gap-4">
                            <Select 
                                label="Target Vacancy" 
                                value={bulkConfig.position} 
                                options={vacancies.map(v => ({ id: v.id, label: v.title }))} 
                                onSelect={id => setBulkConfig({ ...bulkConfig, position: id })} 
                                placeholder="Select Vacancy" 
                            />
                            <Select 
                                label="Difficulty Level" 
                                value={bulkConfig.level} 
                                options={['Basic', 'Intermediate', 'Advanced'].map(l => ({ id: l, label: l }))} 
                                onSelect={l => setBulkConfig({ ...bulkConfig, level: l })} 
                                placeholder="Select Level" 
                            />
                        </div>

                        {/* Row 2: Import CSV */}
                        <div className="flex justify-center">
                            <input type="file" ref={fileInputRef} onChange={handleCSVImport} accept=".csv" className="hidden" />
                            <Button 
                                type="button"
                                variant="outline" 
                                size="md" 
                                icon={Upload} 
                                onClick={() => fileInputRef.current.click()}
                                className="rounded-2xl px-12 border-2 border-slate-100 group-hover:border-[#ff6e00] transition-all bg-slate-50/50 hover:bg-white"
                            >
                                Import CSV Assessment Pool
                            </Button>
                        </div>

                        {/* Row 3: Question text */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Question Content</label>
                            <textarea 
                                required 
                                value={currentRow.text} 
                                onChange={e => updateCurrentRow('text', e.target.value)} 
                                placeholder="What is the output of...?" 
                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold h-32 outline-none focus:border-[#ff6e00] focus:bg-white transition-all shadow-inner-sm resize-none" 
                            />
                        </div>

                        {/* Row 4 & 5: Options A | B and C | D */}
                        <div className="grid grid-cols-2 gap-4">
                            {currentRow.options.map((opt, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 group-focus-within:border-[#ff6e00] group-focus-within:text-[#ff6e00] transition-all">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <input 
                                        required 
                                        value={opt} 
                                        onChange={e => updateOption(i, e.target.value)} 
                                        placeholder={`Option ${String.fromCharCode(65 + i)}`} 
                                        className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#ff6e00] focus:bg-white transition-all" 
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Row 6: Correct Answer */}
                        <div className="max-w-md mx-auto w-full">
                            <Select 
                                label="Designate Correct Answer" 
                                value={currentRow.correct} 
                                options={currentRow.options.map((o, idx) => ({ 
                                    id: String(idx), 
                                    label: `${String.fromCharCode(65 + idx)}: ${o || '(Empty Option)'}`,
                                    disabled: !o.trim()
                                })).filter(o => !o.disabled)} 
                                onSelect={idx => updateCurrentRow('correct', idx)} 
                                placeholder="Select correct option..." 
                            />
                        </div>

                        {/* Row 7: Actions */}
                        <div className="flex items-center justify-center gap-4 pt-8 border-t border-slate-50 mt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="lg" 
                                icon={Plus} 
                                onClick={addRow}
                                className="rounded-2xl px-8 border-2 border-dashed border-slate-200 hover:border-[#ff6e00] hover:text-[#ff6e00] transition-all bg-transparent"
                            >
                                Add Another Question
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="lg" 
                                icon={Send} 
                                onClick={onSubmit}
                                loading={submitting}
                                className="rounded-2xl px-12 shadow-orange-glow hover:shadow-orange-glow-hover"
                            >
                                Publish Pool ({currentRows.length})
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Info Card */}
                <div className="mt-6 p-6 bg-orange-50/50 rounded-3xl border border-orange-100/50 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#ff6e00]/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-[#ff6e00]" size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#ff6e00]">Design Best Practice</h4>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed mt-1">
                            Ensure questions are clear and options are distinct. Use the "Difficulty Level" to balance the assessment pool. You can publish multiple questions at once by adding them to the queue on the left.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionArchitect;
