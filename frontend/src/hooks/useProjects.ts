import { useCallback, useEffect, useState } from 'react';
import { fetchProjects } from '../api/projectsApi';
import { normalizeLanguage } from '../utils/language';
import type { Project } from '../types/project';

export type ProjectsStatus = 'loading' | 'ready' | 'error';

interface UseProjectsResult {
    projects: Project[];
    status: ProjectsStatus;
    retry: () => void;
}

// Same shape as `useGuides`: fetched once per language and shared by every
// consumer (project grid, featured carousel, modal), instead of each one
// re-fetching the same 7 projects.
const cache = new Map<string, Promise<Project[]>>();

const loadProjects = (language: string): Promise<Project[]> => {
    let pending = cache.get(language);
    if (!pending) {
        pending = fetchProjects(language).catch((error: unknown) => {
            cache.delete(language);
            throw error;
        });
        cache.set(language, pending);
    }
    return pending;
};

interface Resolved {
    key: string;
    projects: Project[];
    status: ProjectsStatus;
}

const INITIAL: Resolved = { key: '', projects: [], status: 'loading' };

export const useProjects = (language: string): UseProjectsResult => {
    const lang = normalizeLanguage(language);
    const [attempt, setAttempt] = useState(0);
    const key = `${lang}:${attempt}`;

    const [resolved, setResolved] = useState<Resolved>(INITIAL);

    useEffect(() => {
        let active = true;

        loadProjects(lang)
            .then((data) => {
                if (active) setResolved({ key, projects: data, status: 'ready' });
            })
            .catch(() => {
                if (active) setResolved({ key, projects: [], status: 'error' });
            });

        return () => {
            active = false;
        };
    }, [lang, key]);

    const isCurrent = resolved.key === key;
    const retry = useCallback(() => setAttempt((value) => value + 1), []);

    return {
        projects: isCurrent ? resolved.projects : [],
        status: isCurrent ? resolved.status : 'loading',
        retry,
    };
};
