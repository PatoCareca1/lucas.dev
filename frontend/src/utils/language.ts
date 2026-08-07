/** Collapses any i18next language tag (e.g. "pt-BR", "en-US") to the two
 * locales the backend actually stores content in. */
export const normalizeLanguage = (language: string): string => (language.startsWith('pt') ? 'pt' : 'en');
