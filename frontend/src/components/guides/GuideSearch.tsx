import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, RotateCw, Search, X } from 'lucide-react';
import type { GuideSearchHit } from '../../types/guide';
import type { SearchStatus } from '../../hooks/useGuideSearch';
import { getGuideBySlug } from '../../content/loader';
import { resolveGuidePath } from '../../routes/paths';
import { chapterNumber } from '../../utils/guideFormat';

const SUGGESTIONS = ['gunicorn', 'migrations', 'docker compose', 'serializer'];

interface GuideSearchProps {
    query: string;
    status: SearchStatus;
    results: GuideSearchHit[];
    language: string;
    onQueryChange: (value: string) => void;
    onClear: () => void;
    onRetry: () => void;
}

const GuideSearch: React.FC<GuideSearchProps> = ({
    query,
    status,
    results,
    language,
    onQueryChange,
    onClear,
    onRetry,
}) => {
    const { t } = useTranslation();

    const meta =
        status === 'results'
            ? t('guides.search.count', { count: results.length })
            : status === 'loading'
                ? t('guides.search.loadingMeta')
                : '';

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm max-w-2xl">
                <Search size={17} className="text-gray-400 dark:text-gray-500 flex-none" />
                <input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder={t('guides.search.placeholder')}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-[15px] text-gray-950 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {status === 'loading' && (
                    <Loader2 size={15} className="text-manjaro-green animate-spin flex-none" />
                )}
                {query.length > 0 && (
                    <button
                        type="button"
                        onClick={onClear}
                        aria-label={t('guides.search.clear')}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-950 dark:hover:text-gray-50 transition-colors flex-none"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            {status !== 'idle' && (
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                >
                    <div className="flex items-baseline gap-3 mb-4">
                        <h2 className="font-display text-[17px] font-semibold text-gray-950 dark:text-gray-50">
                            {t('guides.search.resultsHeading')}
                        </h2>
                        <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{meta}</span>
                    </div>

                    {status === 'loading' && (
                        <div className="flex flex-col gap-2.5">
                            {[0, 0.15, 0.3].map((delay, index) => (
                                <div
                                    key={index}
                                    style={{ animationDelay: `${delay}s` }}
                                    className="h-[74px] rounded-xl bg-gray-900/[0.09] dark:bg-white/[0.08] animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex items-center gap-3.5 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                            <AlertTriangle size={18} className="text-gray-600 dark:text-gray-400 flex-none" />
                            <div className="flex-1 min-w-0">
                                <div className="text-[14.5px] font-medium text-gray-950 dark:text-gray-50">
                                    {t('guides.search.error.title')}
                                </div>
                                <div className="text-[13.5px] text-gray-600 dark:text-gray-400">
                                    {t('guides.search.error.body')}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onRetry}
                                className="flex items-center gap-2 flex-none px-4 py-2.5 rounded-xl border border-manjaro-green/40 dark:border-manjaro-green/30 text-[13.5px] font-semibold text-accent-ink dark:text-accent-ink-dark hover:scale-[1.02] transition-transform"
                            >
                                <RotateCw size={14} />
                                {t('guides.search.error.retry')}
                            </button>
                        </div>
                    )}

                    {status === 'empty' && (
                        <div className="px-7 py-11 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                            <div className="font-mono text-[13px] text-gray-400 dark:text-gray-500">
                                {t('guides.search.empty.meta', { query })}
                            </div>
                            <div className="mt-3 mb-1 font-display text-[19px] font-semibold text-gray-950 dark:text-gray-50">
                                {t('guides.search.empty.title')}
                            </div>
                            <p className="mx-auto max-w-[460px] text-[14.5px] text-gray-600 dark:text-gray-400">
                                {t('guides.search.empty.body')}
                            </p>
                            <div className="flex flex-wrap justify-center gap-2.5 mt-5">
                                {SUGGESTIONS.map((term) => (
                                    <button
                                        key={term}
                                        type="button"
                                        onClick={() => onQueryChange(term)}
                                        className="px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 font-mono text-[13px] text-gray-600 dark:text-gray-400 hover:border-manjaro-green/40 hover:text-accent-ink dark:hover:text-accent-ink-dark transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {status === 'results' && (
                        <div className="flex flex-col gap-2.5">
                            {results.map((hit) => (
                                <Link
                                    key={`${hit.slug}-${hit.anchor}`}
                                    to={`${resolveGuidePath(hit.slug, language)}#${hit.anchor}`}
                                    className="block px-[18px] py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm hover:border-manjaro-green/40 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.05em] text-accent-ink dark:text-accent-ink-dark">
                                        <span>CAP {chapterNumber(hit.chapter)}</span>
                                        <span className="text-gray-400 dark:text-gray-500">/</span>
                                        <span className="text-gray-400 dark:text-gray-500">
                                            {getGuideBySlug(hit.slug, language)?.title}
                                        </span>
                                    </div>
                                    <div className="mt-2 font-display text-base font-semibold text-gray-950 dark:text-gray-50">
                                        {hit.section}
                                    </div>
                                    <div className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                                        {hit.excerpt}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.section>
            )}
        </div>
    );
};

export default GuideSearch;
