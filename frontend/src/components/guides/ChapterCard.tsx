import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Clock } from 'lucide-react';
import type { Guide } from '../../types/guide';
import { resolveGuidePath } from '../../routes/paths';
import { chapterNumber } from '../../utils/guideFormat';

interface ChapterCardProps {
    guide: Guide;
    language: string;
    isFirst: boolean;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ guide, language, isFirst }) => {
    const { t } = useTranslation();

    return (
        <Link
            to={resolveGuidePath(guide.slug, language)}
            className="flex-1 min-w-0 block px-6 py-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm hover:border-manjaro-green/40 hover:-translate-y-0.5 transition-all duration-200"
        >
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="font-mono text-[11.5px] uppercase tracking-[0.09em] text-gray-400 dark:text-gray-500">
                    {t('guides.card.chapterLabel', { num: chapterNumber(guide.chapter) })}
                </span>
                {isFirst && (
                    <span className="px-2.5 py-[3px] rounded-md bg-manjaro-green text-white text-[11.5px] font-bold uppercase tracking-[0.04em]">
                        {t('guides.card.startHere')}
                    </span>
                )}
            </div>

            <h3 className="font-display text-2xl leading-tight tracking-[-0.02em] font-semibold text-gray-950 dark:text-gray-50">
                {guide.title}
            </h3>

            <p className="mt-2.5 max-w-[62ch] text-[15.5px] leading-relaxed text-gray-600 dark:text-gray-400">
                {guide.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-4">
                {guide.stack.map((item) => (
                    <span
                        key={item}
                        className="px-2 py-[3px] rounded-md border border-gray-200 dark:border-gray-800 font-mono text-[11.5px] text-gray-600 dark:text-gray-400"
                    >
                        {item}
                    </span>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-gray-900/[0.07] dark:border-white/[0.06] text-[13.5px] text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-gray-400 dark:text-gray-500" />
                    {t(`guides.level.${guide.level}`)}
                </span>

                <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-400 dark:text-gray-500" />
                    {t('guides.card.readingTime', { minutes: guide.readingTime })}
                </span>

                <span className="flex-1" />

                <span className="flex items-center gap-1.5 font-medium text-accent-ink dark:text-accent-ink-dark">
                    {t('guides.card.cta')}
                    <ArrowRight size={15} />
                </span>
            </div>
        </Link>
    );
};

export default ChapterCard;
