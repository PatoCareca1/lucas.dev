import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle2, Loader2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useGuideFeedback } from '../../hooks/useGuideFeedback';

interface FeedbackPanelProps {
    slug: string;
    language: string;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ slug, language }) => {
    const { t } = useTranslation();
    const { stage, verdict, choose, cancel, send } = useGuideFeedback(slug, language);
    const [note, setNote] = useState('');

    return (
        <section className="px-6 py-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
            {stage === 'asking' && (
                <div>
                    <div className="font-display text-[19px] font-semibold text-gray-950 dark:text-gray-50">
                        {t('guides.article.feedback.question')}
                    </div>
                    <p className="mt-2 mb-4 text-[14.5px] text-gray-600 dark:text-gray-400">
                        {t('guides.article.feedback.subtitle')}
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                        <button
                            type="button"
                            onClick={() => choose('helpful')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-300 hover:border-manjaro-green/40 hover:text-accent-ink dark:hover:text-accent-ink-dark transition-colors"
                        >
                            <ThumbsUp size={15} />
                            {t('guides.article.feedback.yes')}
                        </button>
                        <button
                            type="button"
                            onClick={() => choose('missing')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-300 hover:border-manjaro-green/40 hover:text-accent-ink dark:hover:text-accent-ink-dark transition-colors"
                        >
                            <ThumbsDown size={15} />
                            {t('guides.article.feedback.no')}
                        </button>
                    </div>
                </div>
            )}

            {(stage === 'form' || stage === 'error') && (
                <div>
                    {stage === 'form' && (
                        <>
                            <div className="font-display text-[19px] font-semibold text-gray-950 dark:text-gray-50">
                                {verdict === 'helpful'
                                    ? t('guides.article.feedback.formTitleUp')
                                    : t('guides.article.feedback.formTitleDown')}
                            </div>
                            <p className="mt-2 mb-3.5 text-[14.5px] text-gray-600 dark:text-gray-400">
                                {t('guides.article.feedback.formHint')}
                            </p>
                        </>
                    )}

                    {stage === 'error' && (
                        <div className="flex items-center gap-3 mb-3.5">
                            <AlertCircle size={18} className="text-gray-600 dark:text-gray-400 flex-none" />
                            <div className="flex-1 min-w-0">
                                <div className="text-[15px] font-medium text-gray-950 dark:text-gray-50">
                                    {t('guides.article.feedback.errorTitle')}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('guides.article.feedback.errorBody')}
                                </div>
                            </div>
                        </div>
                    )}

                    <textarea
                        rows={3}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder={t('guides.article.feedback.notePlaceholder')}
                        className="w-full box-border resize-y px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 backdrop-blur-md text-[14.5px] text-gray-950 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-manjaro-green/40"
                    />

                    <div className="flex items-center gap-3 mt-3">
                        <button
                            type="button"
                            onClick={() => send(note)}
                            className="px-6 py-3 rounded-xl bg-manjaro-green text-white text-sm font-bold hover:bg-manjaro-green/90 hover:scale-[1.02] transition-all"
                        >
                            {stage === 'error'
                                ? t('guides.article.feedback.retry')
                                : t('guides.article.feedback.submit')}
                        </button>
                        <button
                            type="button"
                            onClick={cancel}
                            className="px-6 py-3 rounded-xl border border-manjaro-green/40 dark:border-manjaro-green/30 text-sm font-semibold text-gray-800 dark:text-gray-300 hover:text-accent-ink dark:hover:text-accent-ink-dark transition-colors"
                        >
                            {t('guides.article.feedback.cancel')}
                        </button>
                    </div>
                </div>
            )}

            {stage === 'sending' && (
                <div className="flex items-center gap-3 text-[14.5px] text-gray-600 dark:text-gray-400">
                    <Loader2 size={15} className="text-manjaro-green animate-spin" />
                    {t('guides.article.feedback.sending')}
                </div>
            )}

            {stage === 'done' && (
                <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-manjaro-green flex-none" />
                    <div>
                        <div className="text-[15px] font-medium text-gray-950 dark:text-gray-50">
                            {t('guides.article.feedback.doneTitle')}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t('guides.article.feedback.doneBody')}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default FeedbackPanel;
