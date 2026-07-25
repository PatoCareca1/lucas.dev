import { useCallback, useState } from 'react';
import { hasAnsweredFeedback, submitGuideFeedback, type FeedbackVerdict } from '../api/guidesClient';

export type FeedbackStage = 'asking' | 'form' | 'sending' | 'done' | 'error';

interface UseGuideFeedbackResult {
    stage: FeedbackStage;
    verdict: FeedbackVerdict | null;
    choose: (value: FeedbackVerdict) => void;
    cancel: () => void;
    send: (note: string) => void;
}

export const useGuideFeedback = (slug: string, language: string): UseGuideFeedbackResult => {
    const [stage, setStage] = useState<FeedbackStage>(() => (hasAnsweredFeedback(slug) ? 'done' : 'asking'));
    const [verdict, setVerdict] = useState<FeedbackVerdict | null>(null);

    const choose = useCallback((value: FeedbackVerdict) => {
        setVerdict(value);
        setStage('form');
    }, []);

    const cancel = useCallback(() => {
        setVerdict(null);
        setStage('asking');
    }, []);

    const send = useCallback(
        (note: string) => {
            if (!verdict) return;
            setStage('sending');

            submitGuideFeedback(slug, language, verdict, note)
                .then(() => setStage('done'))
                .catch(() => setStage('error'));
        },
        [slug, language, verdict],
    );

    return { stage, verdict, choose, cancel, send };
};
