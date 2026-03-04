import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import FeatureCard from '../components/FeatureCard';
import ProfilePicture from '../components/ProfilePicture';
import Tooltip from '../components/Tooltip';
import { Code2, Database, Layout, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    const { t } = useTranslation();

    const skills = [
        { title: 'Django (Python)', description: 'Robust backend with Django Ninja for fast, scalable APIs.', icon: <Database size={32} /> },
        { title: 'React & TypeScript', description: 'Dynamic user interfaces built with type safety.', icon: <Code2 size={32} /> },
        { title: 'Vite & Tailwind CSS', description: 'Lightning fast builds and utility-first styling.', icon: <Layout size={32} /> },
        { title: 'Linux Environment', description: 'Aimed at production readiness on Linux environments (Manjaro/CachyOS).', icon: <Terminal size={32} /> }
    ];

    return (
        <div className="min-h-[calc(100vh-8rem)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

                {/* Profile / Hero Section */}
                <div className="flex flex-col md:flex-row items-center gap-12 mb-20">

                    <ProfilePicture />

                    <motion.div
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 text-center md:text-left"
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-4 tracking-tight">
                            {t('home.greeting')}
                        </h1>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 drop-shadow-sm">
                            {t('home.subtitle')}
                        </h2 >
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                            <Trans
                                i18nKey="home.bio"
                                components={{
                                    plp: (
                                        <Tooltip
                                            text="PLP"
                                            projectSlug="plp"
                                            title={t('projects.plp.title', 'PLP (Pricing & Promotions)')}
                                            description={t('projects.plp.short_desc', 'Microsserviço de precisão para cálculo de preços e promoções em tempo real.')}
                                        >
                                            PLP
                                        </Tooltip>
                                    ),
                                    prp: (
                                        <Tooltip
                                            text="PRP"
                                            projectSlug="prp"
                                            title={t('projects.prp.title', 'PRP (Product Review Platform)')}
                                            description={t('projects.prp.short_desc', 'Plataforma de avaliações processando alto volume de dados de produtos.')}
                                        >
                                            PRP
                                        </Tooltip>
                                    )
                                }}
                            />
                        </p>
                    </motion.div>
                </div>

                {/* Skills Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-12"
                >
                    <div className="text-center md:text-left mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 inline-block border-b-2 border-manjaro-green pb-2">
                            {t('home.skills_title')}
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {skills.map((skill, idx) => (
                            <FeatureCard
                                key={idx}
                                title={skill.title}
                                description={skill.description}
                                icon={skill.icon}
                            />
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Home;
