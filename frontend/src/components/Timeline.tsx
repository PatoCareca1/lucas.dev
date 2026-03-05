import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Briefcase, GraduationCap, Trophy } from 'lucide-react';
import chibiSenior from '../assets/chibi_senior.png';
import chibiYoung from '../assets/chibi_young.png';



interface InfoCard {
    key: string;
}

interface TimelineRow {
    year: string;
    experience?: InfoCard;
    education?: InfoCard;
}

const timelineData: TimelineRow[] = [
    { year: '2026', education: { key: 'ufrn' } },
    { year: '2025 — Atual', experience: { key: 'sethas' } },
    { year: '2023 — 2024', experience: { key: '4pump' } },
    { year: '2022', education: { key: 'uern' } },
    { year: '2021', experience: { key: 'searh' }, education: { key: 'hackathon' } },
    { year: '2016', education: { key: 'ifba' } },
];

// ─── Deep Dive Renderer ───────────────────────────────────────────────────────

const DeepDiveContent: React.FC<{ eventKey: string }> = ({ eventKey }) => {
    const { t } = useTranslation();
    const basePath = `timeline.events.${eventKey}.deepDive`;

    const responsibilities = t(`${basePath}.responsibilities`, { returnObjects: true }) as string[];
    const impact = t(`${basePath}.impact`, { returnObjects: true }) as string[];

    // Stack is not in JSON directly, but we can pass it down as hardcoded technology tags
    // Or we keep stacks in the component if they are not translation dependent
    // Let's create an external map for stack tags since they're proper nouns.
    const stacksMap: Record<string, string[]> = {
        'ufrn': ['Python', 'React', 'TypeScript'],
        'sethas': ['Python', 'Django', 'PostgreSQL', 'Pandas', 'Linux'],
        '4pump': ['Python', 'React', 'TypeScript', 'PostgreSQL'],
        'searh': ['Windows', 'Linux', 'Redes']
    };
    const stack = stacksMap[eventKey] || [];

    const linkLabel = t(`${basePath}.linkLabel`, { defaultValue: '' });

    return (
        <div className="space-y-4 text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
            <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">
                    {t('timeline.labels.context')}
                </span>
                <p>{t(`${basePath}.context`)}</p>
            </div>

            <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">
                    {t('timeline.labels.responsibilities')}
                </span>
                <ul className="list-disc list-inside space-y-1">
                    {responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                    ))}
                </ul>
            </div>

            {stack.length > 0 && (
                <div>
                    <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">
                        Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {stack.map((s, i) => (
                            <span
                                key={i}
                                className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-800 border border-slate-200 dark:bg-manjaro-green/10 dark:text-manjaro-green dark:border-manjaro-green/20 font-mono font-medium shadow-sm"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">
                    {t('timeline.labels.impact')}
                </span>
                <ul className="list-disc list-inside space-y-1">
                    {impact.map((imp, i) => (
                        <li key={i}>{imp}</li>
                    ))}
                </ul>
            </div>

            {linkLabel && eventKey === 'hackathon' && (
                <div className="pt-1">
                    <a
                        href="https://portal.ifba.edu.br/jequie/noticias/2021/agosto/equipe-do-ifba-jequie-e-campea-do-hackathon-juventudes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-500 underline underline-offset-2 transition-colors"
                    >
                        {linkLabel} ↗
                    </a>
                </div>
            )}
        </div>
    );
};

// ─── Event Card ───────────────────────────────────────────────────────────────

const EventCard: React.FC<{ data?: InfoCard; type: 'exp' | 'edu' }> = ({ data, type }) => {
    const [expanded, setExpanded] = useState(false);
    const { t } = useTranslation();

    if (!data) {
        return (
            <div className="hidden md:flex h-full min-h-[120px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/50 bg-slate-50/20 dark:bg-slate-900/10 opacity-40">
                <span className="text-slate-300 dark:text-gray-700 text-sm select-none">—</span>
            </div>
        );
    }

    const isExp = type === 'exp';
    const basePath = `timeline.events.${data.key}`;
    const highlights = t(`${basePath}.highlights`, { returnObjects: true }) as string[];

    // Safely check what kind of icon to display depending on the ID
    const Icon = isExp
        ? Briefcase
        : data.key === 'hackathon'
            ? Trophy
            : GraduationCap;

    return (
        <div
            className={`p-6 rounded-2xl bg-white/95 dark:bg-slate-900/40 backdrop-blur-md shadow-lg dark:shadow-none border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors relative group w-full h-full flex flex-col`}
        >
            <div className="flex items-start justify-between mb-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-gray-200 transition-colors pr-4">
                    {t(`${basePath}.title`)}
                </h3>
                <div
                    className={`p-2 rounded-lg flex-shrink-0 border shadow-sm dark:shadow-none ${isExp
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50'
                        : 'bg-green-50 text-manjaro-green border-manjaro-green/30 dark:bg-green-900/30 dark:text-manjaro-green dark:border-manjaro-green/20'
                        }`}
                >
                    <Icon size={16} />
                </div>
            </div>

            <h4 className="text-[15px] font-medium text-slate-500 dark:text-gray-400 mb-3">
                {t(`${basePath}.role`)}
            </h4>

            <p className="text-sm text-slate-700 dark:text-gray-400 leading-relaxed mb-4">
                {t(`${basePath}.description`)}
            </p>

            <div className="mb-4">
                <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-2">
                    {t('timeline.labels.highlights')}
                </span>
                <ul className="space-y-1">
                    {highlights.map((h, i) => (
                        <li
                            key={i}
                            className={`flex items-start gap-2 text-sm ${isExp ? 'text-blue-700 dark:text-blue-300' : 'text-manjaro-green font-medium'}`}
                        >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                            <span className="text-slate-700 dark:text-gray-300 font-normal">{h}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-auto">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={`flex items-center gap-2 text-sm font-bold ${isExp
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-manjaro-green hover:text-green-600'
                        } transition-opacity hover:opacity-80`}
                >
                    <ChevronDown
                        size={14}
                        className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                    {t('timeline.labels.deep_dive')}
                </button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-inner dark:bg-black/20 dark:border-slate-800/50 dark:shadow-none">
                                <DeepDiveContent eventKey={data.key} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ─── Timeline ─────────────────────────────────────────────────────────────────

const Timeline: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="my-16 flex flex-col w-full relative">
            {/* Chibi Tópico (Senior) */}
            <div className="absolute -top-48 right-0 md:right-10 w-48 h-48 md:w-72 md:h-72 z-10 pointer-events-none opacity-90 drop-shadow-md">
                <img src={chibiSenior} alt="Lucas Senior" className="w-full h-full object-contain" />
            </div>

            {/* Table Header (hidden on mobile) */}
            <div className="hidden md:flex w-full px-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-6 mt-8">
                <div className="w-1/6">{t('timeline.headers.period')}</div>
                <div className="w-2/5 pl-4">{t('timeline.headers.experience')}</div>
                <div className="w-2/5 pl-4">{t('timeline.headers.education')}</div>
            </div>

            <div className="flex flex-col gap-8 md:gap-6">
                {timelineData.map((row, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                        className="flex flex-col md:flex-row w-full gap-4 md:gap-0 border-b border-slate-300 dark:border-slate-800 pb-8 md:pb-6 last:border-0"
                    >
                        {/* Col 1: Período */}
                        <div className="md:w-1/6 flex flex-col items-start pt-4 relative">
                            <span className="inline-block px-3 py-1 bg-white border border-slate-200 shadow-sm dark:shadow-none dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-gray-200 font-bold text-sm tracking-widest rounded-full">
                                {row.year}
                            </span>
                            {row.education?.key === 'ifba' && (
                                <div className="mt-8 pointer-events-none opacity-90 drop-shadow-md">
                                    <img src={chibiYoung} alt="Lucas Young" className="w-48 h-48 md:w-90 md:h-90 object-contain" />
                                </div>
                            )}
                        </div>

                        {/* Col 2: Experiência */}
                        <div className="md:w-2/5 md:px-2 flex flex-col gap-4">
                            <span className="md:hidden text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest pl-2 pt-2">
                                {t('timeline.labels.exp')}
                            </span>
                            <EventCard data={row.experience} type="exp" />
                        </div>

                        {/* Col 3: Formação & Conquistas */}
                        <div className="md:w-2/5 md:px-2 flex flex-col gap-4 relative">
                            <span className="md:hidden text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest pl-2 pt-2">
                                {t('timeline.labels.edu')}
                            </span>
                            <EventCard data={row.education} type="edu" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;