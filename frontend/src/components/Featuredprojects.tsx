import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectModal from './ProjectModal';
// @ts-ignore
import crowdlessCert from '../assets/hackathon.png';



const cardAccents: Record<string, string> = {
    plp: 'from-emerald-500 to-teal-400',
    miniShell: 'from-zinc-500 to-neutral-400',
    crowdless: 'from-amber-500 to-orange-400',
    cineReserve: 'from-rose-500 to-red-400',
};

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 28 };

const FeaturedProjects: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [activeKey, setActiveKey] = useState('crowdless');
    const [queue, setQueue] = useState(['plp', 'miniShell', 'cineReserve']);
    const [carouselOffset, setCarouselOffset] = useState(0);
    const [modalProject, setModalProject] = useState<string | null>(null);

    const getVisibleCards = useCallback(() => {
        const len = queue.length;
        const result: string[] = [];
        for (let i = 0; i < len; i++) {
            const idx = ((carouselOffset + i) % len + len) % len;
            result.push(queue[idx]);
        }
        return result;
    }, [queue, carouselOffset]);

    const handleCardClick = useCallback((clickedKey: string) => {
        const clickedIdx = queue.indexOf(clickedKey);
        if (clickedIdx === -1) return;

        const prevActive = activeKey;
        const newQueue = [...queue];
        newQueue[clickedIdx] = prevActive;

        setActiveKey(clickedKey);
        setQueue(newQueue);
        setCarouselOffset(0);
    }, [queue, activeKey]);

    const visibleCards = getVisibleCards();
    const techStack = t(`projects.${activeKey}.tech_stack`, { returnObjects: true }) as string[];

    return (
        <section id="featured-projects" className="mb-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 inline-block border-b-2 border-manjaro-green pb-2">
                    {t('projects.featured_projects.title')}
                </h3>
                <button
                    onClick={() => navigate('/projects')}
                    className="hidden md:flex items-center gap-2 text-sm font-semibold text-manjaro-green hover:gap-3 transition-all"
                >
                    {t('projects.featured_projects.see_all')}
                    <ArrowRight size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-6">
                <div className="w-full bg-white/95 dark:bg-slate-900/40 border border-manjaro-green/50 dark:border-manjaro-green/40 shadow-xl dark:shadow-manjaro-green/5 rounded-2xl overflow-hidden">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${cardAccents[activeKey] || 'from-gray-500 to-gray-400'}`} />
                    <div className="p-6 md:p-8 min-h-[260px] flex flex-col md:flex-row gap-6 md:gap-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeKey}
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '-100%', opacity: 0 }}
                                transition={springTransition}
                                className="flex-1 flex flex-col"
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        {t(`projects.${activeKey}.tag`)}
                                    </span>
                                    {activeKey === 'crowdless' && (
                                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full shrink-0">
                                            <Trophy size={11} />
                                            1º Lugar
                                        </span>
                                    )}
                                </div>

                                <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug mb-4">
                                    {t(`projects.${activeKey}.title`)}
                                </h4>

                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                    {t(`projects.${activeKey}.short_desc`)}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {Array.isArray(techStack) && techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => setModalProject(activeKey)}
                                        className="w-max flex items-center gap-2 text-manjaro-green font-semibold text-sm hover:gap-3 transition-all"
                                    >
                                        {t('projects.view_project')}
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {activeKey === 'crowdless' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={springTransition}
                                className="w-full md:w-5/12 lg:w-1/3 flex-shrink-0"
                            >
                                <CertificateImage />
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="hidden md:grid grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {visibleCards.map((key) => (
                            <motion.div
                                key={key}
                                layout
                                initial={{ x: '-100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={springTransition}
                                onClick={() => handleCardClick(key)}
                                className="cursor-pointer"
                            >
                                <CarouselCard projectKey={key} t={t} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-3 gap-2 md:hidden">
                    {visibleCards.map((key) => (
                        <motion.div
                            key={key}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCardClick(key)}
                            className="cursor-pointer"
                        >
                            <MobileCard projectKey={key} t={t} />
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-6 md:hidden">
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-sm font-semibold text-manjaro-green border border-manjaro-green/40 rounded-full px-5 py-2 hover:bg-manjaro-green/10 transition-colors"
                >
                    {t('projects.featured_projects.see_all')}
                    <ArrowRight size={14} />
                </button>
            </div>

            <ProjectModal
                projectKey={modalProject}
                onClose={() => setModalProject(null)}
            />
        </section>
    );
};

const CertificateImage: React.FC = () => {
    const [imgError, setImgError] = useState(false);

    if (imgError) {
        return (
            <div className="bg-slate-800 rounded-xl w-48 h-32 flex items-center justify-center text-slate-500 text-xs">
                Certificado
            </div>
        );
    }

    return (
        <img
            src={crowdlessCert}
            alt="Certificado Crowdless Hackathon"
            onError={() => setImgError(true)}
            className="w-full h-auto rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 object-cover"
        />
    );
};

interface CarouselCardProps {
    projectKey: string;
    t: any;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ projectKey, t }) => {
    return (
        <div className="group w-full text-left bg-white/95 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 hover:border-manjaro-green/60 hover:shadow-lg dark:hover:shadow-none rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col h-full">
            <div className={`h-1.5 w-full bg-gradient-to-r ${cardAccents[projectKey] || 'from-gray-500 to-gray-400'}`} />
            <div className="p-5 flex-grow flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {t(`projects.${projectKey}.tag`)}
                    </span>
                    {projectKey === 'crowdless' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full shrink-0">
                            <Trophy size={11} />
                            1º Lugar
                        </span>
                    )}
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug">
                    {t(`projects.${projectKey}.title`)}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {t(`projects.${projectKey}.short_desc`)}
                </p>
            </div>
        </div>
    );
};

const MobileCard: React.FC<CarouselCardProps> = ({ projectKey, t }) => {
    return (
        <div className="w-full aspect-square bg-white/95 dark:bg-slate-900/40 border border-slate-700/50 hover:border-manjaro-green/60 rounded-xl overflow-hidden transition-colors duration-300 flex flex-col">
            <div className={`h-1 w-full bg-gradient-to-r ${cardAccents[projectKey] || 'from-gray-500 to-gray-400'}`} />
            <div className="p-3 flex-1 flex flex-col justify-between">
                {projectKey === 'crowdless' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        <Trophy size={10} />
                        1º Lugar
                    </span>
                ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate">
                        {t(`projects.${projectKey}.tag`)}
                    </span>
                )}
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
                    {t(`projects.${projectKey}.title`)}
                </h4>
            </div>
        </div>
    );
};

export default FeaturedProjects;