export const routePaths = {
    projects: { pt: '/projects', en: '/projects' },
    services: { pt: '/servicos', en: '/services' },
    guides: { pt: '/guias', en: '/guides' },
} as const;

export type RouteKey = keyof typeof routePaths;

export const resolvePath = (key: RouteKey, language: string): string =>
    language.startsWith('pt') ? routePaths[key].pt : routePaths[key].en;

export const resolveGuidePath = (slug: string, language: string): string =>
    `${resolvePath('guides', language)}/${slug}`;
