import React from 'react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, className = '' }) => {
    return (
        <div className={`group p-6 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-manjaro-green/50 dark:hover:border-manjaro-green/30 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[250px] ${className}`}>
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-gray-700/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
        </div>
    );
};

export default FeatureCard;
