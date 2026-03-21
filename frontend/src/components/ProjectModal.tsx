import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Target, Server, Award, Code2, ExternalLink } from 'lucide-react';
import chibiPro from '../assets/chibi_senior.png';
import chibiYoung from '../assets/chibi_young.png';
import hackathonImg from '../assets/hackathon.png';

interface ProjectModalProps {
    projectKey: string | null;
    onClose: () => void;
}

// Color mapping for tech badges
const techColors: Record<string, string> = {
    'Django': 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    'Django Ninja': 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    'DRF': 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700',
    'PostgreSQL': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
    'Pandas': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700',
    'Docker': 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700',
    'Celery': 'bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-900/40 dark:text-lime-300 dark:border-lime-700',
    'RabbitMQ': 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700',
    'Redis': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
    'Python': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700',
    'Flask': 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-600',
    'jQuery': 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700',
    'Bootstrap': 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700',
    'SQLite': 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700',
    'GitLab CI': 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
    'C': 'bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-700',
    'GCC': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 dark:border-fuchsia-700',
    'Make': 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700',
    'Linux/WSL API': 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-700/60 dark:text-slate-200 dark:border-slate-500',
    'REST Framework': 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700',
    'Graphene (GraphQL)': 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-700',
    'Tailwind CSS': 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700',
};

const defaultBadge = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-600';

// Gradient accents per project for the visual panel
const panelGradients: Record<string, string> = {
    plp: 'from-emerald-600 via-teal-500 to-cyan-400',
    prp: 'from-blue-600 via-indigo-500 to-purple-400',
    crowdless: 'from-amber-500 via-orange-400 to-rose-400',
    miniShell: 'from-zinc-600 via-zinc-500 to-neutral-400',
    fitTrack: 'from-indigo-600 via-blue-500 to-cyan-400',
};

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
    const siteUrl = t(`projects.${projectKey}.site_url`, { defaultValue: '#' });
    const disclaimer = t(`projects.${projectKey}.disclaimer`, { defaultValue: '' });
    const linkLabel = t(`projects.${projectKey}.link_label`, { defaultValue: t('projects.visit_site') });
    const quote = t(`projects.${projectKey}.quote`, { defaultValue: '' });
    const solutionDetails = t(`projects.${projectKey}.solution_details`, { returnObjects: true, defaultValue: null }) as Record<string, { label: string; text: string }> | null;
    const hasSolutionDetails = solutionDetails && typeof solutionDetails === 'object' && !Array.isArray(solutionDetails) && Object.keys(solutionDetails).length > 0;

    const modalContent = (
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
                        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl
                            bg-white/95 text-slate-900 border border-slate-200 shadow-2xl
                            dark:bg-slate-900/90 dark:text-gray-100 dark:border-manjaro-green/20 dark:shadow-none
                            backdrop-blur-xl z-10"
                    >
                        {/* Close button — always visible */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-30 p-2.5 rounded-full
                                bg-white/80 hover:bg-slate-100 text-slate-600
                                dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300
                                shadow-md transition-colors"
                            aria-label={t('projects.close')}
                        >
                            <X size={20} />
                        </button>

                        {/* Two-column layout: Visual panel (left) + Content (right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-5">

                            {/* === LEFT COLUMN: Visual / Architecture Panel === */}
                            <div className={`lg:col-span-2 relative overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none
                                bg-gradient-to-br ${panelGradients[projectKey] || 'from-slate-600 to-slate-400'}
                                flex flex-col items-center justify-center p-8 lg:p-10 min-h-[280px] lg:min-h-0`}
                            >
                                {/* Decorative circles */}
                                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />

                                {/* Project tag badge */}
                                <span className="relative inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full
                                    bg-white/20 text-white border border-white/30 backdrop-blur-sm mb-6">
                                    {tag}
                                </span>

                                {/* Title on the panel */}
                                <h2 className="relative text-2xl sm:text-3xl font-extrabold text-white text-center leading-tight mb-8">
                                    {title}
                                </h2>

                                {/* Tech stack badges on panel */}
                                <div className="relative flex flex-wrap justify-center gap-2 mb-8">
                                    {techStack.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-full text-xs font-semibold
                                                bg-white/15 text-white/90 border border-white/25 backdrop-blur-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <a
                                    href={siteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl
                                        bg-white text-slate-800 font-bold text-sm
                                        hover:bg-white/90 hover:scale-105
                                        shadow-lg transition-all duration-200"
                                >
                                    <ExternalLink size={16} />
                                    {linkLabel}
                                </a>

                                {/* Disclaimer footnote */}
                                {disclaimer && (
                                    <p className="relative mt-4 text-[11px] text-white/70 italic text-center max-w-[260px] leading-relaxed">
                                        {disclaimer}
                                    </p>
                                )}
                            </div>

                            {/* === RIGHT COLUMN: Content === */}
                            <div className="lg:col-span-3 px-8 py-8 lg:py-10 space-y-8">

                                {/* Section: Challenge */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
                                            <Target className="text-orange-500" size={22} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {t('projects.sections.challenge')}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-11">
                                        {challenge}
                                    </p>
                                </section>

                                {/* Section: Solution */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                            <Server className="text-blue-500" size={22} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {t('projects.sections.solution')}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-11">
                                        {solution}
                                    </p>

                                    {/* Solution subcategories (when available) */}
                                    {hasSolutionDetails && (
                                        <div className="mt-5 pl-11 space-y-3">
                                            {Object.entries(solutionDetails).map(([key, detail]) => (
                                                <div key={key} className="flex items-start gap-3">
                                                    <span className="mt-1.5 w-2 h-2 rounded-full bg-manjaro-green shrink-0" />
                                                    <div>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                                            {detail.label}:
                                                        </span>
                                                        <span className="text-slate-600 dark:text-slate-400 text-sm ml-1">
                                                            {detail.text}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* Section: Impact */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                                            <Award className="text-yellow-500" size={22} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {t('projects.sections.impact')}
                                        </h3>
                                    </div>
                                    <ul className="space-y-2.5 pl-11">
                                        {impactList.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                                <span className="text-manjaro-green mt-0.5 shrink-0">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* Quote */}
                                {quote && (
                                    <blockquote className="border-l-4 border-manjaro-green pl-5 my-6">
                                        <p className="text-[15px] font-medium italic text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {quote}
                                        </p>
                                    </blockquote>
                                )}

                                {/* Main Image (if Crowdless) */}
                                {projectKey === 'crowdless' && (
                                    <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 my-6">
                                        <img src={hackathonImg} alt="Hackathon Certificate" className="w-full h-auto object-cover" />
                                    </div>
                                )}

                                {/* Tech Stack inline (right side, compact) */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                                            <Code2 className="text-violet-500" size={22} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {t('projects.sections.tech_stack')}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pl-11">
                                        {techStack.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-3 py-1 rounded-full text-sm font-semibold border transition-transform hover:scale-105 ${techColors[tech] || defaultBadge}`}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                {/* Chibi Signature */}
                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-manjaro-green/60 dark:text-manjaro-green/40 uppercase tracking-widest leading-tight text-right">
                                        {['miniShell', 'fitTrack'].includes(projectKey) ? 'YOUNG' : 'PRO'}<br />✓
                                    </span>
                                    <img
                                        src={['miniShell', 'fitTrack'].includes(projectKey) ? chibiYoung : chibiPro}
                                        alt={['miniShell', 'fitTrack'].includes(projectKey) ? 'Chibi Young' : 'Chibi Pro'}
                                        className="w-14 h-14 object-contain drop-shadow-lg opacity-80 hover:opacity-100 transition-opacity"
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};

export default ProjectModal;
