import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase, GraduationCap, Trophy } from 'lucide-react';

interface DeepDive {
    context: string;
    responsibilities: string[];
    stack?: string[];
    impact: string[];
    link?: { label: string; url: string };
}

interface InfoCard {
    title: string;
    role: string;
    description: string;
    highlights: string[];
    deepDive?: DeepDive;
}

interface TimelineRow {
    year: string;
    experience?: InfoCard;
    education?: InfoCard;
}

const timelineData: TimelineRow[] = [
    // A) 2026 — UFRN
    {
        year: '2026',
        education: {
            title: 'UFRN',
            role: 'Ciência da Computação',
            description:
                'Chegada à UFRN para buscar mais oportunidades e aprofundar a base em computação e engenharia de software.',
            highlights: [
                'Foco em engenharia de software e fundamentos de sistemas',
                'Mais oportunidades acadêmicas, projetos e networking',
                'Evolução contínua com estudos e projetos práticos',
            ],
            deepDive: {
                context: 'Mudança para ampliar oportunidades e continuar evoluindo tecnicamente.',
                responsibilities: [
                    'Aprofundar disciplinas importantes do curso',
                    'Buscar projetos práticos e experiências aplicadas',
                    'Manter constância em estudos e desenvolvimento de projetos',
                ],
                stack: ['Python', 'React', 'TypeScript'],
                impact: [
                    'Mais oportunidades para crescer como desenvolvedor',
                    'Base mais forte para atuar com sistemas maiores',
                ],
            },
        },
    },

    // B) 2025 — Atual — SETHAS / RN
    {
        year: '2025 — Atual',
        experience: {
            title: 'SETHAS / RN',
            role: 'Backend Developer / Analista de Dados',
            description:
                'Trabalho com backend e dados em sistemas do governo do RN, com APIs, integrações e automações.',
            highlights: [
                'APIs com Python e Django',
                'Integrações e automações de rotinas internas',
                'Dados e relatórios com Pandas e PostgreSQL',
                'Atuação em sistemas ligados ao PRP e ao PLP',
            ],
            deepDive: {
                context:
                    'Sistemas usados no dia a dia da gestão pública, com foco em estabilidade e clareza dos dados.',
                responsibilities: [
                    'Criar e manter endpoints, APIs REST e regras de negócio',
                    'Automatizar processos e integrar módulos/sistemas',
                    'Trabalhar com dados para apoiar rotinas e decisões',
                ],
                stack: ['Python', 'Django', 'PostgreSQL', 'Pandas', 'Linux'],
                impact: [
                    'Menos trabalho manual com automações',
                    'Dados mais consistentes com validações e integrações',
                    'Processos mais fáceis de acompanhar e auditar',
                ],
            },
        },
    },

    // C) 2023 — 2024 — 4PUMP
    {
        year: '2023 — 2024',
        experience: {
            title: '4PUMP',
            role: 'Desenvolvedor Full Stack & Automação',
            description:
                'Desenvolvimento de soluções web e automações, atuando no backend e no front quando necessário.',
            highlights: [
                'Backend em Python e integrações',
                'Front com React + TypeScript',
                'Automação de tarefas e fluxos',
                'Evolução e manutenção do produto no dia a dia',
            ],
            deepDive: {
                context:
                    'Projeto com entregas rápidas, exigindo trabalho “mão na massa” de ponta a ponta.',
                responsibilities: [
                    'Implementar features completas (API + UI)',
                    'Criar automações e integrações entre serviços',
                    'Organizar melhorias e ajustes contínuos do produto',
                ],
                stack: ['Python', 'React', 'TypeScript', 'PostgreSQL'],
                impact: [
                    'Automatização de tarefas repetitivas',
                    'Interfaces mais consistentes com tipagem e padrão de componentes',
                ],
            },
        },
    },

    // D) 2022 — UERN
    {
        year: '2022',
        education: {
            title: 'UERN',
            role: 'Ciência da Computação',
            description:
                'Mudança para Natal e início da graduação em Ciência da Computação, fortalecendo base teórica e prática.',
            highlights: [
                'Algoritmos e estruturas de dados',
                'Sistemas operacionais e arquitetura',
                'Engenharia de software e projetos práticos',
            ],
            deepDive: {
                context: 'Fase de fortalecer fundamentos e transformar teoria em prática.',
                responsibilities: [
                    'Consolidar a base do curso em disciplinas essenciais',
                    'Fazer projetos acadêmicos com foco em software',
                    'Construir repertório técnico com consistência',
                ],
                impact: ['Fundamentos sólidos para evoluir em backend e arquitetura.'],
            },
        },
    },

    // E) 2021 — Secretaria de Educação
    {
        year: '2021',
        experience: {
            title: 'Secretaria de Educação',
            role: 'Técnico em Informática (Estágio)',
            description:
                'Primeira experiência profissional em TI, com suporte e manutenção de ambientes institucionais.',
            highlights: [
                'Suporte a usuários e manutenção de máquinas',
                'Diagnóstico de rede e hardware',
                'Configuração e organização de ambientes',
                'Vivência real de TI no dia a dia',
            ],
            deepDive: {
                context: 'Rotina de suporte, com problemas reais e necessidade de resolver rápido.',
                responsibilities: [
                    'Atender chamados e registrar soluções',
                    'Manter ambientes funcionando e atualizados',
                    'Apoiar configurações e ajustes de infraestrutura',
                ],
                stack: ['Windows', 'Linux', 'Redes'],
                impact: [
                    'Menos interrupções com suporte e manutenção preventiva',
                    'Ambientes mais padronizados e estáveis',
                ],
            },
        },

        // F) 2021 — Hackathon HackaPower — 1º Lugar
        education: {
            title: 'Hackathon HackaPower — 1º Lugar',
            role: 'Tech Lead — Projeto Crowdless',
            description:
                'Liderança técnica na construção do protótipo vencedor do HackaPower.',
            highlights: [
                'Coordenação técnica do time',
                'Decisões rápidas de arquitetura e prioridades',
                'Protótipo funcional entregue no prazo',
                'Apresentação final e validação do pitch',
            ],
            deepDive: {
                context: 'Hackathon: pouco tempo, muita entrega e validação na prática.',
                responsibilities: [
                    'Organizar o time e priorizar o essencial',
                    'Definir arquitetura e integrar o protótipo',
                    'Garantir entrega final e apresentação',
                ],
                impact: ['1º lugar no HackaPower.'],
                link: {
                    label: 'Ver notícia oficial do evento',
                    url: 'https://portal.ifba.edu.br/jequie/noticias/2021/agosto/equipe-do-ifba-jequie-e-campea-do-hackathon-juventudes',
                },
            },
        },
    },

    // G) 2016 — IFBA
    {
        year: '2016',
        education: {
            title: 'IFBA — Campus Jequié',
            role: 'Técnico em Informática',
            description:
                'Início da jornada em tecnologia com formação técnica em informática.',
            highlights: [
                'Fundamentos de programação e lógica',
                'Noções de redes e infraestrutura',
                'Sistemas operacionais e manutenção',
                'Base que abriu caminho para o desenvolvimento de software',
            ],
            deepDive: {
                context: 'Formação técnica que deu a base para seguir na área.',
                responsibilities: [
                    'Cursar disciplinas técnicas com prática em laboratório',
                    'Desenvolver projetos e atividades aplicadas do curso',
                    'Consolidar fundamentos: programação, redes e hardware',
                ],
                impact: ['Base sólida que sustentou a evolução na carreira.'],
            },
        },
    },
];

