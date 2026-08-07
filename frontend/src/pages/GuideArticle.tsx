import React, { Children, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { guideLanguages } from '../content/highlightLanguages';
import { AlertTriangle, ChevronLeft, Clock, Github, Loader2, RotateCw } from 'lucide-react';
import { useGuides } from '../hooks/useGuides';
import { extractSections } from '../content/sections';
import { remarkCallout, remarkCodeMeta } from '../content/remarkPlugins';
import { useActiveHeading } from '../hooks/useActiveHeading';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { chapterNumber, formatLongDate } from '../utils/guideFormat';
import { resolvePath } from '../routes/paths';
import { useRelatedGuides } from '../hooks/useRelatedGuides';
import ArticleToc from '../components/guides/ArticleToc';
import Callout, { type CalloutVariant } from '../components/guides/Callout';
import ChapterPager from '../components/guides/ChapterPager';
import CodeBlock from '../components/guides/CodeBlock';
import FeedbackPanel from '../components/guides/FeedbackPanel';
import PrerequisitesPanel from '../components/guides/PrerequisitesPanel';
import ReadingProgressBar from '../components/guides/ReadingProgressBar';
import RelatedGuides from '../components/guides/RelatedGuides';

const GuideArticle: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { slug = '' } = useParams();
    const language = i18n.language;
    const articleRef = useRef<HTMLElement>(null);

    const { guides, status, retry } = useGuides(language);
    const guide = useMemo(() => guides.find((item) => item.slug === slug), [guides, slug]);
    const sections = useMemo(() => (guide ? extractSections(guide.body) : []), [guide]);
    const anchors = useMemo(() => sections.map((section) => section.anchor), [sections]);

    const { progress, reducedMotion } = useReadingProgress(articleRef);
    const { activeAnchor, goTo } = useActiveHeading(anchors);
    const related = useRelatedGuides(guides, slug);

    const { previous, next } = useMemo(() => {
        const index = guides.findIndex((item) => item.slug === slug);
        return {
            previous: index > 0 && guides[index - 1].published ? guides[index - 1] : undefined,
            next: index >= 0 ? guides[index + 1] : undefined,
        };
    }, [guides, slug]);

    useEffect(() => {
        if (!guide) return;
        const hash = window.location.hash.slice(1);
        if (hash) goTo(decodeURIComponent(hash));
    }, [guide, goTo]);

    if (status === 'loading') {
        return (
            <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-14">
                <div className="flex items-center gap-3.5 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                    <Loader2 size={18} className="text-manjaro-green animate-spin flex-none" />
                    <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] font-medium text-gray-950 dark:text-gray-50">
                            {t('guides.article.loading.title')}
                        </div>
                        <div className="text-[13.5px] text-gray-600 dark:text-gray-400">
                            {t('guides.article.loading.body')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-14">
                <div className="flex items-center gap-3.5 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                    <AlertTriangle size={18} className="text-gray-600 dark:text-gray-400 flex-none" />
                    <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] font-medium text-gray-950 dark:text-gray-50">
                            {t('guides.article.error.title')}
                        </div>
                        <div className="text-[13.5px] text-gray-600 dark:text-gray-400">
                            {t('guides.article.error.body')}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={retry}
                        className="flex items-center gap-2 flex-none px-4 py-2.5 rounded-xl border border-manjaro-green/40 dark:border-manjaro-green/30 text-[13.5px] font-semibold text-accent-ink dark:text-accent-ink-dark hover:scale-[1.02] transition-transform"
                    >
                        <RotateCw size={14} />
                        {t('guides.article.error.retry')}
                    </button>
                </div>
            </div>
        );
    }

    if (!guide || !guide.published) {
        return <Navigate to={resolvePath('guides', language)} replace />;
    }

    const updated = formatLongDate(guide.updatedAt, language);

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-32">
            <ReadingProgressBar progress={progress} reducedMotion={reducedMotion} />

            <div className="pt-11 flex items-center gap-2.5 font-mono text-xs text-gray-400 dark:text-gray-500">
                <Link
                    to={resolvePath('guides', language)}
                    className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-accent-ink dark:hover:text-accent-ink-dark transition-colors"
                >
                    <ChevronLeft size={13} />
                    {t('guides.nav.breadcrumb')}
                </Link>
                <span>/</span>
                <span className="text-accent-ink dark:text-accent-ink-dark">
                    {t('guides.card.chapterLabel', { num: chapterNumber(guide.chapter) }).toLowerCase()}
                </span>
            </div>

            <header className="pt-5 pb-8 max-w-[68ch]">
                <h1 className="font-display text-4xl md:text-[46px] leading-[1.08] tracking-[-0.03em] font-semibold text-gray-950 dark:text-gray-50">
                    {guide.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                    {guide.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-5 text-[13.5px] text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400 dark:text-gray-500" />
                        {t('guides.card.readingTime', { minutes: guide.readingTime })}
                    </span>
                    {updated && (
                        <>
                            <span className="w-px h-3.5 bg-gray-200 dark:bg-gray-800" />
                            <span>{t('guides.article.updatedAt', { date: updated })}</span>
                        </>
                    )}
                    <span className="w-px h-3.5 bg-gray-200 dark:bg-gray-800" />
                    <span>{t('guides.article.levelInline', { level: t(`guides.level.${guide.level}`) })}</span>
                </div>
            </header>

            <PrerequisitesPanel prerequisites={guide.prerequisites} notNeeded={guide.notNeeded} />

            <div className="grid gap-14 pt-12 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="min-w-0">
                    <ArticleToc
                        sections={sections}
                        activeAnchor={activeAnchor}
                        progress={progress}
                        variant="mobile"
                        onNavigate={goTo}
                    />
                <article
                    ref={articleRef}
                    className="max-w-[68ch] min-w-0 text-[17px] leading-[1.72] text-gray-800 dark:text-gray-300 guide-prose"
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkCodeMeta, remarkCallout]}
                        rehypePlugins={[
                            rehypeSlug,
                            [
                                rehypeHighlight,
                                { detect: false, ignoreMissing: true, languages: guideLanguages },
                            ],
                        ]}
                        components={{
                            pre: CodeBlock,
                            blockquote: ({ children, ...props }) => {
                                const variant = (props as Record<string, string>)['data-callout'] as
                                    | CalloutVariant
                                    | undefined;

                                const content = Children.toArray(children).filter(
                                    (child) => typeof child !== 'string' || child.trim() !== '',
                                );

                                if (!variant) {
                                    return (
                                        <blockquote className="my-8 px-5 py-4 border-l-[3px] border-manjaro-green rounded-r-xl bg-white/60 dark:bg-gray-900/40 text-[17.5px] italic">
                                            {content}
                                        </blockquote>
                                    );
                                }

                                return <Callout variant={variant}>{content}</Callout>;
                            },
                        }}
                    >
                        {guide.body}
                    </ReactMarkdown>
                </article>
                </div>

                <ArticleToc
                    sections={sections}
                    activeAnchor={activeAnchor}
                    progress={progress}
                    variant="desktop"
                    onNavigate={goTo}
                />
            </div>

            <footer className="max-w-[68ch] mt-16 flex flex-col gap-5">
                <FeedbackPanel slug={guide.slug} language={language} />

                <ChapterPager previous={previous} next={next} language={language} />

                <RelatedGuides guides={related} language={language} />

                {guide.repoUrl && (
                    <a
                        href={guide.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3.5 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm hover:border-manjaro-green/40 transition-colors"
                    >
                        <Github size={20} className="text-gray-950 dark:text-gray-50 flex-none" />
                        <span className="flex-1 min-w-0">
                            <span className="block font-mono text-sm text-gray-950 dark:text-gray-50 truncate">
                                {guide.repoUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                            </span>
                            <span className="block mt-1 text-[13.5px] text-gray-600 dark:text-gray-400">
                                {t('guides.article.repo.title')}
                            </span>
                        </span>
                        <span className="text-[13.5px] font-medium text-accent-ink dark:text-accent-ink-dark flex-none">
                            {t('guides.article.repo.cta')}
                        </span>
                    </a>
                )}
            </footer>
        </div>
    );
};

export default GuideArticle;
