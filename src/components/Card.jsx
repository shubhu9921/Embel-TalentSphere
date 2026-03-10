import React from 'react';

const Card = ({ children, title, subtitle, footer, className = '', ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {(title || subtitle) && (
                <div className="mb-4">
                    {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
                    {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                </div>
            )}
            <div className="card-content">
                {children}
            </div>
            {footer && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
