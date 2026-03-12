import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, BookOpen, Briefcase, FileText, QrCode, ArrowRight, CheckCircle2, Calendar, GraduationCap, Award, AlertCircle, History, Clock, ChevronRight, ChevronDown, Lock, MapPin, Eye, EyeOff } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ApiService from '../../services/ApiService';
import { geoData } from '../../utils/geoData';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Autocomplete from '../../components/Autocomplete';

const Register = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            activeBacklogs: 'no',
            experienceType: 'fresher',
            country: 'India',
            state: '',
            city: '',
            position: ''
        }
    });

    // Register custom fields manually
    useEffect(() => {
        register('country', { required: 'Country is required' });
        register('state', { required: 'State is required' });
        register('city', { required: 'City is required' });
        register('position', { required: 'Target Position is required' });
    }, [register]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [candidateData, setCandidateData] = useState(null);
    const [vacancies, setVacancies] = useState([]);

    const watchCountry = watch('country');
    const watchState = watch('state');
    const watchCity = watch('city');

    const allCountries = geoData.map(c => c.country);

    const statesForCountry = geoData.find(c => c.country.toLowerCase() === watchCountry?.toLowerCase())?.states || [];
    const filteredStates = statesForCountry;

    const citiesForState = statesForCountry.find(s => s.name.toLowerCase() === watchState?.toLowerCase())?.cities || [];
    const filteredCities = citiesForState;

    const preSelectedPosition = searchParams.get('position');
    const expType = watch('experienceType');
    const hasBacklogs = watch('activeBacklogs');
    const watchPosition = watch('position');

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const data = await ApiService.get('/vacancies');
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
            const { resume, ...rest } = data;
            let resumeData = '';

            if (resume?.[0]) {
                resumeData = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(resume[0]);
                });
            }

            const newCandidate = {
                ...rest,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                status: 'registered',
                assignedQuestions: [],
                examScore: null,
                resumeName: resumeFileName || 'Not uploaded',
                resumeData: resumeData
            };
            await ApiService.post('/candidates', newCandidate);
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
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#002D5E] to-[#112240] p-4 font-sans selection:bg-orange-500/30 selection:text-white relative overflow-hidden">
            {/* Massive decorative blurs */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-orange-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="w-full max-w-4xl relative z-10 py-12">
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <img
                        src="https://www.embel.co.in/images/logos/logo-embel.png"
                        alt="Embel Logo"
                        className="h-12 mx-auto mb-6 object-contain drop-shadow-sm"
                    />
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                        {step === 1 ? 'Talentry Portal' : step === 2 ? 'Registration Form' : 'Success!'}
                    </h1>
                    <p className="text-slate-400 font-medium mt-2 text-lg">
                        {step === 1 ? (preSelectedPosition ? `Applying for ${vacancies.find(v => v.id === preSelectedPosition)?.title || 'Position'}` : 'Scan to verify and continue on your mobile') : 'Provide your comprehensive details to start the assessment'}
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-700">
                    {step === 1 ? (
                        <div className="p-16 text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex justify-center">
                                <div className="p-10 bg-slate-50 rounded-[4.5rem] shadow-inner ring-16 ring-slate-100/50 relative group transition-all">
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
                            <Button 
                                onClick={nextStep} 
                                variant="secondary"
                                size="lg"
                                icon={ArrowRight}
                                className="w-full max-w-sm mx-auto shadow-2xl shadow-orange-500/30"
                            >
                                Start Application
                            </Button>
                        </div>
                    ) : step === 2 ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="p-12 space-y-10 animate-in slide-in-from-right-8 fade-in duration-500">
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-[#ff6e00] uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('name', { required: 'Name is mandatory' })} placeholder="John Doe" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                        {errors.name && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input type="email" {...register('email', { required: 'Email is mandatory' })} placeholder="john@example.com" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                        {errors.email && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{errors.email.message}</p>}
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('phone', { required: 'Phone is mandatory', pattern: { value: /^\d{10}$/, message: 'Must be exactly 10 digits' } })} placeholder="0000000000" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                        {errors.phone && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{errors.phone.message}</p>}
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Date of Birth</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input type="date" {...register('dob', { required: 'DOB is mandatory' })} max={new Date().toISOString().split('T')[0]} className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Account Password</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input type={showPassword ? "text" : "password"} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="••••••••" className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
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
                                    <div className="space-y-0 relative z-[60]">
                                        <Autocomplete
                                            label="Country"
                                            value={watchCountry}
                                            options={allCountries}
                                            onChange={(val) => {
                                                setValue('country', val, { shouldValidate: true });
                                                // Clear dependents if the input doesn't exactly match a valid country
                                                if (!geoData.some(c => c.country.toLowerCase() === val.toLowerCase())) {
                                                    setValue('state', '');
                                                    setValue('city', '');
                                                }
                                            }}
                                            onSelect={(val) => {
                                                setValue('country', val, { shouldValidate: true });
                                                setValue('state', '');
                                                setValue('city', '');
                                            }}
                                            placeholder="Search Country..."
                                            icon={MapPin}
                                            error={errors.country?.message}
                                            required
                                            strict={true}
                                        />
                                    </div>
                                    <div className="space-y-0 relative z-[50]">
                                        <Autocomplete
                                            label="State"
                                            value={watchState}
                                            options={filteredStates.map(s => s.name)}
                                            onChange={(val) => {
                                                setValue('state', val, { shouldValidate: true });
                                                // Clear city if state is not a valid match
                                                if (!filteredStates.some(s => s.name.toLowerCase() === val.toLowerCase())) {
                                                    setValue('city', '');
                                                }
                                            }}
                                            onSelect={(val) => {
                                                setValue('state', val, { shouldValidate: true });
                                                setValue('city', '');
                                            }}
                                            placeholder={watchCountry ? "Search State..." : "Select Country First"}
                                            icon={MapPin}
                                            error={errors.state?.message}
                                            required
                                            disabled={!watchCountry}
                                            strict={true}
                                        />
                                    </div>
                                    <div className="space-y-0 relative z-[40]">
                                        <Autocomplete
                                            label="City"
                                            value={watchCity}
                                            options={filteredCities}
                                            onChange={(val) => setValue('city', val, { shouldValidate: true })}
                                            onSelect={(val) => setValue('city', val, { shouldValidate: true })}
                                            placeholder={watchState ? "Search City..." : "Select State First"}
                                            icon={MapPin}
                                            error={errors.city?.message}
                                            required
                                            disabled={!watchState}
                                            strict={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-[#ff6e00] uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Academic Background</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">College Name</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <BookOpen className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('college', { required: 'College is mandatory' })} placeholder="Oxford Institute" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Degree</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <GraduationCap className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('education', { required: 'Degree is mandatory' })} placeholder="B.E. Computer Science" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Passing Year</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <History className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input placeholder="2024" {...register('passingYear', { required: 'Year is mandatory' })} className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Final CGPA / %</label>
                                        <div className="relative group/field">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Award className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                            </div>
                                            <input {...register('cgpa', { required: 'CGPA is mandatory' })} placeholder="8.5 or 85%" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                        </div>
                                    </div>
                                    {expType !== 'experienced' && (
                                    <div className="space-y-2 group w-full flex flex-col relative z-50">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Active Backlogs?</label>
                                        <div className="dropdown w-full">
                                            <input type="hidden" {...register('activeBacklogs')} />
                                            <div tabIndex={0} role="button" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold tracking-widest cursor-pointer">
                                                <span className="text-slate-900">{hasBacklogs === 'yes' ? 'Yes, have active' : "No, I'm clear"}</span>
                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <ul tabIndex={0} className="dropdown-content menu bg-white rounded-2xl z-100 w-full p-2 shadow-elevation-high border border-slate-100 mt-2">
                                                <li><a onClick={() => { setValue('activeBacklogs', 'no'); document.activeElement?.blur(); }} className={hasBacklogs === 'no' ? 'active' : ''}>No, I'm clear</a></li>
                                                <li><a onClick={() => { setValue('activeBacklogs', 'yes'); document.activeElement?.blur(); }} className={hasBacklogs === 'yes' ? 'active' : ''}>Yes, have active</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    )}
                                    {hasBacklogs === 'yes' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 group">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Count</label>
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

                                {/* Experience Type + Total Experience in 2-col grid */}
                                    <div className="space-y-0 relative z-[10]">
                                        <Select 
                                            label="Experience Type"
                                            value={expType}
                                            options={[
                                                { id: 'fresher', label: 'Fresher / Student' },
                                                { id: 'experienced', label: 'Experienced Professional' }
                                            ]}
                                            onSelect={(val) => setValue('experienceType', val)}
                                            placeholder="Select Type..."
                                            error={errors.experienceType?.message}
                                            required
                                        />
                                    </div>
                                    {expType === 'experienced' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 group">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Total Experience</label>
                                            <div className="relative group/field">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Clock className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                                                </div>
                                                <input {...register('yearsOfExperience')} placeholder="e.g. 2.5 Years" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                                            </div>
                                        </div>
                                    )}

                                {/* Target Position — React-controlled dropdown, not DaisyUI CSS-based */}
                                <div className="space-y-0 relative z-[5]">
                                    <Select 
                                        label="Target Position"
                                        value={watchPosition}
                                        options={vacancies.map(v => ({ id: v.id, label: v.title }))}
                                        onSelect={(val) => {
                                            if (!preSelectedPosition) setValue('position', val, { shouldValidate: true });
                                        }}
                                        placeholder="Select role..."
                                        icon={Briefcase}
                                        error={errors.position?.message}
                                        required
                                        disabled={!!preSelectedPosition}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">CV / Resume (PDF Only)</label>
                                <div className="relative group cursor-pointer">
                                    <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" {...register('resume', { required: 'CV is mandatory' })} />
                                    <div className={`p-10 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center gap-4 text-center group ${resumeFileName ? 'border-[#ff6e00]/50 bg-orange-50' : 'border-slate-100 bg-slate-50 hover:border-[#ff6e00]/50'}`}>
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

                            <Button 
                                type="submit" 
                                variant="secondary"
                                size="lg"
                                loading={submitting}
                                className="w-full shadow-2xl shadow-orange-500/30"
                            >
                                Submit Application
                            </Button>
                        </form>
                    ) : (
                        <div className="p-16 text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
                            <div className="space-y-4">
                                <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mx-auto shadow-xl shadow-emerald-500/5">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black text-[#19325c] uppercase tracking-tight">Application <span className="text-[#ff6e00]">Submitted!</span></h2>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto tracking-wide text-sm">Thank you for applying! HR will connect with you as soon as possible.</p>
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

                                <Button 
                                    onClick={() => navigate('/')} 
                                    variant="primary"
                                    size="lg"
                                    icon={ChevronRight}
                                    className="w-full shadow-xl"
                                >
                                    Back to Home
                                </Button>
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
