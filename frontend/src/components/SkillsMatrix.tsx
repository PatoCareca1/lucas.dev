import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import chibiCoding from '../assets/chibi_stacks.png';

interface Skill {
    name: string;
    level: number; // 1 to 5
}

const hardSkills: Skill[] = [
    { name: 'Python / Django', level: 5 },
    { name: 'React / TypeScript', level: 4 },
    { name: 'Docker / DevOps', level: 4 },
    { name: 'PostgreSQL', level: 4 },
    { name: 'Pandas / ETL Pipelines', level: 4 },
    { name: 'TDD / Pytest', level: 3 },
];

const softSkills: Skill[] = [
    { name: 'Leadership (Hackathon Winner)', level: 5 },
    { name: 'Problem Solving', level: 5 },
    { name: 'Teamwork & Communication', level: 4 },
    { name: 'English (Leitura/Escrita)', level: 4 },
];

const RatingStars: React.FC<{ level: number }> = ({ level }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={16}
                    className={`${star <= level
                        ? 'fill-manjaro-green text-manjaro-green'
                        : 'text-gray-300 dark:text-gray-700'
                        }`}
                />
            ))}
        </div>
    );
};

const SkillList: React.FC<{ title: string; skills: Skill[] }> = ({ title, skills }) => (
    <div className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-slate-800 pb-4">
            {title}
        </h3>
        <ul className="space-y-4">
            {skills.map((skill, idx) => (
                <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{skill.name}</span>
                    <RatingStars level={skill.level} />
                </li>
            ))}
        </ul>
    </div>
);

const SkillsMatrix: React.FC = () => {
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

                {/* Skills column: Hard on top, Soft below */}
                <div className="flex flex-col gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <SkillList title="Hard Skills" skills={hardSkills} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <SkillList title="Soft Skills" skills={softSkills} />
                    </motion.div>
                </div>
            </div>

            {/* Proficiency Legend — full width */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-gray-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
            >
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 uppercase tracking-widest text-center border-b border-gray-200 dark:border-slate-800 pb-2">
                    Legenda de Proficiência
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2"><RatingStars level={1} /><span className="truncate">Já vi / ouvi / li</span></div>
                    <div className="flex items-center gap-2"><RatingStars level={2} /><span className="truncate">Já estudei</span></div>
                    <div className="flex items-center gap-2"><RatingStars level={3} /><span className="truncate">Já apliquei (Ready)</span></div>
                    <div className="flex items-center gap-2"><RatingStars level={4} /><span className="truncate">Muita experiência</span></div>
                    <div className="flex items-center gap-2"><RatingStars level={5} /><span className="truncate">Sei mais que o criador</span></div>
                </div>
            </motion.div>
        </div>
    );
};

export default SkillsMatrix;
