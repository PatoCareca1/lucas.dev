import type { Guide, GuideFrontmatter } from '../types/guide';

interface ParsedMarkdown {
    data: GuideFrontmatter;
    content: string;
}

const modules = import.meta.glob<ParsedMarkdown>('./guides/*/*.md', { import: 'default', eager: true });

const parseLanguage = (path: string): string => path.split('/')[2];

const toGuide = (path: string, parsed: ParsedMarkdown): Guide => ({
    ...parsed.data,
    language: parseLanguage(path),
    body: parsed.content,
});

const guides: Guide[] = Object.entries(modules)
    .map(([path, parsed]) => toGuide(path, parsed))
    .sort((a, b) => a.chapter - b.chapter);

export const normalizeLanguage = (language: string): string => (language.startsWith('pt') ? 'pt' : 'en');

export const getGuides = (language: string): Guide[] =>
    guides.filter((guide) => guide.language === normalizeLanguage(language));

export const getGuideBySlug = (slug: string, language: string): Guide | undefined =>
    getGuides(language).find((guide) => guide.slug === slug);
