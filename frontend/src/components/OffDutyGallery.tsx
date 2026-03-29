import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Dumbbell, ChefHat, BookOpen, Gamepad2 } from 'lucide-react';

interface GalleryCardProps {
    title: string;
    caption: string;
    icon: React.ReactNode;
    delay?: number;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ title, caption, icon, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group relative bg-white/5 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700/50 shadow-md aspect-[4/5] flex flex-col"
        >
            <div className="flex-1 bg-gray-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                <div className="text-gray-300 dark:text-slate-600 transition-transform duration-500 group-hover:scale-110">
                    {icon}
                </div>
            </div>

            <div className="p-5 bg-white/40 dark:bg-black/40 backdrop-blur-xl absolute bottom-0 left-0 right-0 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2 text-justify">
                    {caption}
                </p>
            </div>
        </motion.div>
    );
};

const OffDutyGallery: React.FC = () => {
    const { t } = useTranslation();

    const hobbies = [
        {
            title: t('offduty.training.title'),
            caption: t('offduty.training.caption'),
            icon: <Dumbbell size={64} />,
            delay: 0.1
        },
        {
            title: t('offduty.cooking.title'),
            caption: t('offduty.cooking.caption'),
            icon: <ChefHat size={64} />,
            delay: 0.2
        },
        {
            title: t('offduty.reading.title'),
            caption: t('offduty.reading.caption'),
            icon: <BookOpen size={64} />,
            delay: 0.3
        },
        {
            title: t('offduty.games.title'),
            caption: t('offduty.games.caption'),
            icon: <Gamepad2 size={64} />,
            delay: 0.4
        }
    ];

    return (
        <div className="w-full mb-20">
            <div className="text-center mb-12">
                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 inline-block drop-shadow-sm mb-2">
                    {t('offduty.title')}
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {hobbies.map((hobby, idx) => (
                    <GalleryCard
                        key={idx}
                        title={hobby.title}
                        caption={hobby.caption}
                        icon={hobby.icon}
                        delay={hobby.delay}
                    />
                ))}
            </div>
        </div>
    );
};

export default OffDutyGallery;
