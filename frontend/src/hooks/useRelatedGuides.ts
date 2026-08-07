import { useMemo } from 'react';
import { relatedGuides } from '../content/guidesQuery';
import type { Guide } from '../types/guide';

export const useRelatedGuides = (guides: Guide[], slug: string): Guide[] =>
    useMemo(() => relatedGuides(guides, slug), [guides, slug]);
