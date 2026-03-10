export const analyzeSpeech = (transcript) => {
    const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically'];
    const words = transcript.toLowerCase().split(/\s+/);

    const fillerCount = words.filter(word => fillerWords.includes(word)).length;
    const fillerFrequency = words.length > 0 ? (fillerCount / words.length) * 100 : 0;

    // Simple clarity score based on absence of filler words
    const clarityScore = Math.max(0, 100 - (fillerFrequency * 5));

    return {
        fillerCount,
        fillerFrequency: fillerFrequency.toFixed(1),
        clarityScore: clarityScore.toFixed(0),
        wordCount: words.length,
        detectedFillers: Array.from(new Set(words.filter(word => fillerWords.includes(word))))
    };
};

export const calculatePace = (wordCount, durationInSeconds) => {
    if (durationInSeconds <= 0) return 0;
    const wpm = (wordCount / durationInSeconds) * 60;
    return wpm.toFixed(0);
};

export const getPracticeFeedback = (analysis) => {
    let feedback = [];

    if (analysis.clarityScore > 85) {
        feedback.push("Great job! Your speech is very clear and professional.");
    } else if (analysis.clarityScore > 60) {
        feedback.push("Good effort. Try to reduce the use of filler words like 'um' and 'like'.");
    } else {
        feedback.push("Focus on speaking more deliberately. Frequent filler words can distract the interviewer.");
    }

    if (analysis.pace > 160) {
        feedback.push("You're speaking a bit fast. Slow down slightly to ensure clarity.");
    } else if (analysis.pace < 100 && analysis.wordCount > 10) {
        feedback.push("Try to speak a bit more fluently; your pace is a bit slow.");
    }

    return feedback;
};
