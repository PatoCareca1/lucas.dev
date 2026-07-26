import React from 'react';
import { useTranslation } from 'react-i18next';
import type { GuideLevel } from '../../types/guide';

const LEVELS: GuideLevel[] = ['iniciante', 'intermediario'];

interface GuideFiltersProps {
    stacks: string[];
    activeStacks: string[];
    activeLevels: GuideLevel[];
    onToggleStack: (value: string) => void;
    onToggleLevel: (value: GuideLevel) => void;
    onClear: () => void;
}

const chipClass = (active: boolean): string =>
    active
        ? 'border-manjaro-green/40 dark:border-manjaro-green/30 bg-manjaro-green/[0.12] text-accent-ink dark:text-accent-ink-dark font-medium'
        : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-manjaro-green/40 hover:text-gray-950 dark:hover:text-gray-50';

const GuideFilters: React.FC<GuideFiltersProps> = ({
    stacks,
    activeStacks,
    activeLevels,
    onToggleStack,
    onToggleLevel,
    onClear,
}) => {
    const { t } = useTranslation();
    const hasFilters = activeStacks.length > 0 || activeLevels.length > 0;

    return (
        <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-[11.5px] uppercase tracking-[0.09em] text-gray-400 dark:text-gray-500 mr-0.5">
                {t('guides.filters.stackLabel')}
            </span>

            {stacks.map((stack) => (
                <button
                    key={stack}
                    type="button"
                    aria-pressed={activeStacks.includes(stack)}
                    onClick={() => onToggleStack(stack)}
                    className={`px-3.5 py-1.5 rounded-full border text-[13px] transition-colors ${chipClass(activeStacks.includes(stack))}`}
                >
                    {stack}
                </button>
            ))}

            <span className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1.5" />

            <span className="font-mono text-[11.5px] uppercase tracking-[0.09em] text-gray-400 dark:text-gray-500 mr-0.5">
                {t('guides.filters.levelLabel')}
            </span>

            {LEVELS.map((level) => (
                <button
                    key={level}
                    type="button"
                    aria-pressed={activeLevels.includes(level)}
                    onClick={() => onToggleLevel(level)}
                    className={`px-3.5 py-1.5 rounded-full border text-[13px] transition-colors ${chipClass(activeLevels.includes(level))}`}
                >
                    {t(`guides.level.${level}`)}
                </button>
            ))}

            {hasFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="text-[13px] text-accent-ink dark:text-accent-ink-dark underline underline-offset-[3px]"
                >
                    {t('guides.filters.clear')}
                </button>
            )}
        </div>
    );
};

export default GuideFilters;
