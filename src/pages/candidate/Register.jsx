import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, BookOpen, Briefcase, FileText, QrCode, ArrowRight, CheckCircle2, ShieldCheck, Calendar, GraduationCap, Award, AlertCircle, History, Clock, ChevronRight, Lock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import apiService from '../../services/apiService';

const Register = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            activeBacklogs: 'no',
            experienceType: 'fresher'
        }
    });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [candidateData, setCandidateData] = useState(null);
    const [vacancies, setVacancies] = useState([]);

    const preSelectedPosition = searchParams.get('position');
    const expType = watch('experienceType');
    const hasBacklogs = watch('activeBacklogs');

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const data = await apiService.get('/vacancies');
                const activeVacancies = data.filter(v => v.isOpen);
                setVacancies(activeVacancies);

                if (preSelectedPosition) {
                    const exists = activeVacancies.find(v => v.id === preSelectedPosition);
                    if (exists) {
                        setValue('position', preSelectedPosition);
                    }
                }
            } catch (error) {
                console.error('Error fetching vacancies:', error);
            }
        };
        fetchVacancies();
    }, [preSelectedPosition, setValue]);

    const resumeFile = watch('resume');
    const resumeFileName = resumeFile?.[0]?.name;

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            // Remove the FileList object before sending to json-server
            // to avoid serialization issues
            const { resume, ...rest } = data;
            const newCandidate = {
                ...rest,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                status: 'registered',
                assignedQuestions: [],
                examScore: null,
                resumeName: resumeFileName || 'Not uploaded'
            };
            await apiService.post('/candidates', newCandidate);
            setCandidateData(newCandidate);
            setStep(3);
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Failed to save registration data.');
        } finally {
            setSubmitting(false);
        }
    };

    const getGoogleFormUrl = () => {
        if (!candidateData) return '#';
        const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfD_XU-pG-XXXXX/viewform";
        const params = new URLSearchParams({
            "entry.123456789": candidateData.name,
            "entry.987654321": candidateData.email,
            "entry.112233445": candidateData.position
        });
        return `${baseUrl}?${params.toString()}`;
    };

    const nextStep = () => setStep(2);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#002D5E] to-[#112240] p-4 font-sans selection:bg-orange-500/30 selection:text-white relative overflow-hidden">
            {/* Massive decorative blurs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="w-full max-w-4xl relative z-10 py-12">
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <img
                        src="https://www.embel.co.in/images/logos/logo-embel.png"
                        alt="Embel Logo"
                        className="h-12 mx-auto mb-6 object-contain drop-shadow-sm"
                    />
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                        {step === 1 ? 'TalentSphere Portal' : step === 2 ? 'Registration Form' : 'Success!'}
                    </h1>
                    <p className="text-slate-400 font-medium mt-2 text-lg">
                        {step === 1 ? (preSelectedPosition ? `Applying for ${vacancies.find(v => v.id === preSelectedPosition)?.title || 'Position'}` : 'Scan to verify and continue on your mobile') : 'Provide your comprehensive details to start the assessment'}
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-700">
                    {step === 1 ? (
                        <div className="p-16 text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex justify-center">
                                <div className="p-10 bg-slate-50 rounded-[4.5rem] shadow-inner ring-[16px] ring-slate-100/50 relative group transition-all">
                                    <QRCodeSVG
                                        value={window.location.href}
                                        size={220}
                                        fgColor="#ff6e00"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[4.5rem]">
                                        <div className="w-14 h-14 bg-[#ff6e00] rounded-2xl flex items-center justify-center text-white shadow-xl">
                                            <QrCode className="w-7 h-7 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={nextStep} className="w-full max-w-sm mx-auto py-5 text-lg font-black rounded-2xl shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 bg-[#ff6e00] hover:bg-[#e05d00] text-white border-none uppercase tracking-widest transition-all active:scale-95 group">
                                Start Application
                                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    ) : step === 2 ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="p-12 space-y-10 animate-in slide-in-from-right-8 fade-in duration-500">
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-[#ff6e00] uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('name', { required: 'Name is mandatory' })} placeholder="John Doe" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                        {errors.name && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input type="email" {...register('email', { required: 'Email is mandatory' })} placeholder="john@example.com" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                        {errors.email && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{errors.email.message}</p>}
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('phone', { required: 'Phone is mandatory' })} placeholder="+91 00000 00000" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input type="date" {...register('dob', { required: 'DOB is mandatory' })} max={new Date().toISOString().split('T')[0]} className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Password</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="••••••••" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                        {errors.password && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{errors.password.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-[#ff6e00] uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Academic Background</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">College Name</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <BookOpen className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('college', { required: 'College is mandatory' })} placeholder="Oxford Institute" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Degree</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <GraduationCap className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('education', { required: 'Degree is mandatory' })} placeholder="B.E. Computer Science" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Passing Year</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <History className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input placeholder="2024" {...register('passingYear', { required: 'Year is mandatory' })} className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Final CGPA / %</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Award className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('cgpa', { required: 'CGPA is mandatory' })} placeholder="8.5 or 85%" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Active Backlogs?</label>
                                        <select {...register('activeBacklogs')} className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold appearance-none tracking-widest">
                                            <option value="no">No, I'm clear</option>
                                            <option value="yes">Yes, have active</option>
                                        </select>
                                    </div>
                                    {hasBacklogs === 'yes' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 group">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Count</label>
                                            <div className="relative group/field">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <AlertCircle className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                                </div>
                                                <input type="number" {...register('backlogCount')} placeholder="0" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-[#ff6e00] uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Professional Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Experience Type</label>
                                        <select {...register('experienceType')} className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold appearance-none tracking-widest">
                                            <option value="fresher">Fresher / Student</option>
                                            <option value="experienced">Experienced Professional</option>
                                        </select>
                                    </div>
                                    {expType === 'experienced' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 group">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Total Experience</label>
                                            <div className="relative group/field">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Clock className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                                </div>
                                                <input {...register('yearsOfExperience')} placeholder="e.g. 2.5 Years" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-span-1 md:col-span-2 space-y-2 group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Position</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Briefcase className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <select {...register('position', { required: 'Required' })} disabled={!!preSelectedPosition} className="block w-full pl-11 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold appearance-none disabled:opacity-50">
                                                <option value="">Select role...</option>
                                                {vacancies.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">CV / Resume (PDF Only)</label>
                                <div className="relative group cursor-pointer">
                                    <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" {...register('resume', { required: 'CV is mandatory' })} />
                                    <div className={`p-10 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center gap-4 text-center group ${resumeFileName ? 'border-[#ff6e00]/50 bg-orange-50' : 'border-slate-100 bg-slate-50 hover:bg-orange-50 hover:border-[#ff6e00]/50'}`}>
                                        <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center transition-colors shadow-sm ${resumeFileName ? 'text-[#ff6e00]' : 'text-slate-300 group-hover:text-[#ff6e00]'}`}>
                                            <FileText size={32} />
                                        </div>
                                        <div>
                                            <p className="text-slate-600 font-bold">{resumeFileName || 'Click or drag to upload'}</p>
                                            {resumeFileName && <p className="text-[10px] font-black text-[#ff6e00] uppercase tracking-widest mt-1">File selected</p>}
                                        </div>
                                    </div>
                                </div>
                                {errors.resume && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{errors.resume.message}</p>}
                            </div>

                            <button type="submit" disabled={submitting} className="w-full py-5 text-lg font-black rounded-2xl shadow-2xl shadow-orange-500/25 bg-[#ff6e00] hover:bg-[#e05d00] text-white border-none uppercase tracking-[0.15em] transition-all active:scale-[0.98]">
                                {submitting ? 'Creating Profile...' : 'Submit Application'}
                            </button>
                        </form>
                    ) : (
                        <div className="p-16 text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
                            <div className="space-y-4">
                                <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mx-auto shadow-xl shadow-emerald-500/5">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Application <span className="text-[#ff6e00]">Submitted!</span></h2>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto font-black uppercase tracking-wider text-xs">Thank you for the application. Our HR team will connect with you as soon as possible.</p>
                            </div>

                            <div className="flex justify-center">
                                <div className="p-8 bg-slate-50 rounded-[3rem] shadow-inner ring-4 ring-slate-100 relative group transition-all">
                                    <QRCodeSVG
                                        value={getGoogleFormUrl()}
                                        size={200}
                                        fgColor="#ff6e00"
                                    />
                                    <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                                        <div className="bg-[#19325c] px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                                            Registration Link
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate ID</p>
                                        <p className="text-slate-900 font-bold truncate">#{candidateData?.id}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Role</p>
                                        <p className="text-[#ff6e00] font-bold uppercase truncate">{candidateData?.position}</p>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/')} className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                    Back to Home <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-12 flex items-center justify-center gap-3">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-10 bg-[#ff6e00]' : 'w-4 bg-white/10'}`}></div>
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-10 bg-[#ff6e00]' : 'w-4 bg-white/10'}`}></div>
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 3 ? 'w-10 bg-[#ff6e00]' : 'w-4 bg-white/10'}`}></div>
                </div>
            </div>
        </div>
    );
};

export default Register;
