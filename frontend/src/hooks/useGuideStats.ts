import { useCallback, useEffect, useState } from 'react';
import { fetchGuideStats, recordGuideRead } from '../api/guidesClient';
import type { GuideStats } from '../types/guide';

export type AsyncStatus = 'loading' | 'success' | 'error';

interface UseGuideStatsResult {
    status: AsyncStatus;
    stats: Record<string, number>;
    retry: () => void;
    registerRead: (slug: string) => void;
}

const toMap = (entries: GuideStats[]): Record<string, number> =>
    entries.reduce<Record<string, number>>((acc, entry) => {
        acc[entry.slug] = entry.reads;
        return acc;
    }, {});

export const useGuideStats = (): UseGuideStatsResult => {
    const [status, setStatus] = useState<AsyncStatus>('loading');
    const [stats, setStats] = useState<Record<string, number>>({});
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;

        fetchGuideStats()
            .then((entries) => {
                if (!active) return;
                setStats(toMap(entries));
                setStatus('success');
            })
            .catch(() => {
                if (!active) return;
                setStatus('error');
            });

        return () => {
            active = false;
        };
    }, [attempt]);

    const retry = useCallback(() => {
        setStatus('loading');
        setAttempt((value) => value + 1);
    }, []);

    const registerRead = useCallback((slug: string) => {
        recordGuideRead(slug)
            .then((entries) => setStats(toMap(entries)))
            .catch(() => undefined);
    }, []);

    return { status, stats, retry, registerRead };
};
