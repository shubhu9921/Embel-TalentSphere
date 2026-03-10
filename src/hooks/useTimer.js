import { useState, useEffect, useRef } from 'react';

/**
 * useTimer - A robust countdown timer hook
 * @param {number} initialMinutes - Total minutes for the assessment
 * @param {function} onExpire - Callback triggered when timer reaches zero
 * @returns {object} { seconds, resetTimer }
 */
const useTimer = (initialMinutesValue = 30, onExpire) => {
    // Current seconds remaining
    const [seconds, setSeconds] = useState(0);
    const onExpireRef = useRef(onExpire);
    const timerRef = useRef(null);

    // Update the ref when onExpire changes to avoid re-running effects
    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
        // Use candidate ID if available to make timer unique per candidate
        const candidate = JSON.parse(localStorage.getItem('candidate'));
        const storageKey = candidate ? `exam_expiry_${candidate.id}` : 'exam_expiry_default';

        let expiryTime = localStorage.getItem(storageKey);

        if (!expiryTime) {
            // First time starting: set expiry to absolute future timestamp
            expiryTime = Date.now() + (initialMinutesValue * 60 * 1000);
            localStorage.setItem(storageKey, expiryTime);
        } else {
            expiryTime = parseInt(expiryTime, 10);
        }

        const calculateRemaining = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
            setSeconds(remaining);

            if (remaining <= 0) {
                if (timerRef.current) clearInterval(timerRef.current);
                if (onExpireRef.current) onExpireRef.current();
            }
        };

        // Initial check
        calculateRemaining();

        // Tick every 1 second
        timerRef.current = setInterval(calculateRemaining, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [initialMinutesValue]); // Only restart if the duration requirement changes

    const resetTimer = () => {
        const candidate = JSON.parse(localStorage.getItem('candidate'));
        const storageKey = candidate ? `exam_expiry_${candidate.id}` : 'exam_expiry_default';
        localStorage.removeItem(storageKey);
        // This will trigger the effect to re-run and set a new expiry
    };

    return { seconds, resetTimer };
};

export default useTimer;
