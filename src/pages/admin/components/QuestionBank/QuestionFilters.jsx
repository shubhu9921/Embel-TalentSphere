import React from 'react';
import { Filter, ChevronDown, CheckSquare, Square } from 'lucide-react';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import Dropdown from '../../../../components/Dropdown';

const QuestionFilters = ({
    selectedPosition,
    setSelectedPosition,
    vacancies,
    onBulkSelect,
    stats: { active = 0, inactive = 0 } = {}
}) => {
    const trigger = (
        <div className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold flex items-center justify-between focus:outline-none focus:border-[#ff6e00] transition-all cursor-pointer group hover:bg-white shadow-elevation-high">
            <span className="group-hover:text-[#ff6e00] transition-colors truncate pr-4">
                {selectedPosition === 'all' ? 'All Vacancies' : (vacancies.find(v => v.id === selectedPosition)?.title || 'All Vacancies')}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#ff6e00] transition-transform duration-300" />
        </div>
    );

    return (
        <Card className="lg:col-span-3 border-none p-0 overflow-visible" noPadding>
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 overflow-visible">
                <div className="flex-1 p-6 md:pb-6 overflow-visible">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Filter by Vacancy</p>
                    <div className="relative w-full md:max-w-xs">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                        
                        <Dropdown 
                            trigger={trigger} 
                            className="w-full"
                            contentClassName="w-full min-w-[300px] bg-white rounded-2xl shadow-2xl border border-slate-100 mt-2 z-50 overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-hide">
                                <div 
                                    onClick={() => setSelectedPosition('all')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${selectedPosition === 'all' ? 'bg-[#ff6e00] text-white shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-orange-50 hover:text-[#ff6e00]'}`}
                                >
                                    <span className="text-sm font-bold">All Vacancies</span>
                                </div>
                                {vacancies.map(v => (
                                    <div 
                                        key={v.id}
                                        onClick={() => setSelectedPosition(v.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${selectedPosition === v.id ? 'bg-[#ff6e00] text-white shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-orange-50 hover:text-[#ff6e00]'}`}
                                    >
                                        <span className="text-sm font-bold">{v.title}</span>
                                    </div>
                                ))}
                            </div>
                        </Dropdown>
                    </div>
                    <div className="flex items-center gap-4 mt-3 ml-2">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10"></div>
                            <span>{active} Active</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                            <span>{inactive} Inactive</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-6 md:pt-6 bg-slate-50/50 md:bg-transparent border-t md:border-none border-slate-100">
                    <Button
                        onClick={(e) => { e.stopPropagation(); onBulkSelect(true); }}
                        variant="secondary"
                        size="sm"
                        icon={CheckSquare}
                        className="flex-1 md:flex-none shadow-orange-glow"
                    >
                        Activate All
                    </Button>
                    <Button
                        onClick={(e) => { e.stopPropagation(); onBulkSelect(false); }}
                        variant="outline"
                        size="sm"
                        icon={Square}
                        className="flex-1 md:flex-none text-slate-400 bg-white"
                    >
                        Deactivate All
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default QuestionFilters;
