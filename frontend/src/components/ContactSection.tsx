import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Mail } from 'lucide-react';

const ContactSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section id="contato" className="py-16 px-6 text-center border-t border-slate-200 dark:border-slate-800/50 mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t('contact.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                {t('contact.subtitle')}
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <a
                    href="https://linkedin.com/in/lucas-daniel-costa-souza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col md:flex-row items-center gap-2 text-manjaro-green hover:underline font-bold transition-all"
                >
                    <Linkedin size={24} />
                    <span>LinkedIn</span>
                </a>
                <a
                    href="https://github.com/PatoCareca1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col md:flex-row items-center gap-2 text-manjaro-green hover:underline font-bold transition-all"
                >
                    <Github size={24} />
                    <span>GitHub</span>
                </a>
                <a
                    href="mailto:contato@lucasdaniel.dev.br"
                    className="flex flex-col md:flex-row items-center gap-2 text-manjaro-green hover:underline font-bold transition-all"
                >
                    <Mail size={24} />
                    <span>contato@lucasdaniel.dev.br</span>
                </a>
            </div>

            <div className="text-slate-500 text-xs mt-10">
                {t('contact.footer')}
            </div>
        </section>
    );
};

export default ContactSection;
