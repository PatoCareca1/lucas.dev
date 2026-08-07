import { extractSections, normalizeText, toPlainText } from './sections';
import type { Guide, GuideSearchHit } from '../types/guide';

const EXCERPT_RADIUS = 90;

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

/** Searches section headings/content of already-loaded guides. Pure and
 * synchronous — no network call, `guides` is expected to come from
 * `useGuides`, which already fetched everything (including `body`) once. */
export const searchGuides = (guides: Guide[], query: string): GuideSearchHit[] => {
    const needle = normalizeText(query.trim());
    if (!needle) return [];

    const hits: GuideSearchHit[] = [];

    for (const guide of guides) {
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

export const relatedGuides = (guides: Guide[], slug: string): Guide[] => {
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
