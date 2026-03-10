import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import apiService from '../../services/apiService';
import { formatUserName } from '../../utils/formatters';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const users = await apiService.getUsers();
            const user = users.find(u => (u.email === email || u.username === email) && u.password === password);

            if (user) {
                // Update online status in db.json if exists or needed
                await apiService.updateAdminUser(user.id, { ...user, lastLogin: new Date().toISOString() });

                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('userRole', user.role);
                sessionStorage.setItem('userId', user.id);
                sessionStorage.setItem('userName', formatUserName(user));
                sessionStorage.setItem('userEmail', user.email);
                localStorage.setItem('admin_user', JSON.stringify(user));

                // Role-based navigation
                switch (user.role) {
                    case 'superadmin': navigate('/admin'); break;
                    case 'interviewer': navigate('/interviewer'); break;
                    case 'hr': navigate('/hr'); break;
                    default: navigate('/login-admin');
                }
            } else {
                setError('Invalid Credentials');
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError('Server Not Running. Please start the mock server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#002D5E] to-[#112240] p-4 font-sans selection:bg-orange-500/30 selection:text-white">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-white/10 relative overflow-hidden animate-in fade-in zoom-in duration-700">

                {/* Decorative background blur within the card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10 transition-all duration-500">
                    <img
                        src="https://www.embel.co.in/images/logos/logo-embel.png"
                        alt="Embel Logo"
                        className="h-12 mx-auto mb-6 object-contain drop-shadow-sm"
                    />
                    <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">System Portal</h2>
                    <p className="text-slate-500 font-medium">Please sign in to your role dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2 group">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
                        <div className="relative group/field">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner"
                                placeholder="name@embel.co.in"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                            <a href="#" className="text-xs font-black text-[#ff6e00] hover:text-[#e05d00] uppercase tracking-wider transition-colors">Forgot?</a>
                        </div>
                        <div className="relative group/field">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-wider flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-2xl shadow-orange-500/25 text-sm font-black text-white bg-[#ff6e00] hover:bg-[#e05d00] focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] group/btn"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <span className="flex items-center gap-2">
                                SIGN IN <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center text-xs font-bold text-slate-400 relative z-10">
                    Need technical assistance? <a href="#" className="text-[#ff6e00] hover:text-[#e05d00] underline-offset-4 hover:underline decoration-2 transition-all">Support Desk</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
