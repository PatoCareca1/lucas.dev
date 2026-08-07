import { httpGet } from './http';
import { normalizeLanguage } from '../utils/language';
import type { Project, ProjectSolutionDetail } from '../types/project';

/** Shape returned by the Django Ninja `/api/projects` endpoints — snake_case,
 * matching `backend/projects/schemas.py`. */
interface ProjectPayload {
    slug: string;
    title: string;
    tag: string;
    short_desc: string;
    challenge: string;
    solution: string;
    solution_details: Record<string, ProjectSolutionDetail>;
    impact: string[];
    tech_stack: string[];
    site_url: string | null;
    repo_url: string | null;
    disclaimer: string;
    quote: string;
    link_label: string;
}

const toProject = (payload: ProjectPayload): Project => ({
    slug: payload.slug,
    title: payload.title,
    tag: payload.tag,
    shortDesc: payload.short_desc,
    challenge: payload.challenge,
    solution: payload.solution,
    solutionDetails: payload.solution_details,
    impact: payload.impact,
    techStack: payload.tech_stack,
    siteUrl: payload.site_url,
    repoUrl: payload.repo_url,
    disclaimer: payload.disclaimer,
    quote: payload.quote,
    linkLabel: payload.link_label,
});

export const fetchProjects = async (language: string): Promise<Project[]> => {
    const lang = normalizeLanguage(language);
    const payloads = await httpGet<ProjectPayload[]>(`/projects?language=${lang}`);
    return payloads.map(toProject);
};
