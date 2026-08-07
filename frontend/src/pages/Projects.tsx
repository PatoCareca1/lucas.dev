import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Layers, Loader2, RotateCw } from 'lucide-react';
import ProjectModal from '../components/ProjectModal';
import { useProjects } from '../hooks/useProjects';

// Gradient accents per project for visual variety
const cardAccents: Record<string, string> = {
    sapo: 'from-green-600 to-lime-400',
    plp: 'from-emerald-500 to-teal-400',
    prp: 'from-blue-500 to-indigo-400',
    crowdless: 'from-amber-500 to-orange-400',
    miniShell: 'from-zinc-500 to-neutral-400',
    fitTrack: 'from-indigo-500 to-cyan-400',
    cineReserve: 'from-rose-500 to-red-400',
};

const Projects: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { projects, status, retry } = useProjects(i18n.language);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    return (
        <div className="min-h-[calc(100vh-8rem)] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Layers className="text-manjaro-green" size={32} />
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-manjaro-green to-teal-400">
                            {t('projects.title')}
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
                        {t('projects.subtitle')}
                    </p>
                </motion.div>

                {status === 'loading' && (
                    <div className="flex items-center gap-3.5 max-w-xl mx-auto px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
                        <Loader2 size={18} className="text-manjaro-green animate-spin flex-none" />
                        <div className="flex-1 min-w-0">
                            <div className="text-[14.5px] font-medium text-gray-900 dark:text-gray-100">
                                {t('projects.loading.title')}
                            </div>
                            <div className="text-[13.5px] text-gray-600 dark:text-gray-400">
                                {t('projects.loading.body')}
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex items-center gap-3.5 max-w-xl mx-auto px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
                        <AlertTriangle size={18} className="text-gray-600 dark:text-gray-400 flex-none" />
                        <div className="flex-1 min-w-0">
                            <div className="text-[14.5px] font-medium text-gray-900 dark:text-gray-100">
                                {t('projects.error.title')}
                            </div>
                            <div className="text-[13.5px] text-gray-600 dark:text-gray-400">
                                {t('projects.error.body')}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={retry}
                            className="flex items-center gap-2 flex-none px-4 py-2.5 rounded-xl border border-manjaro-green/40 text-[13.5px] font-semibold text-manjaro-green hover:scale-[1.02] transition-transform"
                        >
                            <RotateCw size={14} />
                            {t('projects.error.retry')}
                        </button>
                    </div>
                )}

                {status === 'ready' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {projects.map((project, idx) => (
                            <motion.div
                                key={project.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                            >
                                <button
                                    onClick={() => setSelectedProject(project.slug)}
                                    className="w-full text-left group relative overflow-hidden rounded-2xl
                                        bg-white/95 dark:bg-slate-900/40 backdrop-blur-md
                                        border border-slate-200 dark:border-slate-800
                                        shadow-lg dark:shadow-none
                                        hover:shadow-xl hover:border-manjaro-green/50 dark:hover:border-manjaro-green/30
                                        transition-all duration-300 p-8"
                                >
                                    {/* Top gradient accent bar */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cardAccents[project.slug] || 'from-gray-500 to-gray-400'} opacity-70 group-hover:opacity-100 transition-opacity`} />

                                    {/* Tag */}
                                    <span className="inline-block px-3 py-1 font-mono text-xs font-medium rounded-full bg-manjaro-green/10 text-manjaro-green border border-manjaro-green/30 mb-4">
                                        {project.tag}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-manjaro-green transition-colors">
                                        {project.title}
                                    </h3>

                                    {/* Short description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                        {project.shortDesc}
                                    </p>

                                    {/* Tech preview chips */}
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {project.techStack.slice(0, 4).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack.length > 4 && (
                                            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500">
                                                +{project.techStack.length - 4}
                                            </span>
                                        )}
                                    </div>

                                    {/* View Project CTA */}
                                    <div className="flex items-center gap-2 text-manjaro-green font-semibold text-sm group-hover:gap-3 transition-all">
                                        {t('projects.view_project')}
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <ProjectModal
                projectKey={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </div>
    );
};

export default Projects;
