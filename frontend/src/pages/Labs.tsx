import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import WordCounter from '../components/tools/WordCounter';
import { Calculator, Beaker } from 'lucide-react';

const Labs: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('word-counter');

    const tools = [
        {
            id: 'word-counter',
            name: t('labs.word_counter.name'),
            icon: <Calculator size={18} />,
            component: <WordCounter />
        },
        // Future tools map here
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">

            {/* Sidebar for Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-24">
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <Beaker className="text-manjaro-green" size={24} />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('labs.title')}
                        </h1>
                    </div>

                    <nav className="flex flex-col gap-1">
                        {tools.map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTab(tool.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left font-medium ${activeTab === tool.id
                                        ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-l-4 border-manjaro-green shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 border-l-4 border-transparent'
                                    }`}
                            >
                                {tool.icon}
                                {tool.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow bg-white dark:bg-gray-900/60 rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800/80 backdrop-blur-md">
                {tools.find(t => t.id === activeTab)?.component}
            </div>

        </div>
    );
};

export default Labs;