// ─── Deep Dive Renderer ───────────────────────────────────────────────────────

const DeepDiveContent: React.FC<{ dive: DeepDive }> = ({ dive }) => (
    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {/* Contexto */}
        <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                Contexto
            </span>
            <p>{dive.context}</p>
        </div>

        {/* Responsabilidades */}
        <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                Responsabilidades
            </span>
            <ul className="list-disc list-inside space-y-1">
                {dive.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                ))}
            </ul>
        </div>

        {/* Stack */}
        {dive.stack && dive.stack.length > 0 && (
            <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                    Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {dive.stack.map((s, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-mono"
                        >
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Impacto */}
        <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                Impacto
            </span>
            <ul className="list-disc list-inside space-y-1">
                {dive.impact.map((imp, i) => (
                    <li key={i}>{imp}</li>
                ))}
            </ul>
        </div>

        {/* Link opcional */}
        {dive.link && (
            <div className="pt-1">
                <a
                    href={dive.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-400 underline underline-offset-2 transition-colors"
                >
                    {dive.link.label} ↗
                </a>
            </div>
        )}
    </div>
);

// ─── Event Card ───────────────────────────────────────────────────────────────

const EventCard: React.FC<{ data?: InfoCard; type: 'exp' | 'edu' }> = ({ data, type }) => {
    const [expanded, setExpanded] = useState(false);

    if (!data) {
        return (
            <div className="hidden md:flex h-full min-h-[120px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800/50 bg-gray-50/20 dark:bg-slate-900/10 opacity-40">
                <span className="text-gray-300 dark:text-gray-700 text-sm select-none">—</span>
            </div>
        );
    }

    const isExp = type === 'exp';
    const Icon = isExp
        ? Briefcase
        : data.title.toLowerCase().includes('hackathon')
            ? Trophy
            : GraduationCap;

    return (
        <div
            className={`p-6 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border ${isExp
                ? 'border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500/50'
                : 'border-manjaro-green/30 dark:border-manjaro-green/30 hover:border-manjaro-green dark:hover:border-manjaro-green'
                } transition-colors shadow-sm relative group w-full h-full flex flex-col`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors pr-4">
                    {data.title}
                </h3>
                <div
                    className={`p-2 rounded-lg flex-shrink-0 ${isExp
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-green-100 text-manjaro-green dark:bg-green-900/30 dark:text-manjaro-green'
                        }`}
                >
                    <Icon size={16} />
                </div>
            </div>

            {/* Role / Subtítulo */}
            <h4 className="text-[15px] font-medium text-gray-600 dark:text-gray-400 mb-3">
                {data.role}
            </h4>

            {/* Descrição curta */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {data.description}
            </p>

            {/* Engineering Highlights */}
            <div className="mb-4">
                <span className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    Engineering Highlights
                </span>
                <ul className="space-y-1">
                    {data.highlights.map((h, i) => (
                        <li
                            key={i}
                            className={`flex items-start gap-2 text-sm ${isExp ? 'text-blue-700 dark:text-blue-300' : 'text-manjaro-green'
                                }`}
                        >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{h}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Technical Deep Dive toggle */}
            {data.deepDive && (
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
                                <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800/50">
                                    <DeepDiveContent dive={data.deepDive} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

// ─── Timeline ─────────────────────────────────────────────────────────────────

const Timeline: React.FC = () => {
    return (
        <div className="my-16 flex flex-col w-full">
            {/* Table Header (hidden on mobile) */}
            <div className="hidden md:flex w-full px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">
                <div className="w-1/6">Período</div>
                <div className="w-2/5 pl-4">Experiência Profissional</div>
                <div className="w-2/5 pl-4">Formação &amp; Conquistas</div>
            </div>

            <div className="flex flex-col gap-8 md:gap-6">
                {timelineData.map((row, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                        className="flex flex-col md:flex-row w-full gap-4 md:gap-0 border-b border-gray-200 dark:border-slate-800 pb-8 md:pb-6 last:border-0"
                    >
                        {/* Col 1: Período */}
                        <div className="md:w-1/6 flex items-start pt-4">
                            <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-bold text-sm tracking-widest rounded-full">
                                {row.year}
                            </span>
                        </div>

                        {/* Col 2: Experiência */}
                        <div className="md:w-2/5 md:px-2 flex flex-col gap-4">
                            <span className="md:hidden text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-2 pt-2">
                                Exp. Profissional
                            </span>
                            <EventCard data={row.experience} type="exp" />
                        </div>

                        {/* Col 3: Formação & Conquistas */}
                        <div className="md:w-2/5 md:px-2 flex flex-col gap-4">
                            <span className="md:hidden text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-2 pt-2">
                                Formação / Conquistas
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