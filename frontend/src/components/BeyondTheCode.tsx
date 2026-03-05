import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import gymPhoto from '../assets/gym.jpeg';
import setupPhoto from '../assets/setup.png';
import mariliaPhoto from '../assets/marilia.jpg';

const defaultImageClass = "w-full sm:w-48 md:w-64 aspect-square bg-gray-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative shadow-lg group border border-slate-200 dark:border-slate-700 shrink-0";
const cardClass = "flex flex-col sm:flex-row items-center gap-8 bg-white/95 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:border-manjaro-green/40 transition-colors shadow-lg dark:shadow-none";
const cardClassReverse = "flex flex-col sm:flex-row-reverse items-center gap-8 bg-white/95 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:border-manjaro-green/40 transition-colors shadow-lg dark:shadow-none";

const BeyondTheCode: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="mt-32 pt-16">
            <div className="w-full text-center md:text-left mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white inline-block border-b-2 border-manjaro-green pb-2">
                    {t('offduty.title')}
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    {t('offduty.subtitle')}
                </p>
            </div>

            <div className="flex flex-col gap-16">

                {/* Block 1: Treino / Disciplina */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className={cardClass}
                >
                    <div className={defaultImageClass}>
                        <img src={gymPhoto} alt="Gym" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-200">
                            {t('offduty.training.title')}
                        </h3>
                        <p className="text-slate-700 dark:text-gray-400 text-lg leading-relaxed">
                            {t('offduty.training.caption')}
                        </p>
                    </div>
                </motion.div>

                {/* Block 2: Games / Estratégia */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className={cardClassReverse}
                >
                    <div className={defaultImageClass}>
                        <img src={setupPhoto} alt="Setup" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-4 md:text-right">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-200">
                            {t('offduty.games.title')}
                        </h3>
                        <p className="text-slate-700 dark:text-gray-400 text-lg leading-relaxed">
                            {t('offduty.games.caption')}
                        </p>
                    </div>
                </motion.div>

                {/* Block 3: Família / Parceria */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className={cardClass}
                >
                    <div className={defaultImageClass}>
                        <img src={mariliaPhoto} alt="Marília" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-200">
                            {t('offduty.marilia.title')}
                        </h3>
                        <p className="text-slate-700 dark:text-gray-400 text-lg leading-relaxed">
                            {t('offduty.marilia.caption')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BeyondTheCode;
