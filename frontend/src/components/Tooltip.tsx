import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface TooltipProps {
    text: string;
    projectSlug: string;
    title: string;
    description: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, projectSlug, title, description }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <span className="border-b border-dashed border-gray-400 cursor-help text-manjaro-green font-semibold">
                {children}
            </span>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-left"
                    >
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                            {description}
                        </p>
                        <Link
                            to={`/projects/${projectSlug}`}
                            className="inline-flex items-center text-xs font-semibold text-manjaro-green hover:underline gap-1"
                            onClick={() => setIsVisible(false)}
                        >
                            Saber mais
                            <ExternalLink size={12} />
                        </Link>

                        {/* Arrow indicator */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-white dark:border-t-gray-800 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;
