import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TerminalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface OutputLine {
    id: string;
    text: string | React.ReactNode;
    isCommand: boolean;
}

const MANJARO_ASCII = (
    <pre className="text-manjaro-green font-mono text-xs md:text-sm leading-tight mb-2">
        {`██████████████████  ████████
██████████████████  ████████
██████████████████  ████████
██████████████████  ████████
████████            ████████
████████  ████████  ████████
████████  ████████  ████████
████████  ████████  ████████
████████  ████████  ████████
████████  ████████  ████████
████████  ████████  ████████
████████  ████████  ████████
████████  ████████  ████████
████████  ████████  ████████`}
    </pre>
);

const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<OutputLine[]>([{ id: 'init-1', text: 'Welcome to Lucas Portfolio Pro Terminal.', isCommand: false }, { id: 'init-2', text: 'Type "help" for a list of available commands.', isCommand: false }]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [quizActive, setQuizActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [output]);

    // Command Registry Map
    const executeCommand = (cmdStr: string) => {
        const cmd = cmdStr.trim().toLowerCase();

        if (cmd === '') return;

        if (cmd === 'clear') {
            setOutput([]);
            return;
        }

        const commandRegistry: Record<string, () => React.ReactNode | string> = {
            'help': () => 'Available commands: help, clear, neofetch, whoami, date, challenge, specs',
            'whoami': () => 'guest-user',
            'date': () => new Date().toISOString(),
            'specs': () => (
                <div className="flex flex-col gap-1 my-2">
                    <div className="text-teal-400 font-bold border-b border-gray-700 pb-1 mb-1">Server Specifications</div>
                    <div><span className="text-manjaro-green">CPU:</span> Oster Air Fryer (4.5L High Performance)</div>
                    <div><span className="text-manjaro-green">GPU:</span> Moto G85 Adreno Integrated Graphics</div>
                    <div><span className="text-manjaro-green">OS:</span> Manjaro OS (btw)</div>
                    <div className="text-xs text-gray-500 mt-2">Running Lucas Portfolio Pro at peak efficiency.</div>
                </div>
            ),
            'challenge': () => {
                setQuizActive(true);
                return (
                    <div className="text-yellow-400">
                        [CHALLENGE MODE ACTIVATED]<br />
                        Question: Qual gerenciador de pacotes é nativamente associado ao Arch Linux e Manjaro?
                    </div>
                );
            },
            'neofetch': () => (
                <div className="flex flex-col md:flex-row gap-4 my-2">
                    <div>{MANJARO_ASCII}</div>
                    <div className="flex flex-col justify-center text-gray-300 text-sm">
                        <p><span className="text-manjaro-green font-bold">OS:</span> Manjaro Linux x86_64</p>
                        <p><span className="text-manjaro-green font-bold">Host:</span> Lucas Portfolio Pro</p>
                        <p><span className="text-manjaro-green font-bold">Kernel:</span> React-Vite-Tailwind</p>
                        <p><span className="text-manjaro-green font-bold">Uptime:</span> Unknown</p>
                        <p><span className="text-manjaro-green font-bold">Packages:</span> 1337 (npm)</p>
                        <p><span className="text-manjaro-green font-bold">Shell:</span> portfolio-sh</p>
                        <p><span className="text-manjaro-green font-bold">Theme:</span> Dark</p>
                        <div className="flex gap-1 mt-2">
                            <div className="w-4 h-4 bg-black"></div>
                            <div className="w-4 h-4 bg-red-500"></div>
                            <div className="w-4 h-4 bg-green-500"></div>
                            <div className="w-4 h-4 bg-yellow-500"></div>
                            <div className="w-4 h-4 bg-blue-500"></div>
                            <div className="w-4 h-4 bg-purple-500"></div>
                            <div className="w-4 h-4 bg-cyan-500"></div>
                            <div className="w-4 h-4 bg-white"></div>
                        </div>
                    </div>
                </div>
            ),
        };

        const handler = commandRegistry[cmd];
        const result = handler ? handler() : `command not found: ${cmd}`;

        setOutput(prev => [
            ...prev,
            { id: Date.now().toString() + '-cmd', text: cmd, isCommand: true },
            { id: Date.now().toString() + '-res', text: result, isCommand: false }
        ]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const currentInput = input.trim();

            if (quizActive) {
                if (currentInput.toLowerCase() === 'pacman') {
                    import('canvas-confetti').then((confetti) => confetti.default());
                    setOutput(prev => [
                        ...prev,
                        { id: Date.now() + '-ans', text: currentInput, isCommand: true },
                        { id: Date.now() + '-res', text: <span className="text-manjaro-green font-bold text-lg">Acertou! Você sabe das coisas. 🎉</span>, isCommand: false }
                    ]);
                    setQuizActive(false);
                } else if (currentInput.toLowerCase() === 'exit' || currentInput.toLowerCase() === 'sair') {
                    setOutput(prev => [
                        ...prev,
                        { id: Date.now() + '-ans', text: currentInput, isCommand: true },
                        { id: Date.now() + '-res', text: <span className="text-gray-400">Desafio abortado.</span>, isCommand: false }
                    ]);
                    setQuizActive(false);
                } else {
                    setOutput(prev => [
                        ...prev,
                        { id: Date.now() + '-ans', text: currentInput, isCommand: true },
                        { id: Date.now() + '-res', text: <span className="text-red-500">Incorreto. Tente novamente, ou digite 'exit' para sair.</span>, isCommand: false }
                    ]);
                }
                setInput('');
                return;
            }

            if (currentInput) {
                const newHistory = [...history, currentInput];
                setHistory(newHistory);
                setHistoryIndex(-1);
                executeCommand(input);
            } else {
                setOutput(prev => [...prev, { id: Date.now().toString(), text: '', isCommand: true }]);
            }
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!quizActive && history.length > 0) {
                const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(nextIndex);
                setInput(history[nextIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const nextIndex = historyIndex + 1;
                if (nextIndex >= history.length) {
                    setHistoryIndex(-1);
                    setInput('');
                } else {
                    setHistoryIndex(nextIndex);
                    setInput(history[nextIndex]);
                }
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-3xl h-[60vh] bg-terminal-bg border border-terminal-border rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex justify-between items-center px-4 py-2 bg-[#1e2329] border-b border-terminal-border cursor-default">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-400 text-sm font-medium">guest@lucas-portfolio:~</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 text-gray-300">
                    {output.map((line) => (
                        <div key={line.id} className="mb-1">
                            {line.isCommand ? (
                                <div className="flex gap-2">
                                    <span className="text-manjaro-green font-bold">➜</span>
                                    <span className="text-cyan-400 font-bold">~</span>
                                    <span className="text-white">{line.text}</span>
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap break-all">{line.text}</div>
                            )}
                        </div>
                    ))}
                    <div className="flex gap-2 mt-1 items-center">
                        <span className="text-manjaro-green font-bold">➜</span>
                        <span className="text-cyan-400 font-bold">~</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck="false"
                            autoComplete="off"
                            className="flex-grow bg-transparent border-none outline-none text-white caret-gray-300 font-mono shadow-none focus:ring-0 p-0"
                            autoFocus
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminalModal;
