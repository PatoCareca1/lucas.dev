import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import type { Guide } from '../../types/guide';
import { chapterNumber, formatShortDate } from '../../utils/guideFormat';

interface ChapterCardLockedProps {
    guide: Guide;
    language: string;
}

const ChapterCardLocked: React.FC<ChapterCardLockedProps> = ({ guide, language }) => {
    const { t } = useTranslation();
    const release = formatShortDate(guide.releaseDate, language);

    return (
        <div className="flex-1 min-w-0 px-6 py-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 opacity-80">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="font-mono text-[11.5px] uppercase tracking-[0.09em] text-gray-400 dark:text-gray-500">
                    {t('guides.card.chapterLabel', { num: chapterNumber(guide.chapter) })}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-[3px] rounded-md border border-gray-200 dark:border-gray-800 text-[11.5px] font-semibold uppercase tracking-[0.04em] text-gray-600 dark:text-gray-400">
                    <Lock size={11} />
                    {t('guides.card.soon')}
                </span>
            </div>

            <h3 className="font-display text-2xl leading-tight tracking-[-0.02em] font-semibold text-gray-600 dark:text-gray-400">
                {guide.title}
            </h3>

            <p className="mt-2.5 max-w-[62ch] text-[15.5px] leading-relaxed text-gray-400 dark:text-gray-500">
                {guide.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-gray-900/[0.07] dark:border-white/[0.06] text-[13.5px] text-gray-400 dark:text-gray-500">
                <span>{t(`guides.level.${guide.level}`)}</span>
                <span>{t('guides.card.readingTimeShort', { minutes: guide.readingTime })}</span>
                {release && <span className="font-mono">{t('guides.card.release', { date: release })}</span>}
            </div>
        </div>
    );
};

export default ChapterCardLocked;
