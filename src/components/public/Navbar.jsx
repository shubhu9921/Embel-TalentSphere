import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find Jobs', path: '/jobs' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-6 bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg group-hover:scale-110 transition-transform">
                        <img src="https://www.embel.co.in/images/logos/logo-embel.png" alt="Embel" className="h-full w-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl text-white tracking-tighter leading-none">EMBEL</span>
                        <span className="text-[10px] font-black text-[#ff6e00] uppercase tracking-widest mt-0.5">Recruit</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) => `
                                text-sm font-bold uppercase tracking-widest transition-all
                                ${isActive ? 'text-[#ff6e00]' : 'text-slate-300 hover:text-white'}
                            `}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* CTA Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/login" className="text-sm font-bold text-white hover:text-[#ff6e00] transition-colors">
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="px-6 py-3 rounded-xl bg-[#ff6e00] text-white text-sm font-black uppercase tracking-widest hover:bg-[#e05d00] transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center gap-2"
                    >
                        Apply Now
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden fixed inset-0 bg-slate-900 z-40 transition-transform duration-500 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-2xl font-black text-white hover:text-[#ff6e00] transition-colors uppercase tracking-[0.2em]"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-4 px-10 py-5 rounded-2xl bg-[#ff6e00] text-white font-black uppercase tracking-widest shadow-2xl shadow-orange-500/40"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
