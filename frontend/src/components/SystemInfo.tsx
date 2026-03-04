import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Server, Terminal } from 'lucide-react';

interface SystemInfoData {
    os: string;
    python_version: string;
}

const SystemInfo: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<SystemInfoData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8001/api/system-info')
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then(setData)
            .catch(err => {
                console.error(err);
                setError('Connected to Frontend, Backend API offline');
            });
    }, []);

    return (
        <div className="py-6 px-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                {error ? (
                    <div className="flex items-center gap-2 text-red-500/80">
                        <Server size={16} />
                        <span>{error}</span>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <Server size={16} className="text-teal-500" />
                            <span>{t('os')}: <strong>{data?.os || 'Loading...'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Terminal size={16} className="text-yellow-500" />
                            <span>{t('python_version')}: <strong>{data?.python_version || 'Loading...'}</strong></span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SystemInfo;
