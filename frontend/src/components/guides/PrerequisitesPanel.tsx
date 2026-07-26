import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Check, ListChecks } from 'lucide-react';

interface PrerequisitesPanelProps {
    prerequisites: string[];
    notNeeded: string[];
}

const PrerequisitesPanel: React.FC<PrerequisitesPanelProps> = ({ prerequisites, notNeeded }) => {
    const { t } = useTranslation();

    if (!prerequisites.length) return null;

    return (
        <section className="max-w-[68ch] px-6 py-6 rounded-2xl border border-manjaro-green/40 dark:border-manjaro-green/30 border-l-[3px] border-l-manjaro-green bg-manjaro-green/[0.12] backdrop-blur-sm">
            <div className="flex items-center gap-2.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.1em] text-accent-ink dark:text-accent-ink-dark">
                <ListChecks size={14} />
                {t('guides.article.prerequisites.label')}
            </div>

            <p className="mt-3 mb-4 text-[15px] text-gray-800 dark:text-gray-300">
                {t('guides.article.prerequisites.intro')}
            </p>

            <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
                {prerequisites.map((item) => (
                    <li key={item} className="flex gap-3 items-start text-[15px] text-gray-800 dark:text-gray-300">
                        <Check size={16} className="text-manjaro-green flex-none mt-0.5" />
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <span>{children}</span>,
                                code: ({ children }) => (
                                    <code className="font-mono text-[0.9em] px-1.5 py-0.5 rounded bg-gray-900/[0.045] dark:bg-black/[0.35]">
                                        {children}
                                    </code>
                                ),
                            }}
                        >
                            {item}
                        </ReactMarkdown>
                    </li>
                ))}
            </ul>

            {notNeeded.length > 0 && (
                <div className="mt-5 pt-3.5 border-t border-manjaro-green/40 dark:border-manjaro-green/30 flex flex-wrap gap-3.5 items-center text-[13.5px] text-gray-600 dark:text-gray-400">
                    <span className="font-mono text-[11.5px] uppercase tracking-[0.09em] text-gray-400 dark:text-gray-500">
                        {t('guides.article.prerequisites.notNeededLabel')}
                    </span>
                    <span>{notNeeded.join(' · ')}</span>
                </div>
            )}
        </section>
    );
};

export default PrerequisitesPanel;
