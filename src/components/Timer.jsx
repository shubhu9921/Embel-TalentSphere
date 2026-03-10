import React from 'react';

const Timer = ({ seconds, className = '' }) => {
    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isLow = seconds < 300; // Less than 5 mins

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${isLow ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'} ${className}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(seconds)}
        </div>
    );
};

export default Timer;
