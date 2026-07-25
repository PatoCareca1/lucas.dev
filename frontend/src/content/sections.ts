import GithubSlugger from 'github-slugger';
import type { GuideSection } from '../types/guide';

const HEADING = /^##\s+(.+)$/;
const FENCE = /^\s*```/;

export const stripInlineMarkdown = (value: string): string =>
    value
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .trim();

export const extractSections = (body: string): GuideSection[] => {
    const slugger = new GithubSlugger();
    const sections: GuideSection[] = [];
    let current: GuideSection | null = null;
    let inFence = false;

    for (const line of body.split('\n')) {
        if (FENCE.test(line)) {
            inFence = !inFence;
        }

        const match = inFence ? null : line.match(HEADING);

        if (match) {
            if (current) sections.push(current);
            const heading = stripInlineMarkdown(match[1]);
            current = { anchor: slugger.slug(heading), heading, content: '' };
            continue;
        }

        if (current) current.content += `${line}\n`;
    }

    if (current) sections.push(current);
    return sections;
};

export const toPlainText = (markdown: string): string =>
    stripInlineMarkdown(
        markdown
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/^>\s*\[![a-z]+\]\s*$/gim, ' ')
            .replace(/^[>\-*]\s?/gm, '')
            .replace(/\s+/g, ' '),
    );

export const normalizeText = (value: string): string =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
