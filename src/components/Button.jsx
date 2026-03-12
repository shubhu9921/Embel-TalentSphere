import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    icon: Icon,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-[0.15em] transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-95 hover-lift';

    const variants = {
        primary: 'bg-[#19325c] text-white hover:bg-[#112445] focus:ring-[#19325c]/20 shadow-subtle',
        secondary: 'bg-[#19325c] text-white hover:bg-[#112445] focus:ring-[#19325c]/20 shadow-orange-glow hover:shadow-orange-glow-hover',
        outline: 'border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-100',
        danger: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-200 shadow-xl shadow-rose-500/10',
        success: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-200 shadow-xl shadow-emerald-500/10',
        ghost: 'bg-transparent hover:bg-slate-50 text-slate-500 focus:ring-slate-100',
    };

    const sizes = {
        xs: 'px-3 py-1.5 text-[10px]',
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            aria-label={props['aria-label'] || (typeof children === 'string' ? children : undefined)}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!loading && Icon && <Icon className={`${children ? 'mr-2' : ''} h-4 w-4`} />}
            {children}
        </button>
    );
};

export default Button;
