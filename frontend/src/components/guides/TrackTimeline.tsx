import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { Guide } from '../../types/guide';
import { chapterNumber } from '../../utils/guideFormat';
import ChapterCard from './ChapterCard';
import ChapterCardLocked from './ChapterCardLocked';

interface TrackTimelineProps {
    guides: Guide[];
    language: string;
    onClearFilters: () => void;
}

const TrackTimeline: React.FC<TrackTimelineProps> = ({ guides, language, onClearFilters }) => {
    const { t } = useTranslation();

    if (!guides.length) {
        return (
            <div className="ml-0 md:ml-24 px-7 py-9 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                <div className="font-display text-lg font-semibold text-gray-950 dark:text-gray-50">
                    {t('guides.filters.emptyTitle')}
                </div>
                <p className="mt-2 mb-4 text-[14.5px] text-gray-600 dark:text-gray-400">
                    {t('guides.filters.emptyBody')}
                </p>
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="px-6 py-3 rounded-xl border border-manjaro-green/40 dark:border-manjaro-green/30 text-sm font-semibold text-accent-ink dark:text-accent-ink-dark hover:scale-[1.02] transition-transform"
                >
                    {t('guides.filters.clear')}
                </button>
            </div>
        );
    }

    return (
        <div className="relative pt-6">
            <div
                aria-hidden="true"
                className="hidden md:block absolute left-[47px] top-11 bottom-16 w-0.5 bg-gradient-to-b from-manjaro-green/40 via-gray-200 dark:via-gray-800 to-transparent"
            />

            {guides.map((guide, index) => (
                <motion.div
                    key={guide.slug}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="relative z-[1] flex flex-col md:flex-row gap-4 md:gap-6 items-start pb-5"
                >
                    <div className="flex-none flex md:flex-col flex-row items-center gap-3 md:gap-0 md:w-[70px] pt-1.5">
                        <div className="font-display text-[40px] font-bold tracking-[-0.03em] leading-none text-gray-950 dark:text-gray-50 opacity-[0.16]">
                            {chapterNumber(guide.chapter)}
                        </div>
                        {guide.published ? (
                            <div className="md:mt-3 w-[11px] h-[11px] rounded-full bg-manjaro-green ring-4 ring-manjaro-green/[0.12]" />
                        ) : (
                            <div className="md:mt-3 w-[11px] h-[11px] rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500" />
                        )}
                    </div>

                    {guide.published ? (
                        <ChapterCard guide={guide} language={language} isFirst={guide.chapter === 1} />
                    ) : (
                        <ChapterCardLocked guide={guide} language={language} />
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default TrackTimeline;
