import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react';

const JobCard = ({ job }) => {
    return (
        <div className="group relative overflow-hidden rounded-[2rem] bg-slate-800/40 border border-white/5 p-8 transition-all duration-500 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 active:scale-[0.98]">
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-10 pointer-events-none"></div>

            <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-[#ff6e00]">
                        <Briefcase size={24} />
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        Available
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff6e00] transition-colors">
                    {job.title}
                </h3>

                <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {job.description}
                </p>

                <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-slate-600" />
                            <span>Pune, India</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-slate-600" />
                            <span>Full Time</span>
                        </div>
                    </div>

                    <Link
                        to={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-2 text-sm font-black text-white hover:text-[#ff6e00] transition-colors group/link"
                    >
                        VIEW DETAILS
                        <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
