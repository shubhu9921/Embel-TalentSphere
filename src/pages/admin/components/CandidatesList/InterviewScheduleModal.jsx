import React from 'react';
import { Users, Calendar } from 'lucide-react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';

const InterviewScheduleModal = ({
    isOpen,
    onClose,
    interviewData,
    setInterviewData,
    interviewers,
    onSchedule
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Schedule Technical Interview"
        >
            <div className="space-y-5">
                <div className="space-y-0 overflow-visible">
                    <Select 
                        label="Select Interviewer"
                        value={interviewData.interviewerId}
                        options={interviewers.map(i => ({ id: i.id, label: i.name }))}
                        onSelect={id => setInterviewData({ ...interviewData, interviewerId: id })}
                        placeholder="Choose expert..."
                        icon={Users}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label htmlFor="interview-date" className="block text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Interview Date</label>
                        <input
                            id="interview-date"
                            type="date"
                            min={new Date().toLocaleDateString('en-CA')} // YYYY-MM-DD local
                            value={interviewData.date}
                            onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="interview-time" className="block text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Start Time</label>
                        <input
                            id="interview-time"
                            type="time"
                            value={interviewData.time}
                            onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={() => {
                            if (!interviewData.interviewerId || !interviewData.date || !interviewData.time) {
                                return alert('Please complete all scheduling fields.');
                            }
                            onSchedule();
                        }}
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-[#ff6e00] hover:bg-[#e05d00] border-none shadow-xl shadow-orange-500/20"
                    >
                        <Calendar className="w-4 h-4" />
                        <span>Confirm Schedule</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default InterviewScheduleModal;
