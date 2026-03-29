import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChefHat, BookOpen } from 'lucide-react';
import gymPhoto from '../assets/gym.jpeg';
import setupPhoto from '../assets/setup.png';
import carbonara from '../assets/Carbonara.jpeg';
import livros from '../assets/Livros.jpeg';

const defaultImageClass = "w-full sm:w-48 md:w-64 aspect-square bg-gray-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative shadow-lg group border border-slate-200 dark:border-slate-700 shrink-0";
const cardClass = "flex flex-col sm:flex-row items-center gap-8 bg-white/95 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:border-manjaro-green/40 transition-colors shadow-lg dark:shadow-none";
const cardClassReverse = "flex flex-col sm:flex-row-reverse items-center gap-8 bg-white/95 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:border-manjaro-green/40 transition-colors shadow-lg dark:shadow-none";

interface BlockConfig {
    key: string;
    image?: string;
    imageAlt?: string;
    placeholderIcon?: React.ReactNode;
    reverse: boolean;
    delay: number;
}

const blocks: BlockConfig[] = [
    { key: 'training', image: gymPhoto, imageAlt: 'Gym', reverse: false, delay: 0 },
    { key: 'cooking', image: carbonara, imageAlt: 'Carbonara', reverse: true, delay: 0.1 },
    { key: 'reading', image: livros, imageAlt: 'Livros', reverse: false, delay: 0.2 },
    { key: 'games', image: setupPhoto, imageAlt: 'Setup', reverse: true, delay: 0.3 },
];

const BeyondTheCode: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="mt-32 pt-16">
            <div className="w-full text-center md:text-left mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white inline-block border-b-2 border-manjaro-green pb-2">
                    {t('offduty.title')}
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl text-justify mx-auto md:mx-0">
                    {t('offduty.subtitle')}
                </p>
            </div>

            <div className="flex flex-col gap-16">
                {blocks.map((block) => (
                    <motion.div
                        key={block.key}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: block.delay }}
                        className={block.reverse ? cardClassReverse : cardClass}
                    >
                        <div className={defaultImageClass}>
                            {block.image ? (
                                <img src={block.image} alt={block.imageAlt} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <span className="text-slate-500">{block.placeholderIcon}</span>
                                </div>
                            )}
                        </div>
                        <div className={`flex-1 space-y-4${block.reverse ? ' md:text-right' : ''}`}>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-200">
                                {t(`offduty.${block.key}.title`)}
                            </h3>
                            <p className="text-slate-700 dark:text-gray-400 text-lg leading-relaxed text-justify">
                                {t(`offduty.${block.key}.caption`)}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default BeyondTheCode;
