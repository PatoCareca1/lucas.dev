import { postGuideFeedback, type FeedbackVerdict } from './guidesApi';

const ANSWERED_KEY = 'guides.feedback.answered';

export type { FeedbackVerdict };

export class GuideStorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GuideStorageError';
    }
}

/** Whether this browser already answered the feedback prompt for a guide.
 * Purely a local UX nicety (avoid re-asking) — the actual feedback lives in
 * the backend now, not here. */
export const hasAnsweredFeedback = (slug: string): boolean => {
    try {
        return sessionStorage.getItem(`${ANSWERED_KEY}.${slug}`) === '1';
    } catch {
        return false;
    }
};

const markAnswered = (slug: string): void => {
    try {
        sessionStorage.setItem(`${ANSWERED_KEY}.${slug}`, '1');
    } catch {
        throw new GuideStorageError('unable to persist feedback state');
    }
};

export const submitGuideFeedback = async (
    slug: string,
    language: string,
    verdict: FeedbackVerdict,
    note: string,
): Promise<void> => {
    await postGuideFeedback(slug, language, verdict, note);
    markAnswered(slug);
};
