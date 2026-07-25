export type GuideLevel = 'iniciante' | 'intermediario';

export interface GuideFrontmatter {
    slug: string;
    chapter: number;
    title: string;
    description: string;
    level: GuideLevel;
    stack: string[];
    prerequisites: string[];
    notNeeded: string[];
    readingTime: number;
    published: boolean;
    publishedAt: string | null;
    updatedAt: string | null;
    releaseDate: string | null;
    repoUrl: string | null;
}

export interface Guide extends GuideFrontmatter {
    language: string;
    body: string;
}

export interface GuideSearchHit {
    slug: string;
    chapter: number;
    section: string;
    anchor: string;
    excerpt: string;
}

export interface GuideStats {
    slug: string;
    reads: number;
}

export interface GuideSection {
    anchor: string;
    heading: string;
    content: string;
}
