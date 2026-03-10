import React from 'react';

const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                        {Icon}
                    </div>
                )}
                <input
                    className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 transition-all duration-300 placeholder:text-slate-400/80 ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-[10px] font-bold text-red-500 px-1 italic">{error}</p>
            )}
        </div>
    );
};

export default Input;
