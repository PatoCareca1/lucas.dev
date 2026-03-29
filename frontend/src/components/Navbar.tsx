import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Languages, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'pt' : 'en';
        i18n.changeLanguage(nextLang);
    };

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center gap-6">
                        <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                            {t('title')}
                        </Link>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/projects" className="text-sm font-medium text-gray-600 hover:text-manjaro-green dark:text-gray-300 dark:hover:text-manjaro-green transition-colors">
                                {t('projects.title', 'Projects')}
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <button
                            onClick={toggleLanguage}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 flex items-center gap-2"
                            aria-label={t('language')}
                        >
                            <Languages size={20} />
                            <span className="text-sm font-medium uppercase">{i18n.language}</span>
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                            aria-label={t('theme')}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                    <Link
                        to="/projects"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-sm font-medium text-gray-600 hover:text-manjaro-green dark:text-gray-300 dark:hover:text-manjaro-green transition-colors py-2"
                    >
                        {t('projects.title', 'Projects')}
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
