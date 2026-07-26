import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Guide } from '../../types/guide';
import { chapterNumber, formatShortDate } from '../../utils/guideFormat';
import { resolveGuidePath } from '../../routes/paths';

interface RelatedGuidesProps {
    guides: Guide[];
    language: string;
}

const RelatedGuides: React.FC<RelatedGuidesProps> = ({ guides, language }) => {
    const { t } = useTranslation();

    if (!guides.length) return null;

    const metaFor = (guide: Guide): string => {
        if (!guide.published) {
            const release = formatShortDate(guide.releaseDate, language);
            return release
                ? `${t('guides.card.soon')} · ${t('guides.card.release', { date: release })}`
                : t('guides.card.soon');
        }

        return `${t(`guides.level.${guide.level}`)} · ${t('guides.card.readingTime', { minutes: guide.readingTime })}`;
    };

    const body = (guide: Guide) => (
        <>
            <span className="font-display text-xl font-bold text-gray-950 dark:text-gray-50 opacity-20 flex-none">
                {chapterNumber(guide.chapter)}
            </span>
            <span className="flex-1 min-w-0">
                <span className="block text-[15.5px] font-medium text-gray-950 dark:text-gray-50">
                    {guide.title}
                </span>
                <span className="block mt-1 text-[13.5px] text-gray-600 dark:text-gray-400">
                    {metaFor(guide)}
                </span>
            </span>
            {guide.published && (
                <ChevronRight size={15} className="text-gray-400 dark:text-gray-500 flex-none" />
            )}
        </>
    );

    return (
        <section>
            <div className="flex items-baseline gap-2.5 mb-3">
                <h2 className="font-display text-[17px] font-semibold text-gray-950 dark:text-gray-50">
                    {t('guides.article.related.heading')}
                </h2>
                <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
                    {t('guides.article.related.source')}
                </span>
            </div>

            <div className="flex flex-col gap-2.5">
                {guides.map((guide) =>
                    guide.published ? (
                        <Link
                            key={guide.slug}
                            to={resolveGuidePath(guide.slug, language)}
                            className="flex items-center gap-3.5 px-[18px] py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm hover:border-manjaro-green/40 transition-colors"
                        >
                            {body(guide)}
                        </Link>
                    ) : (
                        <div
                            key={guide.slug}
                            className="flex items-center gap-3.5 px-[18px] py-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 opacity-80"
                        >
                            {body(guide)}
                        </div>
                    ),
                )}
            </div>
        </section>
    );
};

export default RelatedGuides;
