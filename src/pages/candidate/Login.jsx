import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import ApiService from '../../services/ApiService';
import { formatUserName } from '../../utils/formatters';
import Button from '../../components/Button';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        setSubmitting(true);
        setLoginError('');
        try {
            const authResult = await ApiService.login(data.email, data.password);

            if (!authResult) {
                setLoginError('Invalid email or password.');
                return;
            }

            const { user, type } = authResult;

            if (type === 'staff') {
                // Update online status
                await ApiService.updateAdminUser(user.id, { ...user, lastLogin: new Date().toISOString() });

                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('userRole', user.role);
                sessionStorage.setItem('userId', user.id);
                sessionStorage.setItem('userName', formatUserName(user));
                sessionStorage.setItem('userEmail', user.email);
                localStorage.setItem('admin_user', JSON.stringify(user));

                // Route based on role
                switch (user.role) {
                    case 'superadmin':
                    case 'admin':
                    case 'hr': navigate('/admin'); break;
                    case 'interviewer': navigate('/interviewer'); break;
                    default: setLoginError('Unknown staff role assigned.');
                }
                return;
            }

            if (type === 'candidate') {
                if (user.status === 'applied' || user.examScore !== null) {
                    setLoginError('You have already submitted this assessment. Dual attempts are not permitted.');
                    return;
                }
                localStorage.setItem('candidate', JSON.stringify(user));
                navigate('/exam-instructions');
                return;
            }

            setLoginError('Unknown account type.');

        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Server connection error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#002D5E] to-[#112240] p-4 font-sans selection:bg-orange-500/30 selection:text-white relative overflow-hidden">
            {/* Massive decorative blurs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none"></div>

            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-white/10 relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <img
                        src="https://www.embel.co.in/images/logos/logo-embel.png"
                        alt="Embel Logo"
                        className="h-12 mx-auto mb-6 object-contain drop-shadow-sm"
                    />
                    <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Embel Portal</h2>
                    <p className="text-slate-500 font-medium text-sm">Universal access for Candidates</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {loginError && (
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-wider flex items-center gap-2 animate-in shake duration-300">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {loginError}
                        </div>
                    )}

                    <div className="space-y-2 group">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group/field">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                            </div>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner"
                                placeholder="name@email.com"
                            />
                        </div>
                        {errors.email && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2 group">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                            <a href="#" className="text-xs font-black text-[#ff6e00] hover:text-[#e05d00] uppercase tracking-wider transition-colors">Forgot Password?</a>
                        </div>
                        <div className="relative group/field">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register('password', { required: 'Password is required' })}
                                className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner"
                                placeholder="••••••••"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                icon={showPassword ? EyeOff : Eye}
                                className="absolute inset-y-0 right-0 h-full pr-4 text-slate-300 hover:text-slate-500 bg-transparent border-none"
                            />
                        </div>
                        {errors.password && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{errors.password.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        variant="secondary"
                        size="lg"
                        loading={submitting}
                        icon={ArrowRight}
                        className="w-full shadow-2xl shadow-orange-500/30"
                    >
                        SIGN IN
                    </Button>
                </form>

                <div className="mt-10 text-center text-xs font-bold text-slate-400">
                    Applying for a role? <Link to="/register" className="text-[#ff6e00] hover:text-[#e05d00] underline-offset-4 hover:underline decoration-2 transition-all">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
