import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Target, Server, Award, Code2 } from 'lucide-react';
import chibiSenior from '../assets/chibi_senior.png';

interface ProjectModalProps {
    projectKey: string | null;
    onClose: () => void;
}

// Color mapping for tech badges
const techColors: Record<string, string> = {
    'Django Ninja': 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    'PostgreSQL': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
    'Pandas': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700',
    'Docker': 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700',
    'Celery': 'bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-900/40 dark:text-lime-300 dark:border-lime-700',
    'Redis': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
    'Python': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700',
    'Flask': 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-600',
    'jQuery': 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700',
    'Bootstrap': 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700',
    'SQLite': 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700',
};

const defaultBadge = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-600';

const ProjectModal: React.FC<ProjectModalProps> = ({ projectKey, onClose }) => {
    const { t } = useTranslation();

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (projectKey) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [projectKey, onClose]);

    if (!projectKey) return null;

    const title = t(`projects.${projectKey}.title`);
    const tag = t(`projects.${projectKey}.tag`);
    const challenge = t(`projects.${projectKey}.challenge`);
    const solution = t(`projects.${projectKey}.solution`);
    const impactList = t(`projects.${projectKey}.impact`, { returnObjects: true }) as string[];
    const techStack = t(`projects.${projectKey}.tech_stack`, { returnObjects: true }) as string[];

    return (
        <AnimatePresence>
            {projectKey && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl
                            bg-white/95 text-slate-900 border border-slate-200 shadow-2xl
                            dark:bg-slate-900/90 dark:text-gray-100 dark:border-manjaro-green/20 dark:shadow-none
                            backdrop-blur-xl z-10"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-t-3xl">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-manjaro-green to-teal-400 truncate">
                                        {title}
                                    </h2>
                                    <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-manjaro-green/10 text-manjaro-green border border-manjaro-green/30">
                                        {tag}
                                    </span>
                                </div>

                                {/* Chibi Pro Validator */}
                                <div className="hidden sm:flex items-center gap-2 shrink-0">
                                    <img
                                        src={chibiSenior}
                                        alt="Chibi Pro"
                                        className="w-16 h-16 object-contain drop-shadow-lg"
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                    <span className="text-[10px] font-bold text-manjaro-green/70 dark:text-manjaro-green/50 uppercase tracking-widest writing-vertical rotate-0 leading-tight">
                                        PRO<br />✓
                                    </span>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="ml-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                                aria-label={t('projects.close')}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-8 space-y-10">
                            {/* Challenge Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
                                        <Target className="text-orange-500" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('projects.sections.challenge')}
                                    </h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg pl-12">
                                    {challenge}
                                </p>
                            </section>

                            {/* Solution Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                        <Server className="text-blue-500" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('projects.sections.solution')}
                                    </h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg pl-12">
                                    {solution}
                                </p>
                            </section>

                            {/* Impact Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                                        <Award className="text-yellow-500" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('projects.sections.impact')}
                                    </h3>
                                </div>
                                <ul className="space-y-3 pl-12">
                                    {impactList.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-lg">
                                            <span className="text-manjaro-green mt-1 shrink-0">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Tech Stack Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                                        <Code2 className="text-violet-500" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('projects.sections.tech_stack')}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-12">
                                    {techStack.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-transform hover:scale-105 ${techColors[tech] || defaultBadge}`}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
