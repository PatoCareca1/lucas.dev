export interface WordFrequency {
    word: string;
    count: number;
}

export interface WordCounterResult {
    wordCount: number;
    charCount: number;
    charCountNoSpaces: number;
    frequency: WordFrequency[];
}

// Unicode-aware word token: letters/digits/underscore plus the apostrophes
// and hyphens found in contractions and compound words (mirrors the old
// backend's `\b[\w'-]+\b` regex, but with `\p{L}`/`\p{N}` so accented
// characters count too).
const WORD_PATTERN = /[\p{L}\p{N}_'-]+/gu;
const TOP_FREQUENCY_LIMIT = 20;

/** Word/character counts and top-20 word frequency, computed entirely in
 * the browser — no backend involved. */
export const analyzeText = (text: string): WordCounterResult => {
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/[ \n]/g, '').length;
    const words = text.toLowerCase().match(WORD_PATTERN) ?? [];

    const counts = new Map<string, number>();
    for (const word of words) {
        counts.set(word, (counts.get(word) ?? 0) + 1);
    }

    const frequency = Array.from(counts, ([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, TOP_FREQUENCY_LIMIT);

    return {
        wordCount: words.length,
        charCount,
        charCountNoSpaces,
        frequency,
    };
};
