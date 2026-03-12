import React from 'react';
import { Users, Mail, Award, Edit3, Trash2 } from 'lucide-react';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';

const TeamMemberCard = ({ member, vacancies, onEdit, onDelete }) => {
    return (
        <Card className="p-6 border-none shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 group hover:ring-[#ff6e00]/30 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-colors">
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-black text-slate-800 text-lg tracking-tight uppercase">{member.name}</h3>
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${member.role === 'interviewer' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                {member.role}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-slate-400 font-bold text-xs">
                            <div className="flex items-center gap-1.5">
                                <Mail size={12} />
                                {member.email}
                            </div>
                            {member.role === 'interviewer' && member.domain && (
                                <div className="flex items-center gap-1.5 text-orange-500">
                                    <Award size={12} />
                                    Domain: {vacancies?.find(v => v.id === member.domain)?.title || member.domain}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit3}
                        onClick={() => onEdit(member)}
                        className="text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                        title="Edit Member"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => { if (window.confirm('Are you sure you want to remove this team member?')) onDelete(member.id); }}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                        title="Remove Member"
                    />
                </div>
            </div>
        </Card>
    );
};

export default TeamMemberCard;
