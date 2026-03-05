import React from 'react';
import { motion } from 'framer-motion';
import gymPhoto from '../assets/gym.jpeg';
import setupPhoto from '../assets/setup.png';
import mariliaPhoto from '../assets/marilia.jpg';

const defaultImageClass = "w-full sm:w-48 md:w-64 aspect-square bg-gray-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative shadow-lg group border border-gray-200 dark:border-slate-700 shrink-0";

const BeyondTheCode: React.FC = () => {
    return (
        <section className="mt-32 pt-16">
            <div className="w-full text-center md:text-left mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white inline-block border-b-2 border-manjaro-green pb-2">
                    Beyond the Code
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    Acredito que a lógica robusta escrita no terminal é reflexo da disciplina construída longe das telas. Conheça as bases que me mantêm focado.
                </p>
            </div>

            <div className="flex flex-col gap-16">

                {/* Block 1: Treino / Disciplina */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="flex flex-col sm:flex-row items-center gap-8 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-slate-800/50 hover:border-manjaro-green/30 transition-colors"
                >
                    <div className={defaultImageClass}>
                        <img
                            src={gymPhoto}
                            alt="Gym"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Ferro & <span className="text-manjaro-green">Disciplina</span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            A engenharia de software exige resiliência. Através do treino constante, aprendi que a verdadeira consistência não acontece num sprint de 24 horas, mas na disciplina diária. Um corpo ativo suporta uma mente focada e pronta para resolver gargalos críticos de arquitetura.
                        </p>
                    </div>
                </motion.div>

                {/* Block 2: Games / Estratégia */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row-reverse items-center gap-8 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-slate-800/50 hover:border-manjaro-green/30 transition-colors"
                >
                    <div className={defaultImageClass}>
                        <img
                            src={setupPhoto}
                            alt="Setup"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-4 md:text-right">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Imersão & <span className="text-manjaro-green">Estratégia</span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            Minha paixão por tecnologia nasceu dos jogos. Eles não são apenas passatempo, mas estudos contínuos de design de sistemas, narrativa e tomada de decisão em tempo real sob alta pressão. Estratégia nos jogos traduz-se em segurança no deploy.
                        </p>
                    </div>
                </motion.div>

                {/* Block 3: Família / Parceria */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center gap-8 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-slate-800/50 hover:border-manjaro-green/30 transition-colors"
                >
                    <div className={defaultImageClass}>
                        <img
                            src={mariliaPhoto}
                            alt="Marília"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Vida, Família & <span className="text-manjaro-green">Parceria</span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            Código legado a gente reescreve, mas momentos não voltam. Tempo de qualidade com a família e minha parceira de vida, Marília, me dão o equilíbrio necessário para desligar a IDE e voltar no dia seguinte com a mente limpa para inovar.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BeyondTheCode;
