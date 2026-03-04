import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Server, Target, Award, Code2 } from 'lucide-react';

interface ProjectDetail {
    slug: string;
    title: string;
    short_desc: string;
    challenge: string;
    technical_solution: string;
    results: string[];
    tech_stack: string[];
}

const ProjectDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/v1/bio/projects/${slug}`);
                if (!res.ok) {
                    throw new Error('Project not found');
                }
                const data = await res.json();
                setProject(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Ocorreu um erro desconhecido');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-manjaro-green"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Projeto não encontrado</h1>
                <Link to="/" className="text-manjaro-green hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} /> Voltar para o início
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-manjaro-green mb-8 transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-manjaro-green to-teal-400 mb-6">
                    {project.title}
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-12 border-l-4 border-manjaro-green pl-4">
                    {project.short_desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="col-span-1 md:col-span-2 space-y-12">

                        {/* The Challenge Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="text-orange-500" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">O Desafio</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                {project.challenge}
                            </p>
                        </section>

                        {/* The Solution Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Server className="text-blue-500" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">A Solução Técnica</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                {project.technical_solution}
                            </p>
                        </section>

                        {/* Results Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="text-yellow-500" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resultados</h2>
                            </div>
                            <ul className="space-y-3">
                                {project.results.map((result, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-lg">
                                        <span className="text-manjaro-green mt-1">✓</span>
                                        {result}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Sidebar Tech Stack */}
                    <div className="col-span-1">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-6">
                                <Code2 className="text-manjaro-green" size={20} />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tech Stack</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.tech_stack.map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default ProjectDetails;
