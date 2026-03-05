import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Database, Code2, Terminal, Server } from 'lucide-react';

const BentoGrid: React.FC = () => {
    const { t } = useTranslation();

    const hoverTiltStyle = {
        whileHover: { scale: 1.02, rotateX: 2, rotateY: -2, transition: { duration: 0.2 } },
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 }
    };

    return (
        <div className="w-full mb-16">
            <div className="text-center md:text-left mb-8">
                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 inline-block drop-shadow-sm mb-2">
                    {t('home.skills_title')}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">

                {/* Django Block (Large) */}
                <motion.div
                    {...hoverTiltStyle}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-[#092e20]/80 to-[#12583e]/80 dark:from-[#092e20]/60 dark:to-[#0f4b33]/60 backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between border border-manjaro-green/30 shadow-lg relative overflow-hidden group"
                >
                    <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Database size={200} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/10 rounded-xl inline-flex">
                                <Database className="text-manjaro-green" size={32} />
                            </div>
                            <h4 className="text-3xl font-bold text-white">{t('bento.django')}</h4>
                        </div>
                        <p className="text-manjaro-green/80 text-sm md:text-base leading-relaxed max-w-sm mb-6">
                            {t('bento.django_desc')}
                        </p>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-[#12583e] text-manjaro-green text-xs font-bold rounded-full border border-manjaro-green/20">
                                {t('bento.django_badge')}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Python Block (Tall) */}
                <motion.div
                    {...hoverTiltStyle}
                    transition={{ delay: 0.2 }}
                    className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 bg-white/90 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-gray-700/50 shadow-sm dark:shadow-none flex flex-col justify-center relative overflow-hidden"
                >
                    <div className="flex items-start gap-4 z-10">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                            <Server size={28} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('bento.python')}</h4>
                            <p className="text-slate-600 dark:text-gray-400 text-sm w-full leading-relaxed">
                                {t('bento.python_desc')}
                            </p>
                        </div>
                    </div>
                    {/* // Easter Egg */}
                    <span className="hidden group-hover:block absolute bottom-2 right-4 text-xs text-slate-500 font-mono opacity-50">
                        import antigravity; // swoosh
                    </span>
                </motion.div>

                {/* React Block */}
                <motion.div
                    {...hoverTiltStyle}
                    transition={{ delay: 0.3 }}
                    className="col-span-1 lg:col-span-1 row-span-1 bg-white/90 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-gray-700/50 shadow-sm dark:shadow-none flex flex-col justify-center"
                >
                    <div className="mb-4 text-cyan-500">
                        <Code2 size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('bento.react')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('bento.react_desc')}
                    </p>
                </motion.div>

                {/* DevOps Block */}
                <motion.div
                    {...hoverTiltStyle}
                    transition={{ delay: 0.4 }}
                    className="col-span-1 lg:col-span-1 row-span-1 bg-white/90 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-gray-700/50 shadow-sm dark:shadow-none flex flex-col justify-between"
                >
                    <div>
                        <div className="mb-4 text-orange-500">
                            <Terminal size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('bento.devops')}</h4>
                        <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                            {t('bento.devops_desc')}
                        </p>
                    </div>
                    {/* Devops Tags */}
                    <div className="flex gap-2 mt-4 text-xs font-mono font-bold text-manjaro-green opacity-90">
                        <span>#Docker</span>
                        <span>#CI/CD</span>
                        <span>#TDD</span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default BentoGrid;
