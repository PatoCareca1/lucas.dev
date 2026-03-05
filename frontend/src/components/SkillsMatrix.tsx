import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import chibiCoding from '../assets/chibi_stacks.png';

interface Skill {
    key: string;
    level: number; // 1 to 5
}

const hardSkills: Skill[] = [
    { key: 'python', level: 5 },
    { key: 'api', level: 4 },
    { key: 'postgres', level: 4 },
    { key: 'etl', level: 4 },
    { key: 'docker', level: 4 },
    { key: 'react', level: 4 },
    { key: 'testing', level: 3 },
];

const softSkills: Skill[] = [
    { key: 'leadership', level: 5 },
    { key: 'problem', level: 5 },
    { key: 'teamwork', level: 4 },
    { key: 'english', level: 4 },
];

const RatingStars: React.FC<{ level: number }> = ({ level }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                size={16}
                className={star <= level
                    ? 'fill-manjaro-green text-manjaro-green'
                    : 'text-gray-300 dark:text-gray-700'}
            />
        ))}
    </div>
);

const SkillList: React.FC<{ title: string; skills: Skill[]; type: 'hard' | 'soft' }> = ({ title, skills, type }) => {
    const { t } = useTranslation();
    return (
        <div className="p-6 bg-white/95 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-lg dark:shadow-none">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                {title}
            </h3>
            <ul className="space-y-5">
                {skills.map((skill, idx) => (
                    <li key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                        <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-gray-200 font-medium leading-snug">
                                {t(`skills.${type}.${skill.key}.name`)}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                                {t(`skills.${type}.${skill.key}.desc`)}
                            </span>
                        </div>
                        <div className="flex-shrink-0 mt-1">
                            <RatingStars level={skill.level} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SkillsMatrix: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="my-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 mb-8">
                {/* Chibi character column */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center bg-transparent order-first"
                >
                    <img
                        src={chibiCoding}
                        alt="Chibi coding character"
                        className="object-contain w-full max-h-[480px]"
                    />
                </motion.div>

                {/* Skills column */}
                <div className="flex flex-col gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <SkillList title={t('skills.hard_skills_title')} skills={hardSkills} type="hard" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <SkillList title={t('skills.soft_skills_title')} skills={softSkills} type="soft" />
                    </motion.div>
                </div>
            </div>

            {/* Proficiency Legend — full width */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/95 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl shadow-lg dark:shadow-none"
            >
                <h4 className="text-sm font-bold text-slate-800 dark:text-gray-200 mb-4 uppercase tracking-widest text-center border-b border-slate-200 dark:border-slate-800 pb-2">
                    {t('skills.legend_title')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-gray-400">
                    <div className="flex items-center gap-2"><RatingStars level={1} /><span>{t('skills.legend.star_1')}</span></div>
                    <div className="flex items-center gap-2"><RatingStars level={2} /><span>{t('skills.legend.star_2')}</span></div>
                    <div className="flex items-center gap-2"><RatingStars level={3} /><span>{t('skills.legend.star_3')}</span></div>
                    <div className="flex items-center gap-2"><RatingStars level={4} /><span>{t('skills.legend.star_4')}</span></div>
                    <div className="flex items-center gap-2"><RatingStars level={5} /><span>{t('skills.legend.star_5')}</span></div>
                </div>
            </motion.div>
        </div>
    );
};

export default SkillsMatrix;
