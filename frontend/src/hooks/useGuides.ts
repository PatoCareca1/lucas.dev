import { useCallback, useEffect, useState } from 'react';
import { fetchGuides, normalizeLanguage } from '../api/guidesApi';
import type { Guide } from '../types/guide';

export type GuidesStatus = 'loading' | 'ready' | 'error';

interface UseGuidesResult {
    guides: Guide[];
    status: GuidesStatus;
    retry: () => void;
}

// Module-level cache: the guide list (with body) is fetched once per
// language and shared by every consumer (list page, article page, search),
// instead of each hook instance re-fetching the same data.
const cache = new Map<string, Promise<Guide[]>>();

const loadGuides = (language: string): Promise<Guide[]> => {
    let pending = cache.get(language);
    if (!pending) {
        pending = fetchGuides(language).catch((error: unknown) => {
            cache.delete(language);
            throw error;
        });
        cache.set(language, pending);
    }
    return pending;
};

interface Resolved {
    key: string;
    guides: Guide[];
    status: GuidesStatus;
}

const INITIAL: Resolved = { key: '', guides: [], status: 'loading' };

export const useGuides = (language: string): UseGuidesResult => {
    const lang = normalizeLanguage(language);
    const [attempt, setAttempt] = useState(0);
    const key = `${lang}:${attempt}`;

    const [resolved, setResolved] = useState<Resolved>(INITIAL);

    useEffect(() => {
        let active = true;

        loadGuides(lang)
            .then((data) => {
                if (active) setResolved({ key, guides: data, status: 'ready' });
            })
            .catch(() => {
                if (active) setResolved({ key, guides: [], status: 'error' });
            });

        return () => {
            active = false;
        };
    }, [lang, key]);

    // While the effect above is still resolving for the current (language,
    // attempt) pair, `resolved` still holds the previous key's outcome —
    // report "loading" without calling setState from inside the effect.
    const isCurrent = resolved.key === key;

    const retry = useCallback(() => setAttempt((value) => value + 1), []);

    return {
        guides: isCurrent ? resolved.guides : [],
        status: isCurrent ? resolved.status : 'loading',
        retry,
    };
};
