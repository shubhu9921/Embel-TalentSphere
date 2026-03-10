import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle2, Globe, Shield, Zap, Play } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import JobCard from '../../components/public/JobCard';
import apiService from '../../services/apiService';

const LandingPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await apiService.get('/vacancies');
                setJobs(response.filter(j => j.isOpen).slice(0, 3));
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-[#002D5E] font-sans selection:bg-[#ff6e00]/30 selection:text-white overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ff6e00]/10 rounded-full blur-[120px] animate-float"></div>
                    <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-up">
                        <Star size={12} className="text-[#ff6e00]" />
                        Join the future of Embel Tech
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
                        BUILD THE <br />
                        <span className="text-[#ff6e00]">NEXT GEN</span> OF <br />
                        EXCELLENCE
                    </h1>

                    <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl font-medium mb-12 animate-fade-up leading-relaxed" style={{ animationDelay: '200ms' }}>
                        We're searching for visionaries, engineers, and creatives to help us reshape the landscape of digital innovation. Your next career milestone starts here.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
                        <Link
                            to="/jobs"
                            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#ff6e00] text-white font-black uppercase tracking-widest hover:bg-[#e05d00] transition-all shadow-2xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-3"
                        >
                            Explore Openings
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/about"
                            className="hidden sm:flex px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all items-center justify-center"
                        >
                            Our Culture
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            <section className="py-24 px-6 bg-slate-900/40 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
                                Featured <span className="text-[#ff6e00]">Opportunities</span>
                            </h2>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                Explore our most critical roles and join a team that values your growth as much as your output.
                            </p>
                        </div>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 text-sm font-black text-[#ff6e00] hover:text-[#e05d00] transition-colors uppercase tracking-widest"
                        >
                            View All Jobs <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-64 rounded-[2rem] bg-white/5 animate-pulse"></div>
                            ))
                        ) : (
                            jobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Features/Stats */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#ff6e00]/10 flex items-center justify-center text-[#ff6e00] mx-auto md:mx-0">
                            <Zap size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">Fast Growth</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Join one of the fastest growing tech companies in the region.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto md:mx-0">
                            <Globe size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">Global Reach</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Work on products used by thousands across different continents.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto md:mx-0">
                            <CheckCircle2 size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">Top Benefits</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Competitive salary, health insurance, and flexible work life.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mx-auto md:mx-0">
                            <Shield size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">Secure Career</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            We value stability and long-term commitment to our team members.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 bg-slate-900/60">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-3">
                        <img src="https://www.embel.co.in/images/logos/logo-embel.png" alt="Embel" className="h-10 object-contain grayscale brightness-200 opacity-50" />
                        <div className="flex flex-col">
                            <span className="font-black text-slate-500 tracking-tight leading-none uppercase">EMBEL</span>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">© 2026 EMBEL TECH</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-[#ff6e00] transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
