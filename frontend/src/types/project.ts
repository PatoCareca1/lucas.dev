export interface ProjectSolutionDetail {
    label: string;
    text: string;
}

export interface Project {
    slug: string;
    title: string;
    tag: string;
    shortDesc: string;
    challenge: string;
    solution: string;
    solutionDetails: Record<string, ProjectSolutionDetail>;
    impact: string[];
    techStack: string[];
    siteUrl: string | null;
    repoUrl: string | null;
    disclaimer: string;
    quote: string;
    linkLabel: string;
}
