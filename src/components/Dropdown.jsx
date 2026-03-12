import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
    trigger, 
    children, 
    align = 'left', 
    className = '', 
    contentClassName = '',
    closeOnClick = true 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const alignmentClasses = {
        left: 'left-0 origin-top-left',
        right: 'right-0 origin-top-right',
        center: 'left-1/2 -translate-x-1/2 origin-top',
    };

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
                tabIndex={0}
                className="cursor-pointer focus:outline-none"
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {trigger}
            </div>

            {isOpen && (
                <div 
                    className={`
                        absolute z-50 mt-2
                        ${alignmentClasses[align]}
                        ${contentClassName}
                        animate-in fade-in zoom-in-95 duration-200
                    `}
                    onClick={closeOnClick ? () => setIsOpen(false) : undefined}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
