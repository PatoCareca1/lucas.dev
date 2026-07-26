import { getGuides } from '../content/loader';
import { extractSections, normalizeText, toPlainText } from '../content/sections';
import type { Guide, GuideSearchHit } from '../types/guide';

const FEEDBACK_KEY = 'guides.feedback';
const ANSWERED_KEY = 'guides.feedback.answered';
const EXCERPT_RADIUS = 90;

export type FeedbackVerdict = 'helpful' | 'missing';

export interface GuideFeedbackEntry {
    slug: string;
    language: string;
    verdict: FeedbackVerdict;
    note: string;
    createdAt: string;
}

export class GuideStorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GuideStorageError';
    }
}

const readStore = <T>(storage: Storage, key: string, fallback: T): T => {
    try {
        const raw = storage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        throw new GuideStorageError(`unable to read ${key}`);
    }
};

const writeStore = (storage: Storage, key: string, value: unknown): void => {
    try {
        storage.setItem(key, JSON.stringify(value));
    } catch {
        throw new GuideStorageError(`unable to write ${key}`);
    }
};

const buildExcerpt = (content: string, needle: string): string => {
    const plain = toPlainText(content);
    const at = normalizeText(plain).indexOf(needle);
    if (at < 0) return plain.slice(0, EXCERPT_RADIUS * 2).trim();

    let start = Math.max(0, at - EXCERPT_RADIUS);
    let end = Math.min(plain.length, at + needle.length + EXCERPT_RADIUS);

    if (start > 0) {
        const boundary = plain.indexOf(' ', start);
        if (boundary >= 0 && boundary < at) start = boundary + 1;
    }

    if (end < plain.length) {
        const boundary = plain.lastIndexOf(' ', end);
        if (boundary > at + needle.length) end = boundary;
    }

    const slice = plain.slice(start, end).trim();

    return `${start > 0 ? '…' : ''}${slice}${end < plain.length ? '…' : ''}`;
};

export const searchGuides = async (query: string, language: string): Promise<GuideSearchHit[]> => {
    const needle = normalizeText(query.trim());
    if (!needle) return [];

    const hits: GuideSearchHit[] = [];

    for (const guide of getGuides(language)) {
        if (!guide.published) continue;

        for (const section of extractSections(guide.body)) {
            const haystack = normalizeText(`${section.heading} ${toPlainText(section.content)}`);
            if (!haystack.includes(needle)) continue;

            hits.push({
                slug: guide.slug,
                chapter: guide.chapter,
                section: section.heading,
                anchor: section.anchor,
                excerpt: buildExcerpt(section.content, needle),
            });
        }
    }

    return hits;
};

export const fetchRelatedGuides = (slug: string, language: string): Guide[] => {
    const guides = getGuides(language);
    const current = guides.find((guide) => guide.slug === slug);
    if (!current) return [];

    return guides
        .filter((guide) => guide.slug !== slug)
        .map((guide) => ({
            guide,
            overlap: guide.stack.filter((item) => current.stack.includes(item)).length,
        }))
        .sort((a, b) => b.overlap - a.overlap || a.guide.chapter - b.guide.chapter)
        .map((entry) => entry.guide);
};

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
    const entries = readStore<GuideFeedbackEntry[]>(localStorage, FEEDBACK_KEY, []);
    entries.push({ slug, language, verdict, note, createdAt: new Date().toISOString() });
    writeStore(localStorage, FEEDBACK_KEY, entries);
    markAnswered(slug);
};
