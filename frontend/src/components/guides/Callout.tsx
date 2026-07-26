import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Info, TriangleAlert } from 'lucide-react';

export type CalloutVariant = 'note' | 'warning' | 'pitfall';

const VARIANTS: Record<CalloutVariant, { icon: typeof Info; accent: string; label: string }> = {
    note: {
        icon: Info,
        accent: 'border-l-manjaro-green text-manjaro-green',
        label: 'guides.article.callout.note',
    },
    warning: {
        icon: AlertTriangle,
        accent: 'border-l-gray-950 dark:border-l-gray-50 text-gray-950 dark:text-gray-50',
        label: 'guides.article.callout.warning',
    },
    pitfall: {
        icon: TriangleAlert,
        accent: 'border-l-amber-500 text-amber-600 dark:text-amber-400',
        label: 'guides.article.callout.pitfall',
    },
};

interface CalloutProps {
    variant: CalloutVariant;
    children: React.ReactNode;
}

const Callout: React.FC<CalloutProps> = ({ variant, children }) => {
    const { t } = useTranslation();
    const { icon: Icon, accent, label } = VARIANTS[variant];

    return (
        <div
            className={`my-6 flex gap-3.5 px-[18px] py-4 rounded-r-xl border border-l-[3px] border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm ${accent}`}
        >
            <Icon size={17} className="flex-none mt-1" />
            <div className="min-w-0">
                <div className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] mb-1.5">
                    {t(label)}
                </div>
                <div className="text-[15.5px] text-gray-800 dark:text-gray-300 [&>p]:m-0">{children}</div>
            </div>
        </div>
    );
};

export default Callout;
