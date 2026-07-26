import React, { Children, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { common } from 'lowlight';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import { ChevronLeft, Clock } from 'lucide-react';
import { getGuideBySlug } from '../content/loader';
import { extractSections } from '../content/sections';
import { remarkCallout, remarkCodeMeta } from '../content/remarkPlugins';
import { useActiveHeading } from '../hooks/useActiveHeading';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { chapterNumber, formatLongDate } from '../utils/guideFormat';
import { resolvePath } from '../routes/paths';
import ArticleToc from '../components/guides/ArticleToc';
import Callout, { type CalloutVariant } from '../components/guides/Callout';
import CodeBlock from '../components/guides/CodeBlock';
import PrerequisitesPanel from '../components/guides/PrerequisitesPanel';
import ReadingProgressBar from '../components/guides/ReadingProgressBar';

const GuideArticle: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { slug = '' } = useParams();
    const language = i18n.language;
    const articleRef = useRef<HTMLElement>(null);

    const guide = useMemo(() => getGuideBySlug(slug, language), [slug, language]);
    const sections = useMemo(() => (guide ? extractSections(guide.body) : []), [guide]);
    const anchors = useMemo(() => sections.map((section) => section.anchor), [sections]);

    const { progress, reducedMotion } = useReadingProgress(articleRef);
    const { activeAnchor, goTo } = useActiveHeading(anchors);

    useEffect(() => {
        if (!guide) return;
        const hash = window.location.hash.slice(1);
        if (hash) goTo(decodeURIComponent(hash));
    }, [guide, goTo]);

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
                                { detect: false, ignoreMissing: true, languages: { ...common, dockerfile } },
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
        </div>
    );
};

export default GuideArticle;
