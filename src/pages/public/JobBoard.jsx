import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ArrowRight, Clock } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import JobCard from '../../components/public/JobCard';
import apiService from '../../services/apiService';

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await apiService.get('/vacancies');
                setJobs(response.filter(j => j.isOpen));
                setFilteredJobs(response.filter(j => j.isOpen));
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const filtered = jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || job.department === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        setFilteredJobs(filtered);
    }, [searchQuery, selectedCategory, jobs]);

    const categories = ['All', ...new Set(jobs.map(j => j.department).filter(Boolean))];

    return (
        <div className="min-h-screen bg-[#002D5E] font-sans selection:bg-[#ff6e00]/30 overflow-x-hidden">
            <Navbar />

            {/* Header / Search Section */}
            <section className="pt-32 pb-16 px-6 bg-slate-900/60 border-b border-white/5 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#ff6e00]/5 rounded-full blur-[100px]"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 animate-fade-up">
                        Find Your <span className="text-[#ff6e00]">Dream Career</span>
                    </h1>

                    <div className="flex flex-col md:flex-row gap-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ff6e00] transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search by job title or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-16 pl-12 pr-6 rounded-2xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all"
                            />
                        </div>
                        <div className="md:w-64 relative group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ff6e00] transition-colors" size={20} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full h-16 pl-12 pr-6 rounded-2xl bg-white/5 border border-white/10 text-white font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Showing <span className="text-white">{filteredJobs.length}</span> Results
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-72 rounded-[2rem] bg-white/5 animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredJobs.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredJobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center animate-fade-up">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-600 mx-auto mb-6">
                                <Search size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase mb-2">No jobs matched your search</h3>
                            <p className="text-slate-500 font-medium lowercase">Try adjusting your filters or search terms</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="mt-8 text-[#ff6e00] font-black uppercase tracking-widest text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter/Contact Section Alternative */}
            <section className="py-24 px-6 border-t border-white/5 bg-slate-900/40">
                <div className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center glass-dark">
                    <div className="absolute top-0 left-0 w-full h-full shimmer opacity-5 pointer-events-none"></div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
                        Don't see the <span className="text-[#ff6e00]">Right Role?</span>
                    </h2>
                    <p className="text-slate-300 text-lg font-medium mb-10 max-w-2xl mx-auto">
                        Drop your CV in our general talent pool and we'll reach out when a perfect match appears.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl active:scale-95"
                    >
                        General Application
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Simple Footer Copy */}
            <footer className="py-10 text-center border-t border-white/5 bg-slate-900/60">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    EMBEL RECRUIT © 2026 • Powering World-Class Teams
                </p>
            </footer>
        </div>
    );
};

export default JobBoard;
