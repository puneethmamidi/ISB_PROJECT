import { NlpManager } from 'node-nlp';

const manager = new NlpManager({ languages: ['en'] });

function calculateEntropy(data) {
    const charFrequency = {};
    for (let char of data) {
        if (!charFrequency[char]) {
            charFrequency[char] = 0;
        }
        charFrequency[char]++;
    }

    let entropy = 0;
    for (let char in charFrequency) {
        const probability = charFrequency[char] / data.length;
        entropy -= probability * Math.log2(probability);
    }

    return entropy;
}

// Example countSyllables function (you may need to adjust this based on your syllable counting rules)
const countSyllables = (word) => {
    const syllableRegex = /(^[aeiouy]+|[aeiouy]{2,}|[aeiouy][^aeiouy]*)/gi;
    return (word.match(syllableRegex) || []).length;
};

export function score_data(data) {
    const entropyValue = calculateEntropy(data);
    let entropyScore = entropyValue.toFixed(2);
    console.log("Entropy Score:", entropyScore);

    if (entropyScore <= 2.99) {
        console.log("Invalid input data. High entropy detected.");
        return null;
    }

    const averageSyllablesPerWord = (text) => {
        const words = text.replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.trim() !== '');
        
        if (words.length === 0) {
            return 0;
        }
        
        let totalSyllables = 0;
        
        words.forEach((word) => {
            totalSyllables += countSyllables(word);
        });
        
        // Calculate average syllables per word
        const avgSyllablesPerWord = totalSyllables / words.length;
        
        // Round to 1 decimal place
        return parseFloat(avgSyllablesPerWord.toFixed(1));
    };

    const averageSentenceLength = (text) => {
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim() !== '');
        if (sentences.length === 0) {
            return 0;
        }
        let totalWords = 0;
        sentences.forEach((sentence) => {
            const words = sentence.trim().split(/\s+/);
            totalWords += words.length;
        });
        return totalWords / sentences.length;
    };

    const avgSyllablesPerWordValue = averageSyllablesPerWord(data);
    const avgSentenceLengthValue = averageSentenceLength(data);
    const score = (206.835 - (1.015 * avgSentenceLengthValue) - (84.6 * avgSyllablesPerWordValue)).toFixed(2);

    return Math.max(0,score);
}
