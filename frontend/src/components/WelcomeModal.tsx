import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalState = 'initial' | 'asking' | 'no_1' | 'no_2' | 'welcomed_recruiter' | 'welcomed_visitor' | 'closed';

const WelcomeModal: React.FC = () => {
  const [modalState, setModalState] = useState<ModalState>('initial');

  useEffect(() => {
    // Trigger modal 1.5s after mount
    const timer = setTimeout(() => {
      setModalState('asking');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (modalState === 'initial' || modalState === 'closed') return null;

  const renderContent = () => {
    switch (modalState) {
      case 'asking':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Você é um recrutador?
            </h2>
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={() => setModalState('welcomed_recruiter')}
                className="px-6 py-2 bg-manjaro-green text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
              >
                Sim
              </button>
              <button 
                onClick={() => setModalState('no_1')}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Não
              </button>
            </div>
          </>
        );
      case 'no_1':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Tem certeza?
            </h2>
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={() => setModalState('welcomed_recruiter')}
                className="px-6 py-2 bg-manjaro-green text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
              >
                Mudei de ideia, sim
              </button>
              <button 
                onClick={() => setModalState('no_2')}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Tenho
              </button>
            </div>
          </>
        );
      case 'no_2':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Jura?
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6 font-medium">
              Se eu fosse um recrutador, eu lhe daria a vaga...
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setModalState('welcomed_visitor')}
                className="px-6 py-2 bg-manjaro-green text-white font-bold rounded-lg hover:bg-green-600 transition-colors w-full"
              >
                Tudo bem, vamos entrar
              </button>
            </div>
          </>
        );
      case 'welcomed_recruiter':
      case 'welcomed_visitor':
        return (
          <>
            <h2 className="text-2xl font-bold text-manjaro-green mb-4 text-center">
              Seja muito bem-vindo!
            </h2>
            <p className="text-center text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Este portfólio é um projeto pessoal feito com muito carinho para mostrar o que o currículo não alcança. Fique à vontade para explorar.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setModalState('closed')}
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Explorar Lucas.dev
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Subtle backdrop that keeps the spheres visible */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[2px]"
          onClick={() => modalState === 'welcomed_recruiter' || modalState === 'welcomed_visitor' ? setModalState('closed') : null}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-8 rounded-3xl shadow-2xl"
        >
            {renderContent()}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomeModal;
