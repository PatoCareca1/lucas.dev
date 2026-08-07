import { useCallback, useEffect, useRef, useState } from 'react';
import { searchGuides } from '../content/guidesQuery';
import type { Guide, GuideSearchHit } from '../types/guide';

const DEBOUNCE_MS = 300;

export type SearchStatus = 'idle' | 'loading' | 'results' | 'empty' | 'error';

interface UseGuideSearchResult {
    query: string;
    status: SearchStatus;
    results: GuideSearchHit[];
    setQuery: (value: string) => void;
    clear: () => void;
    retry: () => void;
}

/** Searches the already-loaded `guides` list (see `useGuides`). No network
 * call happens here — the debounce just keeps typing snappy and results
 * from flickering. */
export const useGuideSearch = (guides: Guide[]): UseGuideSearchResult => {
    const [query, setQueryValue] = useState('');
    const [status, setStatus] = useState<SearchStatus>('idle');
    const [results, setResults] = useState<GuideSearchHit[]>([]);
    const [attempt, setAttempt] = useState(0);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!query.trim()) return;

        let active = true;

        timer.current = window.setTimeout(() => {
            if (!active) return;
            try {
                const hits = searchGuides(guides, query);
                setResults(hits);
                setStatus(hits.length ? 'results' : 'empty');
            } catch {
                setResults([]);
                setStatus('error');
            }
        }, DEBOUNCE_MS);

        return () => {
            active = false;
            window.clearTimeout(timer.current);
        };
    }, [query, guides, attempt]);

    const setQuery = useCallback((value: string) => {
        setQueryValue(value);
        if (value.trim()) {
            setStatus('loading');
        } else {
            setStatus('idle');
            setResults([]);
        }
    }, []);

    const clear = useCallback(() => {
        setQueryValue('');
        setStatus('idle');
        setResults([]);
    }, []);

    const retry = useCallback(() => {
        setStatus('loading');
        setAttempt((value) => value + 1);
    }, []);

    return { query, status, results, setQuery, clear, retry };
};
