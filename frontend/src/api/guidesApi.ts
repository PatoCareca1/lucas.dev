import { httpGet, httpPost } from './http';
import { normalizeLanguage } from '../utils/language';
import type { Guide, GuideLevel } from '../types/guide';

export type FeedbackVerdict = 'helpful' | 'missing';

/** Shape returned by the Django Ninja `/api/guides` endpoints — snake_case,
 * matching `backend/guides/schemas.py`. */
interface GuidePayload {
    slug: string;
    language: string;
    chapter: number;
    title: string;
    description: string;
    level: string;
    stack: string[];
    prerequisites: string[];
    not_needed: string[];
    reading_time: number;
    published: boolean;
    published_at: string | null;
    updated_at: string | null;
    release_date: string | null;
    repo_url: string | null;
    body: string;
}

const toGuide = (payload: GuidePayload): Guide => ({
    slug: payload.slug,
    language: payload.language,
    chapter: payload.chapter,
    title: payload.title,
    description: payload.description,
    level: payload.level as GuideLevel,
    stack: payload.stack,
    prerequisites: payload.prerequisites,
    notNeeded: payload.not_needed,
    readingTime: payload.reading_time,
    published: payload.published,
    publishedAt: payload.published_at,
    updatedAt: payload.updated_at,
    releaseDate: payload.release_date,
    repoUrl: payload.repo_url,
    body: payload.body,
});

export const fetchGuides = async (language: string): Promise<Guide[]> => {
    const lang = normalizeLanguage(language);
    const payloads = await httpGet<GuidePayload[]>(`/guides?language=${lang}`);
    return payloads.map(toGuide).sort((a, b) => a.chapter - b.chapter);
};

export const postGuideFeedback = (
    slug: string,
    language: string,
    verdict: FeedbackVerdict,
    note: string,
): Promise<{ status: 'ok' }> =>
    httpPost(`/guides/${slug}/feedback?language=${normalizeLanguage(language)}`, { verdict, note });
