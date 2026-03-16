import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, BookOpen, Briefcase, FileText, QrCode, ArrowRight, CheckCircle2, Calendar, GraduationCap, Award, AlertCircle, History, Clock, ChevronRight, ChevronDown, Lock, MapPin, Eye, EyeOff, Banknote } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ApiService from '../../services/ApiService';
import { geoData } from '../../utils/geoData';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Autocomplete from '../../components/Autocomplete';

const Step1View = ({ onNext }) => (
    <div className="p-16 text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center">
            <div className="p-10 bg-slate-50 rounded-[4.5rem] shadow-inner ring-16 ring-slate-100/50 relative group transition-all">
                <QRCodeSVG
                    value={globalThis.location ? globalThis.location.href : '#'}
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
            onClick={onNext}
            variant="secondary"
            size="lg"
            icon={ArrowRight}
            className="w-full max-w-sm mx-auto shadow-2xl shadow-orange-500/30"
        >
            Start Application
        </Button>
    </div>
);

const SectionHeader = ({ title }) => (
    <h3 className="text-[10px] font-black text-[#ff6e00] uppercase tracking-[0.2em] border-b border-slate-100 pb-4">
        {title}
    </h3>
);

const FormField = ({ label, icon: Icon, error, children, required }) => {
    const id = React.useId();
    return (
        <div className="space-y-2 group">
            {label && (
                <label htmlFor={id} className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">
                    {label}{required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative group/field">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                    </div>
                )}
                {React.cloneElement(children, { 
                    id, 
                    className: `${children.props.className || ''} ${Icon ? 'pl-11' : 'pl-4'}` 
                })}
            </div>
            {error && <p className="text-[10px] font-bold text-red-400 px-1 mt-1 uppercase tracking-wider">{error}</p>}
        </div>
    );
};


const SuccessView = ({ candidateData, navigate }) => {
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

    return (
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
    );
};

const PersonalInformationSection = ({ register, errors, watchCountry, watchState, watchCity, allCountries, statesForCountry, citiesForState, setValue, showPassword, setShowPassword }) => (
    <div className="space-y-8">
        <SectionHeader title="Personal Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField label="Full Name" icon={User} error={errors.name?.message} required>
                <input {...register('name', { required: 'Name is mandatory' })} placeholder="John Doe" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
            </FormField>
            <FormField label="Email Address" icon={Mail} error={errors.email?.message} required>
                <input type="email" {...register('email', { required: 'Email is mandatory' })} placeholder="john@example.com" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
            </FormField>
            <FormField label="Mobile Number" icon={Phone} error={errors.phone?.message} required>
                <input {...register('phone', { required: 'Phone is mandatory', pattern: { value: /^\d{10}$/, message: 'Must be exactly 10 digits' } })} placeholder="0000000000" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
            </FormField>
            <FormField label="Date of Birth" icon={Calendar} error={errors.dob?.message} required>
                <input type="date" {...register('dob', { required: 'DOB is mandatory' })} max={new Date().toISOString().split('T')[0]} className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
            </FormField>
            <div className="md:col-span-2 p-6 bg-orange-50/50 border border-orange-100 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ff6e00] rounded-xl flex items-center justify-center text-white shadow-lg">
                        <MonitorX className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hardware Requirements</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Assessment Environment Check</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <Select
                        label="Do you have a laptop?"
                        value={watch('hasLaptop')}
                        options={[
                            { id: 'yes', label: 'Yes, I have a laptop' },
                            { id: 'no', label: 'No, I don\'t have one' }
                        ]}
                        onSelect={val => setValue('hasLaptop', val)}
                        required
                    />
                    
                    {watch('hasLaptop') === 'no' && (
                        <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-orange-200 animate-in fade-in slide-in-from-left-4 duration-300">
                            <AlertCircle className="w-5 h-5 text-[#ff6e00] shrink-0 mt-0.5" />
                            <p className="text-xs font-black text-[#ff6e00] uppercase tracking-wide leading-relaxed">
                                You have to visit our office for the exam
                            </p>
                        </div>
                    )}
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
                <input type="hidden" {...register('country', { required: 'Country is mandatory' })} />
                <input type="hidden" {...register('state', { required: 'State is mandatory' })} />
                <input type="hidden" {...register('city', { required: 'City is mandatory' })} />
            </div>
            <div className="space-y-0 relative z-[70]">
                <Autocomplete
                    label="Country"
                    value={watchCountry}
                    options={allCountries}
                    onChange={(val) => {
                        setValue('country', val, { shouldValidate: true });
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
            <div className="space-y-0 relative z-[60]">
                <Autocomplete
                    label="State"
                    value={watchState}
                    options={statesForCountry.map(s => s.name)}
                    onChange={(val) => {
                        setValue('state', val, { shouldValidate: true });
                        if (!statesForCountry.some(s => s.name.toLowerCase() === val.toLowerCase())) {
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
            <div className="space-y-0 relative z-[50]">
                <Autocomplete
                    label="City"
                    value={watchCity}
                    options={citiesForState}
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
);

const AcademicBackgroundSection = ({ register, errors, expType, hasBacklogs, setValue }) => (
    <div className="space-y-8 relative z-[10]">
        <SectionHeader title="Academic Background" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField label="College Name" icon={BookOpen} error={errors.college?.message} required>
                <input {...register('college', { required: 'College is mandatory' })} placeholder="Oxford Institute" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
            </FormField>
            <FormField label="Degree" icon={GraduationCap} error={errors.education?.message} required>
                <input {...register('education', { required: 'Degree is mandatory' })} placeholder="B.E. Computer Science" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
            </FormField>
            <FormField label="Passing Year" icon={History} error={errors.passingYear?.message} required>
                <input placeholder="2024" {...register('passingYear', { required: 'Year is mandatory' })} className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
            </FormField>
            <FormField label="Final CGPA / %" icon={Award} error={errors.cgpa?.message} required>
                <input {...register('cgpa', { required: 'CGPA is mandatory' })} placeholder="8.5 or 85%" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
            </FormField>
            {expType !== 'experienced' && (
                <Select
                    label="Active Backlogs?"
                    value={hasBacklogs}
                    options={[
                        { id: 'no', label: "No, I'm clear" },
                        { id: 'yes', label: 'Yes, have active' }
                    ]}
                    onSelect={val => setValue('activeBacklogs', val)}
                    icon={AlertCircle}
                    className="z-50"
                />
            )}
            {hasBacklogs === 'yes' && (
                <FormField label="Count" icon={AlertCircle} error={errors.backlogCount?.message}>
                    <input type="number" {...register('backlogCount')} placeholder="0" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                </FormField>
            )}
        </div>
    </div>
);

const ProfessionalDetailsSection = ({ register, errors, expType, watchPosition, vacancies, preSelectedPosition, setValue }) => (
    <div className="space-y-8 relative z-[20]">
        <SectionHeader title="Professional Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-0 relative z-[25]">
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
                <>
                    <FormField label="Total Experience" icon={Clock} error={errors.yearsOfExperience?.message}>
                        <input {...register('yearsOfExperience')} placeholder="e.g. 2.5 Years" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                    </FormField>
                    <FormField label="Current CTC (Annual)" icon={Banknote} error={errors.currentCTC?.message}>
                        <input {...register('currentCTC')} placeholder="e.g. 8,00,000" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                    </FormField>
                    <FormField label="Expected CTC (Annual)" icon={Banknote} error={errors.expectedCTC?.message}>
                        <input {...register('expectedCTC')} placeholder="e.g. 12,00,000" className="block w-full pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner" />
                    </FormField>
                </>
            )}
            <div className="space-y-0 relative z-[21]">
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
    </div>
);

const ResumeUploadSection = ({ register, errors, resumeFileName }) => (
    <div className="space-y-4 relative z-[10]">
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
);

const Register = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            activeBacklogs: 'no',
            experienceType: 'fresher',
            country: 'India',
            state: '',
            city: '',
            position: '',
            hasLaptop: 'yes'
        }
    });

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
    const citiesForState = statesForCountry.find(s => s.name.toLowerCase() === watchState?.toLowerCase())?.cities || [];

    const preSelectedPosition = searchParams.get('position');
    const expType = watch('experienceType');
    const hasBacklogs = watch('activeBacklogs');
    const watchPosition = watch('position');

    useEffect(() => {
        register('country', { required: 'Country is required' });
        register('state', { required: 'State is required' });
        register('city', { required: 'City is required' });
        register('position', { required: 'Target Position is required' });
    }, [register]);

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                // Guide Section 4: backend filters server-side with ?openOnly=true
                const data = await ApiService.get('/api/vacancies?openOnly=true');
                setVacancies(data);

                if (preSelectedPosition) {
                    const exists = data.find(v => v.id === Number.parseInt(preSelectedPosition));
                    if (exists) {
                        setValue('position', exists.id);
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
            
            // Guide Section 4: send only what CandidateRequestDto accepts
            const payload = {
                name: rest.name,
                email: rest.email,
                phone: rest.phone,
                dob: rest.dob,
                password: rest.password,
                college: rest.college,
                education: rest.education,
                passingYear: rest.passingYear,
                cgpa: rest.cgpa,
                position: rest.position,
                experienceType: rest.experienceType,
                activeBacklogs: rest.activeBacklogs,
                resumeName: resumeFileName || 'Not uploaded',
                country: rest.country,
                state: rest.state,
                city: rest.city,
                currentCTC: rest.currentCTC,
                expectedCTC: rest.expectedCTC,
                yearsOfExperience: rest.yearsOfExperience,
                hasLaptop: rest.hasLaptop
            };

            const response = await ApiService.post('/api/candidates/register', payload);
            const savedCandidate = response; // Backend returns candidate with real id
            const candidateId = savedCandidate.id;

            if (resume?.[0] && candidateId) {
                const form = new FormData();
                form.append('file', resume[0]); // Guide Section 4 uses 'file'
                
                // Upload resume separately using the helper in ApiService
                await ApiService.uploadResume(candidateId, form);
            }

            setCandidateData(savedCandidate);
            setStep(3);
        } catch (error) {
            console.error('Registration failed:', error);
            const message = error.response?.data?.message || 'Failed to save registration data. Please check your network.';
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#002D5E] to-[#112240] p-4 font-sans selection:bg-orange-500/30 selection:text-white relative overflow-hidden">
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
                        {step === 1
                            ? (preSelectedPosition ? `Applying for ${vacancies.find(v => v.id === preSelectedPosition)?.title || 'Position'}` : 'Scan to verify and continue on your mobile')
                            : 'Provide your comprehensive details to start the assessment'}
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-700">
                    {step === 1 && <Step1View onNext={() => setStep(2)} />}

                    {step === 2 && (
                        <form onSubmit={handleSubmit(onSubmit)} className="p-12 space-y-10 animate-in slide-in-from-right-8 fade-in duration-500">
                            <PersonalInformationSection
                                register={register}
                                errors={errors}
                                watchCountry={watchCountry}
                                watchState={watchState}
                                watchCity={watchCity}
                                allCountries={allCountries}
                                statesForCountry={statesForCountry}
                                citiesForState={citiesForState}
                                setValue={setValue}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />

                            <AcademicBackgroundSection
                                register={register}
                                errors={errors}
                                expType={expType}
                                hasBacklogs={hasBacklogs}
                                setValue={setValue}
                            />

                            <ProfessionalDetailsSection
                                register={register}
                                errors={errors}
                                expType={expType}
                                watchPosition={watchPosition}
                                vacancies={vacancies}
                                preSelectedPosition={preSelectedPosition}
                                setValue={setValue}
                            />

                            <ResumeUploadSection
                                register={register}
                                errors={errors}
                                resumeFileName={resumeFileName}
                            />

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
                    )}

                    {step === 3 && <SuccessView candidateData={candidateData} navigate={navigate} />}
                </div>

                <div className="mt-12 flex items-center justify-center gap-3">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-10 bg-[#ff6e00]' : 'w-4 bg-white/10'}`}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Register;
