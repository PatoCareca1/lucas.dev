import { useCallback, useEffect, useRef, useState } from 'react';
import { searchGuides } from '../api/guidesClient';
import type { GuideSearchHit } from '../types/guide';

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

export const useGuideSearch = (language: string): UseGuideSearchResult => {
    const [query, setQueryValue] = useState('');
    const [status, setStatus] = useState<SearchStatus>('idle');
    const [results, setResults] = useState<GuideSearchHit[]>([]);
    const [attempt, setAttempt] = useState(0);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!query.trim()) return;

        let active = true;

        timer.current = window.setTimeout(() => {
            searchGuides(query, language)
                .then((hits) => {
                    if (!active) return;
                    setResults(hits);
                    setStatus(hits.length ? 'results' : 'empty');
                })
                .catch(() => {
                    if (!active) return;
                    setResults([]);
                    setStatus('error');
                });
        }, DEBOUNCE_MS);

        return () => {
            active = false;
            window.clearTimeout(timer.current);
        };
    }, [query, language, attempt]);

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
