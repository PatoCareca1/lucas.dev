const LOCALES: Record<string, string> = { pt: 'pt-BR', en: 'en-US' };

const toLocale = (language: string): string => (language.startsWith('pt') ? LOCALES.pt : LOCALES.en);

export const formatLongDate = (value: string | null, language: string): string => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat(toLocale(language), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date);
};

export const formatShortDate = (value: string | null, language: string): string => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat(toLocale(language), {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date);
};

export const formatCount = (value: number, language: string): string =>
    new Intl.NumberFormat(toLocale(language)).format(value);

export const chapterNumber = (chapter: number): string => String(chapter).padStart(2, '0');
