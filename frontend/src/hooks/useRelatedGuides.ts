import { useMemo } from 'react';
import { fetchRelatedGuides } from '../api/guidesClient';
import type { Guide } from '../types/guide';

export const useRelatedGuides = (slug: string, language: string): Guide[] =>
    useMemo(() => fetchRelatedGuides(slug, language), [slug, language]);
