import React from 'react';
import { ChevronDown } from 'lucide-react';
import Dropdown from './Dropdown';

const Select = ({ 
    label, 
    value, 
    options = [], 
    onSelect, 
    placeholder = 'Select option...', 
    icon: Icon,
    className = '',
    triggerClassName = '',
    contentClassName = '',
    error,
    required = false,
    searchable = false
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    // Determine the label to display
    const getDisplayValue = () => {
        if (value === undefined || value === null || value === '') return placeholder;
        const option = options.find(opt => opt.id === value || opt.value === value || opt === value);
        return typeof option === 'object' ? (option.label || option.name) : option;
    };

    const trigger = (
        <div className="space-y-2">
            {label && (
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    {label}
                    {required && <span className="text-rose-500 ml-1 font-black">*</span>}
                </label>
            )}
            <div className={`
                relative w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl 
                flex items-center justify-between transition-all group
                hover:border-orange-500/30 hover:bg-white
                ${error ? 'border-rose-500/50' : 'focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/5'}
                ${triggerClassName || className}
            `}>
                <div className="flex items-center gap-3 overflow-hidden">
                    {Icon && <Icon className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />}
                    <span className={`text-sm font-bold truncate ${(value === undefined || value === null || value === '') ? 'text-slate-400' : 'group-hover:text-orange-600 transition-colors'}`}>
                        {getDisplayValue()}
                    </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-all duration-300" />
            </div>
            {error && <p className="text-[10px] font-bold text-rose-500 px-1 uppercase tracking-wider">{error}</p>}
        </div>
    );

    return (
        <Dropdown 
            trigger={trigger} 
            className="w-full"
            contentClassName="w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            onClose={() => setSearchTerm('')}
        >
            <div className="flex flex-col max-h-80">
                {searchable && (
                    <div className="p-2 border-b border-slate-50">
                        <input
                            type="text"
                            placeholder="Type to filter..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
                <div className="overflow-y-auto p-1.5 scrollbar-hide">
                    {(() => {
                        const filteredOptions = options.filter(opt => {
                            if (!searchTerm) return true;
                            const label = typeof opt === 'object' ? (opt.label || opt.name || '') : String(opt);
                            return label.toLowerCase().includes(searchTerm.toLowerCase());
                        });

                        if (filteredOptions.length === 0) {
                            return <div className="p-4 text-center text-slate-400 text-xs font-bold">No results found</div>;
                        }

                        return filteredOptions.map((opt, idx) => {
                        const optValue = typeof opt === 'object' ? (opt.id || opt.value) : opt;
                        const optLabel = typeof opt === 'object' ? (opt.label || opt.name) : opt;
                        const isActive = value === optValue;

                        return (
                            <div
                                key={idx}
                                onClick={() => onSelect(optValue)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
                                    ${isActive 
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                        : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                                    }
                                `}
                            >
                                <span className="text-sm font-bold truncate">{optLabel}</span>
                            </div>
                        );
                        });
                    })()}
                </div>
            </div>
        </Dropdown>
    );
};

export default Select;
