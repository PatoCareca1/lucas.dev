import React from 'react';
import { useTranslation } from 'react-i18next';
import FeatureCard from '../components/FeatureCard';
import ProfilePicture from '../components/ProfilePicture';

import WelcomeModal from '../components/WelcomeModal';
import SkillsMatrix from '../components/SkillsMatrix';
import Timeline from '../components/Timeline';
import BeyondTheCode from '../components/BeyondTheCode';
import ContactSection from '../components/ContactSection';
import FeaturedProjects from '../components/Featuredprojects';
import { Code2, Database, Layout, Terminal, ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    const { t } = useTranslation();

    const coreStacks = [
        {
            key: 'python',
            icon: <Database size={48} />,
            className: 'md:col-span-2 md:row-span-2 bg-gradient-to-br from-white/95 to-slate-50 dark:from-slate-900/40 dark:to-manjaro-green/10'
        },
        {
            key: 'devops',
            icon: <Terminal size={32} />,
            className: 'md:col-span-2 md:row-span-1'
        },
        {
            key: 'react',
            icon: <Code2 size={24} />,
            className: 'md:col-span-1 md:row-span-1'
        },
        {
            key: 'postgres',
            icon: <Layout size={24} />,
            className: 'md:col-span-1 md:row-span-1'
        }
    ];

    return (
        <div className="min-h-[calc(100vh-8rem)] relative">
            <WelcomeModal />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

                {/* Profile / Hero Section */}
                <div className="flex flex-col md:flex-row items-center gap-12 mb-24">

                    <ProfilePicture />

                    <motion.div
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 text-center md:text-left"
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-manjaro-green to-teal-400 mb-4 tracking-tight">
                            {t('home.greeting')}
                        </h1>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5 drop-shadow-sm">
                            {t('home.subtitle')}
                        </h2>

                        {/* Tech badges */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                            {(t('home.badges', { returnObjects: true }) as string[]).map((badge) => (
                                <span
                                    key={badge}
                                    className="px-3 py-1 text-xs font-medium rounded-full border border-manjaro-green/30 bg-manjaro-green/5 text-gray-700 dark:text-gray-300 tracking-wide"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>

                        <p className="text-lg text-gray-700 dark:text-gray-400 max-w-2xl leading-relaxed text-justify">
                            {t('home.bio')}
                        </p>

                        <div className='flex flex-wrap justify-center md:justify-start gap-3 mt-8'>
                            <button
                                onClick={() => document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-manjaro-green text-white font-bold text-sm hover:bg-manjaro-green/90 hover:scale-[1.02] transition-all duration-200 shadow-md shadow-manjaro-green/20"
                            >
                                {t('home.cta_projects')}
                                <ArrowRight size={16} />
                            </button>

                            <a
                                href="/lucas-daniel-curriculo.pdf"
                                download
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-manjaro-green/40 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-manjaro-green/10 hover:border-manjaro-green/60 hover:scale-[1.02] transition-all duration-200"
                            >
                                <Download size={16} />
                                {t('home.cta_resume')}
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Core Stacks Bento Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="mb-24"
                >
                    <div className="text-center md:text-left mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 inline-block border-b-2 border-manjaro-green pb-2">
                            {t('home.skills_title', 'Core Stacks')}
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
                        {coreStacks.map((skill, idx) => (
                            <FeatureCard
                                key={idx}
                                title={t(`home.stacks.${skill.key}.title`)}
                                description={t(`home.stacks.${skill.key}.desc`)}
                                icon={skill.icon}
                                className={skill.className}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Skills Matrix Section */}
                <SkillsMatrix />

                {/* Expanded Timeline Section */}
                <section className="mb-24">
                    <div className="text-center md:text-left mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 inline-block border-b-2 border-manjaro-green pb-2">
                            {t('timeline.title')}
                        </h3>
                    </div>
                    <Timeline />
                </section>

                {/* Featured Projects Section */}
                <FeaturedProjects />

                {/* Beyond the Code Wrapper */}
                <BeyondTheCode />

                {/* Contact Section */}
                <ContactSection />

            </div>
        </div>
    );
};

export default Home;
