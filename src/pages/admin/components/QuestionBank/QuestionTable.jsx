import { Edit2, Trash2, Check, Search } from 'lucide-react';
import Card from '../../../../components/Card';
import Badge from '../../../../components/Badge';
import Button from '../../../../components/Button';

const QuestionTable = ({
    questions = [],
    vacancies = [],
    onToggleSelection,
    onEdit,
    onDelete
}) => {
    return (
        <Card className="border-none shadow-elevation-high overflow-hidden rounded-[2.5rem]" noPadding>
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
                        {questions.map((q) => (
                            <tr key={q.id} className={`group transition-all duration-300 ${q.selected ? 'bg-emerald-50/20' : ''}`}>
                                <td className="px-8 py-6">
                                    <div className="flex justify-center">
                                        <Button
                                            variant="ghost"
                                            size="xs"
                                            icon={Check}
                                            onClick={() => onToggleSelection?.(q)}
                                            className={`rounded-lg border-2 transition-all duration-300 ${
                                                q.selected 
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                                : 'bg-white border-slate-200 text-transparent hover:border-slate-300'
                                            }`}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800 leading-relaxed group-hover:text-[#ff6e00] transition-colors">{q.text}</p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {(q.options || []).map((opt, i) => (
                                                <Badge
                                                    key={i}
                                                    variant={opt === q.correct ? 'success' : 'neutral'}
                                                    size="sm"
                                                    className="uppercase tracking-wider"
                                                >
                                                    {opt}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                                        {vacancies.find(v => v.id === q.position)?.title || q.position || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-6">
                                    <Badge
                                        variant={q.level === 'Basic' ? 'success' : q.level === 'Intermediate' ? 'warning' : 'danger'}
                                        size="md"
                                        className="uppercase tracking-widest"
                                    >
                                        {q.level || 'General'}
                                    </Badge>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Edit2}
                                            onClick={() => onEdit?.(q)}
                                            className="text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Trash2}
                                            onClick={() => onDelete?.(q.id)}
                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {questions.length === 0 && (
                    <div className="text-center py-24 bg-white">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                            <Search size={32} />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No questions found matching criteria</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default QuestionTable;
