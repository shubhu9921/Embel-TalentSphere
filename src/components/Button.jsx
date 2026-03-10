import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg',
        success: 'btn bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg',
        ghost: 'btn bg-transparent hover:bg-slate-100 text-slate-600',
    };

    return (
        <button className={`${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
