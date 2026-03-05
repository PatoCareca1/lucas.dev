import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalState = 'initial' | 'asking' | 'no_1' | 'welcomed_recruiter' | 'welcomed_visitor' | 'closed';

const WelcomeModal: React.FC = () => {
  const [modalState, setModalState] = useState<ModalState>('initial');

  useEffect(() => {
    // Trigger modal 1.5s after mount
    const timer = setTimeout(() => {
      setModalState('asking');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-close after 5 seconds when welcomed as recruiter
    if (modalState === 'welcomed_recruiter') {
      const closeTimer = setTimeout(() => {
        setModalState('closed');
      }, 5000);
      return () => clearTimeout(closeTimer);
    }
  }, [modalState]);

  if (modalState === 'initial' || modalState === 'closed') return null;

  // Determine which Chibi to show based on state
  let chibiImage = 'chibi_1.png';
  if (modalState === 'no_1') chibiImage = 'chibi_2.png';
  else if (modalState === 'welcomed_recruiter' || modalState === 'welcomed_visitor') chibiImage = 'chibi_follow-me.png';

  const renderContent = () => {
    switch (modalState) {
      case 'asking':
        return (
          <>
            <h1 className="text-xl font-bold text-manjaro-green mb-2 text-center">
              Bem-vindo ao meu Portfólio!
            </h1>
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
                Eu sou um recrutador!
              </button>
              <button
                onClick={() => setModalState('welcomed_visitor')}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Não sou um recrutador
              </button>
            </div>
          </>
        );
      case 'welcomed_visitor':
        return (
          <>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-6 text-center leading-relaxed">
              Tudo bem, vamos entrar
            </h2>
            <div className="flex justify-center">
              <button
                onClick={() => setModalState('closed')}
                className="px-8 py-3 bg-manjaro-green text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Entrar
              </button>
            </div>
          </>
        );
      case 'welcomed_recruiter':
        return (
          <>
            <h2 className="text-2xl font-bold text-manjaro-green mb-4 text-center">
              Seja muito bem-vindo!
            </h2>
            <p className="text-center text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Este portfólio mostra o meu lado que o currículo não consegue alcançar. Fique à vontade para explorar.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setModalState('closed')}
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Entrar
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-center items-start pt-[10vh] md:pt-[15vh] p-4 pointer-events-none">
        {/* Subtle backdrop that keeps the spheres visible but prevents interaction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/5 dark:bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={() => modalState === 'welcomed_recruiter' || modalState === 'welcomed_visitor' ? setModalState('closed') : null}
        />

        {/* Modal Container Fixed at Top 10% */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center pointer-events-auto gap-8 md:gap-12"
        >
          {/* Image Slot - Fully Transparent Container */}
          <div className="w-64 h-64 shrink-0 flex items-center justify-center bg-transparent">
            <img
              src={`/src/assets/${chibiImage}`}
              alt="Lucas - Chibi Avatar"
              className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          </div>

          {/* Content Slot */}
          <div className="flex-1 w-full flex flex-col justify-center min-h-[200px]">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomeModal;
