import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import ProfilePicture from '../components/ProfilePicture';
import Tooltip from '../components/Tooltip';
import BentoGrid from '../components/BentoGrid';
import Timeline from '../components/Timeline';
import OffDutyGallery from '../components/OffDutyGallery';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    const { t } = useTranslation();

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

                {/* New Page Sections */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col gap-8"
                >
                    <BentoGrid />
                    <Timeline />
                    <OffDutyGallery />
                </motion.div>

            </div>
        </div>
    );
};

export default Home;
