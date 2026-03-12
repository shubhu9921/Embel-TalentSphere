import React from 'react';
import { Users, Mail, Shield, Briefcase, ChevronRight } from 'lucide-react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';

const TeamMemberModal = ({
    isOpen,
    onClose,
    editingMember,
    formData,
    setFormData,
    vacancies,
    submitting,
    onSubmit
}) => {
    const roles = [
        { id: 'interviewer', label: 'Interviewer' },
        { id: 'hr', label: 'HR Manager' }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingMember ? 'Update Authority' : 'Create Authority'}
            subtitle="Configure access levels and technical domains."
            size="md"
        >
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label htmlFor="member-name" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                id="member-name"
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="member-email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                id="member-email"
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all"
                                placeholder="doe@embel.co.in"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="member-password" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                            Password {editingMember && "(Leave blank to keep current)"}
                        </label>
                        <div className="relative group">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                id="member-password"
                                required={!editingMember}
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                        <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100" role="radiogroup" aria-label="System Role">
                            {roles.map(r => (
                                <Button
                                    key={r.id}
                                    type="button"
                                    variant={formData.role === r.id ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, role: r.id })}
                                    aria-checked={formData.role === r.id}
                                    role="radio"
                                    className={`flex-1 ${formData.role === r.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {r.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {formData.role === 'interviewer' && (
                    <div className="space-y-0 overflow-visible">
                        <Select
                            label="Technical Domain"
                            value={formData.domain}
                            options={vacancies.map(v => ({ id: v.id, label: v.title }))}
                            onSelect={id => setFormData({ ...formData, domain: id })}
                            placeholder="Select Domain Expertise"
                            icon={Briefcase}
                        />
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="ghost"
                        className="flex-1"
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        variant="secondary"
                        className="flex-[2]"
                        loading={submitting}
                        icon={editingMember ? undefined : ChevronRight}
                    >
                        {editingMember ? 'UPDATE ACCESS' : 'CONFIRM ACCESS'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TeamMemberModal;
