import React from 'react';
import { Briefcase, Power, Trash2, Edit2, Users, Layout } from 'lucide-react';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';

const VacancyCard = ({ vacancy, applicantsCount, onToggleStatus, onDelete, onEdit }) => {
    return (
        <Card className="p-6 border-none ring-1 ring-slate-100 flex flex-col group">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100/50 text-[#ff6e00] flex items-center justify-center group-hover:bg-[#ff6e00] group-hover:text-white transition-all duration-300">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5">
                    <Button
                        onClick={() => onToggleStatus(vacancy)}
                        variant="ghost"
                        size="xs"
                        icon={Power}
                        className={vacancy.isOpen ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'}
                    />
                    <Button
                        onClick={() => { if (window.confirm('Are you sure you want to delete this vacancy?')) onDelete(vacancy.id); }}
                        variant="ghost"
                        size="xs"
                        icon={Trash2}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                    />
                    <Button
                        onClick={() => onEdit(vacancy)}
                        variant="ghost"
                        size="xs"
                        icon={Edit2}
                        className="text-slate-400 hover:text-[#ff6e00]"
                    />
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-lg font-black text-[#19325c] leading-tight group-hover:text-[#ff6e00] transition-colors">{vacancy.title}</h3>
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
                    <span className="text-xs font-bold text-slate-600 truncate max-w-25">{applicantsCount} {applicantsCount === 1 ? 'Applicant' : 'Applicants'}</span>
                </div>
                <div className="flex items-center gap-1 text-[#ff6e00]">
                    <Layout className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Standard Set</span>
                </div>
            </div>
        </Card>
    );
};

export default VacancyCard;
