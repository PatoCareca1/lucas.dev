import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, List } from 'lucide-react';
import type { GuideSection } from '../../types/guide';

interface ArticleTocProps {
    sections: GuideSection[];
    activeAnchor: string;
    progress: number;
    variant: 'mobile' | 'desktop';
    onNavigate: (anchor: string) => void;
}

const ArticleToc: React.FC<ArticleTocProps> = ({
    sections,
    activeAnchor,
    progress,
    variant,
    onNavigate,
}) => {
    const { t } = useTranslation();

    if (!sections.length) return null;

    const items = sections.map((section, index) => (
        <li key={section.anchor}>
            <a
                href={`#${section.anchor}`}
                onClick={(event) => {
                    event.preventDefault();
                    onNavigate(section.anchor);
                }}
                className={`flex gap-2.5 px-2.5 py-1.5 rounded-lg text-[13.5px] leading-snug border-l-2 transition-colors ${
                    activeAnchor === section.anchor
                        ? 'bg-manjaro-green/[0.12] text-accent-ink dark:text-accent-ink-dark font-medium border-l-manjaro-green'
                        : 'text-gray-600 dark:text-gray-400 border-l-transparent hover:text-gray-950 dark:hover:text-gray-50'
                }`}
            >
                <span className="font-mono text-[11.5px] text-gray-400 dark:text-gray-500 flex-none pt-px">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <span>{section.heading}</span>
            </a>
        </li>
    ));

    if (variant === 'mobile') {
        return (
            <details className="lg:hidden mb-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm overflow-hidden group">
                <summary className="flex items-center gap-3 px-4 py-3.5 cursor-pointer text-sm font-medium text-gray-950 dark:text-gray-50 list-none">
                    <List size={15} className="text-accent-ink dark:text-accent-ink-dark" />
                    {t('guides.article.toc.label')}
                    <span className="flex-1" />
                    <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
                        {t('guides.article.toc.count', { count: sections.length })}
                    </span>
                    <ChevronDown
                        size={15}
                        className="text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180"
                    />
                </summary>
                <ol className="flex flex-col gap-0.5 m-0 px-4 pb-4 pt-0.5 list-none border-t border-gray-900/[0.07] dark:border-white/[0.06]">
                    {items}
                </ol>
            </details>
        );
    }

    return (
        <aside className="hidden lg:block min-w-0">
            <div className="sticky top-24 px-[18px] py-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 mb-3.5 font-mono text-[11px] uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
                    <List size={13} />
                    {t('guides.article.toc.label')}
                </div>
                <ol className="flex flex-col gap-px m-0 p-0 list-none">{items}</ol>
                <div className="mt-4 pt-3.5 border-t border-gray-900/[0.07] dark:border-white/[0.06] font-mono text-[11.5px] text-gray-400 dark:text-gray-500">
                    {t('guides.article.toc.readProgress', { percent: Math.round(progress) })}
                </div>
            </div>
        </aside>
    );
};

export default ArticleToc;
