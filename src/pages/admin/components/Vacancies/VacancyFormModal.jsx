import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';

const VacancyFormModal = ({ isOpen, onClose, formData = {}, setFormData, onSubmit }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={formData.id ? 'Update Position' : 'Create New Vacancy'}
            size="md"
        >
            <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label htmlFor="vacancy-title" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Job Title</label>
                    <input
                        id="vacancy-title"
                        required
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="vacancy-desc" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description & Requirements</label>
                    <textarea
                        id="vacancy-desc"
                        required
                        rows={4}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the role and key requirements..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all resize-none"
                    />
                </div>
                <div className="pt-4">
                    <Button 
                        type="submit" 
                        variant="secondary" 
                        icon={CheckCircle2}
                        className="w-full"
                    >
                        {formData.id ? 'Save Changes' : 'Publish Vacancy'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default VacancyFormModal;
