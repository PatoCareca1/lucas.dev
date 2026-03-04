import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface TimelineItemProps {
    title: string;
    date: string;
    description: string;
    tags: string[];
    isLast?: boolean;
    delay?: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, date, description, tags, isLast, delay = 0 }) => {
    return (
        <div className="relative pl-8 md:pl-0">
            {/* Desktop timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-slate-700" style={{ display: isLast ? 'none' : 'block' }}></div>

            {/* Mobile timeline line */}
            <div className="md:hidden absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700" style={{ display: isLast ? 'none' : 'block' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay }}
                className="md:flex items-center justify-between w-full mb-12"
            >
                {/* Left side (Date on desktop, ignored on mobile) */}
                <div className="hidden md:block w-5/12 text-right pr-8">
                    <span className="text-manjaro-green font-mono font-semibold">{date}</span>
                </div>

                {/* Center Node */}
                <div className="absolute left-0 md:static md:w-2/12 flex justify-center z-10">
                    <div className="w-6 h-6 bg-white dark:bg-slate-800 border-4 border-manjaro-green rounded-full shadow-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-manjaro-green rounded-full"></div>
                    </div>
                </div>

                {/* Right side (Content) */}
                <div className="w-full md:w-5/12 pl-4 md:pl-8 bg-white/5 dark:bg-slate-800/30 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm relative">
                    <div className="md:hidden mb-2">
                        <span className="text-manjaro-green font-mono text-sm font-semibold">{date}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">
                        {description}
                    </p>
                    {/* Tech Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-md shadow-sm border border-gray-200 dark:border-slate-600">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const Timeline: React.FC = () => {
    const { t } = useTranslation();

    const items = [
        {
            title: t('timeline.prp.title'),
            date: t('timeline.prp.date'),
            description: t('timeline.prp.desc'),
            tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
            delay: 0.1
        },
        {
            title: t('timeline.plp.title'),
            date: t('timeline.plp.date'),
            description: t('timeline.plp.desc'),
            tags: ['Django', 'Python', 'Redis', 'PostgreSQL', 'Celery'],
            delay: 0.2
        },
        {
            title: t('timeline.sethas.title'),
            date: t('timeline.sethas.date'),
            description: t('timeline.sethas.desc'),
            tags: ['Python', 'Legacy Modernization', 'Architecture'],
            delay: 0.3
        }
    ];

    return (
        <div className="w-full mb-20">
            <div className="text-center mb-16">
                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 inline-block drop-shadow-sm mb-2">
                    {t('timeline.title')}
                </h3>
            </div>

            <div className="relative container mx-auto px-4">
                {items.map((item, index) => (
                    <TimelineItem
                        key={index}
                        title={item.title}
                        date={item.date}
                        description={item.description}
                        tags={item.tags}
                        isLast={index === items.length - 1}
                        delay={item.delay}
                    />
                ))}
            </div>
        </div>
    );
};

export default Timeline;
