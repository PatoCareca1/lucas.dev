import React, { isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

const COPIED_MS = 2000;

interface CodeChildProps {
    className?: string;
    'data-file'?: string;
}

const readLanguage = (className?: string): string => {
    const match = className?.match(/language-([\w+-]+)/);
    return match ? match[1] : '';
};

const CodeBlock: React.FC<React.HTMLAttributes<HTMLPreElement>> = ({ children, ...rest }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const child = isValidElement<CodeChildProps>(children) ? children : null;
    const language = readLanguage(child?.props.className);
    const file = child?.props['data-file'] ?? '';

    const copy = useCallback(() => {
        const text = preRef.current?.innerText ?? '';

        copyToClipboard(text).then((ok) => {
            if (!ok) return;
            setCopied(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
        });
    }, []);

    return (
        <div className="my-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-900/[0.045] dark:bg-black/[0.35]">
            <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-gray-900/[0.03] dark:bg-white/[0.04]">
                {language && (
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.09em] text-accent-ink dark:text-accent-ink-dark">
                        {language}
                    </span>
                )}
                {file && (
                    <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{file}</span>
                )}
                <span className="flex-1" />
                <button
                    type="button"
                    onClick={copy}
                    className="flex items-center gap-1.5 px-1 py-0.5 text-[12.5px] text-gray-600 dark:text-gray-400 hover:text-accent-ink dark:hover:text-accent-ink-dark transition-colors"
                >
                    {copied ? <Check size={13} className="text-manjaro-green" /> : <Copy size={13} />}
                    {copied ? t('guides.article.code.copied') : t('guides.article.code.copy')}
                </button>
            </div>
            <pre
                {...rest}
                ref={preRef}
                className="m-0 px-[18px] py-4 overflow-x-auto font-mono text-[13.5px] leading-[1.75] text-gray-800 dark:text-gray-300"
            >
                {children}
            </pre>
        </div>
    );
};

export default CodeBlock;
