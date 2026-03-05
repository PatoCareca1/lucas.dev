import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase, GraduationCap } from 'lucide-react';

interface InfoCard {
    title: string;
    role: string;
    deepDive?: string;
}

interface TimelineRow {
    year: string;
    experience?: InfoCard;
    education?: InfoCard;
}

const timelineData: TimelineRow[] = [
    {
        year: '2025 - Atual',
        experience: {
            title: 'SETHAS / RN',
            role: 'Backend Developer / Analista de Dados',
            deepDive: 'Arquitetura de APIs auditáveis em Django REST/Ninja. Modelagem de domínios complexos isolados e integração de pipelines maciços de ETL usando Pandas/DuckDB para garantir a integridade dos dados governamentais.',
        },
        education: {
            title: 'UFRN / UERN',
            role: 'Bacharelado & Especialização',
            deepDive: 'Aprofundamento em Engenharia de Software, Arquitetura de Sistemas e Otimização Computacional em ambientes acadêmicos rigorosos.',
        }
    },
    {
        year: '2023 - 2024',
        experience: {
            title: '4PUMP',
            role: 'Desenvolvedor Full Stack & Automação',
            deepDive: 'Manutenção de automações ponta a ponta com Python e Selenium. Construção de interfaces React dinâmicas e dashboards que conectam múltiplas APIs financeiras a bases Postgres relacionais.',
        }
    },
    {
        year: '2021',
        education: {
            title: 'Hackathon HackaPower - 1º Lugar',
            role: 'Tech Lead / Projeto Crowdless',
            deepDive: 'Sob intensa restrição de tempo, liderei o desenvolvimento da IA/Visão Computacional e regras da aplicação Crowdless, conquistando o primeiro lugar geral pelo impacto e viabilidade arquitetural.',
        }
    },
    {
        year: '2016',
        experience: {
            title: 'Técnico em Informática',
            role: 'Suporte & Infraestrutura Inicial',
        },
        education: {
            title: 'IFBA - Campus Irecê',
            role: 'Graduando Técnico',
            deepDive: 'O rito de passagem: primeiros arrays em C/C++, manipulação brutal de ponteiros e fundação lógica para pensar como a máquina.',
        }
    }
];

const EventCard: React.FC<{ data?: InfoCard; type: 'exp' | 'edu' }> = ({ data, type }) => {
    const [expanded, setExpanded] = useState(false);

    if (!data) {
        return (
            <div className="hidden md:flex h-full min-h-[120px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800/50 bg-gray-50/30 dark:bg-slate-900/10 opacity-60">
                <span className="text-gray-400 dark:text-gray-600 text-sm">N/A</span>
            </div>
        );
    }

    const isExp = type === 'exp';

    return (
        <div className={`p-6 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border ${isExp ? 'border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500/50' : 'border-manjaro-green/30 dark:border-manjaro-green/30 hover:border-manjaro-green dark:hover:border-manjaro-green'} transition-colors shadow-sm relative group w-full h-full flex flex-col`}>
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors pr-4">
                    {data.title}
                </h3>
                <div className={`p-2 rounded-lg ${isExp ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-manjaro-green dark:bg-green-900/30 dark:text-manjaro-green'}`}>
                    {isExp ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                </div>
            </div>
            <h4 className="text-[15px] font-medium text-gray-600 dark:text-gray-400 mb-4">
                {data.role}
            </h4>

            {data.deepDive && (
                <div className="mt-auto">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`flex items-center gap-2 text-sm font-bold ${isExp ? 'text-blue-600 dark:text-blue-400' : 'text-manjaro-green hover:text-green-600'} transition-opacity hover:opacity-80`}
                    >
                        <ChevronDown size={14} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
                        Technical Deep Dive
                    </button>

                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800/50 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                    {data.deepDive}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

const Timeline: React.FC = () => {
    return (
        <div className="my-16 flex flex-col w-full">
            {/* Table Header Wrapper (Hidden on mobile) */}
            <div className="hidden md:flex w-full px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">
                <div className="w-1/6">Período</div>
                <div className="w-2/5 pl-4">Experiência Profissional</div>
                <div className="w-2/5 pl-4">Formação & Conquistas</div>
            </div>

            <div className="flex flex-col gap-8 md:gap-6">
                {timelineData.map((row, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="flex flex-col md:flex-row w-full gap-4 md:gap-0 border-b border-gray-200 dark:border-slate-800 pb-8 md:pb-6 last:border-0"
                    >
                        {/* Column 1: Dates */}
                        <div className="md:w-1/6 flex items-start pt-4">
                            <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-bold text-sm tracking-widest rounded-full">
                                {row.year}
                            </span>
                        </div>

                        {/* Column 2: Experience */}
                        <div className="md:w-2/5 md:px-2 flex flex-col gap-4">
                            {/* Mobile label visible only on small screens */}
                            <span className="md:hidden text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-2 pt-2">Exp. Profissional</span>
                            <EventCard data={row.experience} type="exp" />
                        </div>

                        {/* Column 3: Education */}
                        <div className="md:w-2/5 md:px-2 flex flex-col gap-4">
                            {/* Mobile label visible only on small screens */}
                            <span className="md:hidden text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-2 pt-2">Formação/Conquistas</span>
                            <EventCard data={row.education} type="edu" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
