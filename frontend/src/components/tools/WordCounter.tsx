import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import { analyzeText } from '../../utils/wordCounter';

const WordCounter: React.FC = () => {
    const { t } = useTranslation();
    const [text, setText] = useState('');

    const result = useMemo(() => (text.trim() ? analyzeText(text) : null), [text]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-4">
                <Calculator className="text-manjaro-green" size={24} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('labs.word_counter.name')}
                </h2>
            </div>

            <textarea
                className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-manjaro-green focus:border-transparent outline-none resize-none transition-all placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100"
                placeholder={t('labs.word_counter.placeholder')}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-center">
                        <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{result.wordCount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('labs.word_counter.words')}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50 text-center">
                        <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{result.charCount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('labs.word_counter.characters')}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50 text-center">
                        <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">{result.charCountNoSpaces}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('labs.word_counter.characters_no_spaces')}</div>
                    </div>
                </div>
            )}

            {result && result.frequency.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('labs.word_counter.frequency')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.frequency.map((entry) => (
                            <div key={entry.word} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm flex items-center gap-2">
                                <span className="text-gray-900 dark:text-gray-100 font-medium">{entry.word}</span>
                                <span className="text-xs text-manjaro-green font-bold">{entry.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WordCounter;
