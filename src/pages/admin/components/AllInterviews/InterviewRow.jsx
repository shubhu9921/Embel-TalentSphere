import React from 'react';
import { Clock, User, MoreVertical } from 'lucide-react';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';

const InterviewRow = ({ interview }) => {
    return (
        <Card className="p-6 border-none ring-1 ring-slate-100 flex items-center justify-between group">
            <div className="flex items-center gap-8">
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100 min-w-17.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {!isNaN(new Date(interview.date)) ? new Date(interview.date).toLocaleDateString('en-US', { month: 'short' }) : '---'}
                    </span>
                    <span className="text-xl font-black text-slate-900 leading-none mt-1">
                        {!isNaN(new Date(interview.date)) ? new Date(interview.date).getDate() : '--'}
                    </span>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-[#19325c]">{interview.candidate?.name || 'Unknown Candidate'}</h3>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                        <span className="text-xs font-bold text-slate-500">{interview.candidate?.position || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{interview.time || 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <User className="w-3.5 h-3.5" />
                            <span>Interviewer: <span className="text-slate-600 font-bold">{interview.interviewer?.name || 'Not assigned'}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${interview.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'
                    }`}>
                    {interview.status || 'pending'}
                </div>
                <Button 
                    variant="ghost"
                    size="md"
                    icon={MoreVertical}
                    className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all border-none bg-transparent"
                    aria-label="More options"
                />
            </div>
        </Card>
    );
};

export default InterviewRow;
