import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Guide } from '../../types/guide';
import { chapterNumber } from '../../utils/guideFormat';
import { resolveGuidePath } from '../../routes/paths';

interface ChapterPagerProps {
    previous?: Guide;
    next?: Guide;
    language: string;
}

const ChapterPager: React.FC<ChapterPagerProps> = ({ previous, next, language }) => {
    const { t } = useTranslation();

    return (
        <section className="flex flex-wrap gap-3">
            {previous ? (
                <Link
                    to={resolveGuidePath(previous.slug, language)}
                    className="flex-1 min-w-[220px] px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm hover:border-manjaro-green/40 transition-colors"
                >
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.09em] text-accent-ink dark:text-accent-ink-dark">
                        <ArrowLeft size={13} />
                        {t('guides.article.pager.prevLabel')}
                    </div>
                    <div className="mt-2 font-display text-[17px] font-semibold text-gray-950 dark:text-gray-50">
                        {previous.title}
                    </div>
                </Link>
            ) : (
                <div className="flex-1 min-w-[220px] px-5 py-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                    <div className="font-mono text-[11px] uppercase tracking-[0.09em] text-gray-400 dark:text-gray-500">
                        {t('guides.article.pager.prevLabel')}
                    </div>
                    <div className="mt-2 text-[15px] text-gray-400 dark:text-gray-500">
                        {t('guides.article.pager.trackStart')}
                    </div>
                </div>
            )}

            {next && next.published ? (
                <Link
                    to={resolveGuidePath(next.slug, language)}
                    className="flex-1 min-w-[220px] px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm hover:border-manjaro-green/40 transition-colors"
                >
                    <div className="flex items-center justify-end gap-2 font-mono text-[11px] uppercase tracking-[0.09em] text-accent-ink dark:text-accent-ink-dark">
                        {t('guides.article.pager.nextLabel', { num: chapterNumber(next.chapter) })}
                        <ArrowRight size={13} />
                    </div>
                    <div className="mt-2 font-display text-[17px] font-semibold text-right text-gray-950 dark:text-gray-50">
                        {next.title}
                    </div>
                </Link>
            ) : (
                <div className="flex-1 min-w-[220px] px-5 py-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-right">
                    {next && (
                        <div className="font-mono text-[11px] uppercase tracking-[0.09em] text-gray-400 dark:text-gray-500">
                            {t('guides.article.pager.nextLabel', { num: chapterNumber(next.chapter) })}
                        </div>
                    )}
                    <div className="mt-2 text-[15px] text-gray-400 dark:text-gray-500">
                        {next ? next.title : t('guides.article.pager.trackEnd')}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ChapterPager;
