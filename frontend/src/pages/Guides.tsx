import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AlertTriangle, Github, Loader2, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGuides } from '../hooks/useGuides';
import { useGuideSearch } from '../hooks/useGuideSearch';
import type { GuideLevel } from '../types/guide';
import { formatShortDate } from '../utils/guideFormat';
import GuideFilters from '../components/guides/GuideFilters';
import GuideSearch from '../components/guides/GuideSearch';
import TrackTimeline from '../components/guides/TrackTimeline';

const Guides: React.FC = () => {
    const { t, i18n } = useTranslation();
    const language = i18n.language;

    const { guides, status, retry } = useGuides(language);
    const [activeStacks, setActiveStacks] = useState<string[]>([]);
    const [activeLevels, setActiveLevels] = useState<GuideLevel[]>([]);

    const search = useGuideSearch(guides);

    const stacks = useMemo(
        () => Array.from(new Set(guides.flatMap((guide) => guide.stack))),
        [guides],
    );

    const visible = useMemo(
        () =>
            guides.filter((guide) => {
                if (activeStacks.length && !activeStacks.some((item) => guide.stack.includes(item))) {
                    return false;
                }
                if (activeLevels.length && !activeLevels.includes(guide.level)) return false;
                return true;
            }),
        [guides, activeStacks, activeLevels],
    );

    const publishedCount = guides.filter((guide) => guide.published).length;

    const lastUpdate = useMemo(() => {
        const dates = guides
            .map((guide) => guide.updatedAt)
            .filter((value): value is string => Boolean(value))
            .sort();
        return dates.length ? formatShortDate(dates[dates.length - 1], language) : '';
    }, [guides, language]);

    const toggleStack = (value: string) =>
        setActiveStacks((current) =>
            current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
        );

    const toggleLevel = (value: GuideLevel) =>
        setActiveLevels((current) =>
            current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
        );

    const clearFilters = () => {
        setActiveStacks([]);
        setActiveLevels([]);
    };

    const trackMeta =
        visible.length === guides.length
            ? t('guides.index.track.metaAll', { count: guides.length })
            : t('guides.index.track.metaFiltered', { shown: visible.length, total: guides.length });

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-32">
            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-14 pb-10 max-w-[720px]"
            >
                <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.1em] text-accent-ink dark:text-accent-ink-dark">
                    <span className="w-[22px] h-px bg-manjaro-green" />
                    {t('guides.index.eyebrow')}
                </div>

                <h1 className="mt-4 font-display text-5xl leading-[1.06] tracking-[-0.03em] font-semibold text-gray-950 dark:text-gray-50">
                    <Trans
                        i18nKey="guides.index.title"
                        components={[
                            <span className="font-mono text-[0.85em] text-accent-ink dark:text-accent-ink-dark" />,
                        ]}
                    />
                </h1>

                <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                    <Trans
                        i18nKey="guides.index.lede"
                        components={[
                            <code className="font-mono text-[0.87em] px-1.5 py-0.5 rounded bg-gray-900/[0.045] dark:bg-black/[0.35] text-gray-800 dark:text-gray-300" />,
                        ]}
                    />
                </p>

                {status === 'ready' && (
                    <div className="flex flex-wrap gap-5 mt-6 font-mono text-[13.5px] text-gray-400 dark:text-gray-500">
                        <span>{t('guides.index.meta.chapters', { count: guides.length })}</span>
                        <span>·</span>
                        <span>{t('guides.index.meta.published', { count: publishedCount })}</span>
                        {lastUpdate && (
                            <>
                                <span>·</span>
                                <span>{t('guides.index.meta.updated', { date: lastUpdate })}</span>
                            </>
                        )}
                    </div>
                )}
            </motion.section>

            {status === 'loading' && (
                <div className="flex items-center gap-3.5 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                    <Loader2 size={18} className="text-manjaro-green animate-spin flex-none" />
                    <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] font-medium text-gray-950 dark:text-gray-50">
                            {t('guides.index.loading.title')}
                        </div>
                        <div className="text-[13.5px] text-gray-600 dark:text-gray-400">
                            {t('guides.index.loading.body')}
                        </div>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-center gap-3.5 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                    <AlertTriangle size={18} className="text-gray-600 dark:text-gray-400 flex-none" />
                    <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] font-medium text-gray-950 dark:text-gray-50">
                            {t('guides.index.error.title')}
                        </div>
                        <div className="text-[13.5px] text-gray-600 dark:text-gray-400">
                            {t('guides.index.error.body')}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={retry}
                        className="flex items-center gap-2 flex-none px-4 py-2.5 rounded-xl border border-manjaro-green/40 dark:border-manjaro-green/30 text-[13.5px] font-semibold text-accent-ink dark:text-accent-ink-dark hover:scale-[1.02] transition-transform"
                    >
                        <RotateCw size={14} />
                        {t('guides.index.error.retry')}
                    </button>
                </div>
            )}

            {status === 'ready' && (
                <>
                    <section className="flex flex-col gap-[18px] py-6 border-y border-gray-200 dark:border-gray-800">
                        <GuideSearch
                            query={search.query}
                            status={search.status}
                            results={search.results}
                            guides={guides}
                            language={language}
                            onQueryChange={search.setQuery}
                            onClear={search.clear}
                            onRetry={search.retry}
                        />

                        <GuideFilters
                            stacks={stacks}
                            activeStacks={activeStacks}
                            activeLevels={activeLevels}
                            onToggleStack={toggleStack}
                            onToggleLevel={toggleLevel}
                            onClear={clearFilters}
                        />
                    </section>

                    <section className="pt-10">
                        <div className="flex items-baseline justify-between mb-2">
                            <h2 className="font-display text-[17px] font-semibold text-gray-950 dark:text-gray-50">
                                {t('guides.index.track.heading')}
                            </h2>
                            <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{trackMeta}</span>
                        </div>

                        <TrackTimeline guides={visible} language={language} onClearFilters={clearFilters} />

                        <div className="md:ml-24 mt-3.5 flex flex-wrap items-center gap-3 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                            <Github size={16} className="text-gray-400 dark:text-gray-500 flex-none" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t('guides.index.repoBanner.text')}
                            </span>
                            <span className="flex-1" />
                            <a
                                href="https://github.com/lucasdaniel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13.5px] font-medium text-accent-ink dark:text-accent-ink-dark"
                            >
                                {t('guides.index.repoBanner.cta')}
                            </a>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Guides;
