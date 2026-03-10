import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import TerminalModal from './TerminalModal';
import { motion, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface AnimatedSphereProps {
    baseX: number;
    baseY: number;
    size: number;
    mousePos: { x: number; y: number };
    isDark: boolean;
}

const AnimatedSphere: React.FC<AnimatedSphereProps> = ({ baseX, baseY, size, mousePos, isDark }) => {
    const dx = baseX - mousePos.x;
    const dy = baseY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const interactionRadius = 600; // Range of effect
    const repulsionRadius = 100; // Too close -> push away
    const maxDisplacement = 200;

    let targetX = baseX - (size / 2); // Center the sphere
    let targetY = baseY - (size / 2);

    // Gravitational Orbit Physics
    if (distance > 0 && distance < interactionRadius) {
        if (distance < repulsionRadius) {
            // Repulsion (too close)
            const force = Math.pow((repulsionRadius - distance) / repulsionRadius, 2);
            targetX += (dx / distance) * force * maxDisplacement;
            targetY += (dy / distance) * force * maxDisplacement;
        } else {
            // Attraction / Trail (follow the cursor)
            // Creates a gentle pull towards the cursor, peaking around the mid-distance
            const pullForce = Math.sin(((distance - repulsionRadius) / (interactionRadius - repulsionRadius)) * Math.PI);
            targetX -= (dx / distance) * pullForce * (maxDisplacement * 0.5);
            targetY -= (dy / distance) * pullForce * (maxDisplacement * 0.5);
        }
    }

    // Authentic friction/trail settings: low damping, higher stiffness
    const springX = useSpring(targetX, { damping: 10, stiffness: 100, mass: 1 });
    const springY = useSpring(targetY, { damping: 10, stiffness: 100, mass: 1 });

    useEffect(() => {
        springX.set(targetX);
        springY.set(targetY);
    }, [targetX, targetY, springX, springY]);

    // Dynamic Visibility & Styling based on cursor distance
    const proximityRatio = Math.max(0, 1 - (distance / interactionRadius));

    const darkStyle = {
        backgroundColor: '#000000', // Black spheres
        border: 'none',
        boxShadow: `0 0 ${3 + (proximityRatio * 10)}px #35bf5c`, // Start with 3px manjarogreen glow
        opacity: 0.8, // Brighter opacity
        filter: 'none' // Remove blur for sharper visibility
    };

    const lightStyle = {
        backgroundColor: '#0f172a', // Deep slate/navy
        border: 'none',
        boxShadow: `0 2px 4px rgba(15, 23, 42, 0.3)`, // Suble sharp drop shadow
        opacity: 1.0, // Solid visibility
        filter: 'none' // Sharp droplets
    };

    const currentStyle = isDark ? darkStyle : lightStyle;

    return (
        <motion.div
            style={{
                x: springX,
                y: springY,
                width: size,
                height: size,
                ...currentStyle
            }}
            className="absolute rounded-full pointer-events-none"
        />
    );
};

const Layout: React.FC = () => {
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [mousePosition, setMousePosition] = useState({ x: -2000, y: -2000 }); // start well off-screen
    const [windowSize, setWindowSize] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1000, h: typeof window !== 'undefined' ? window.innerHeight : 800 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        const handleResize = () => {
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsTerminalOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Interactive Console Dev Easter Egg
    useEffect(() => {
        console.log(
            '%c System operational. 10 years of passion, 8 years of code. Hire me? [y/n] \n%c \n Hello Recruiter/Dev! Looking for source code or want to chat? \n Try pressing Ctrl+Shift+K to open the terminal, or just contact me directly!',
            'color: #35bf5c; font-weight: bold; font-size: 14px; padding: 4px; border: 1px solid #35bf5c; border-radius: 4px; background: #000;',
            'color: #888; font-size: 12px; font-style: italic; margin-top: 4px;'
        );
    }, []);

    // Generate 50 stable random spheres
    const [sphereConfigs] = useState(() => {
        const configs = [];
        for (let i = 0; i < 50; i++) {
            // Varying sizes between 2px and 8px for depth
            const s = Math.random() * 6 + 2;
            // Random colorful hues for light mode
            const rawHue = Math.floor(Math.random() * 360);
            const cLight = `hsla(${rawHue}, 70%, 50%, 0.6)`;

            configs.push({
                x: Math.random(),
                y: Math.random(),
                s,
                cLight
            });
        }
        return configs;
    });

    // Mouse follower light spring to smooth it out slightly if desired, though direct follow is also fine
    const lightX = useSpring(mousePosition.x - 400, { damping: 40, stiffness: 300 });
    const lightY = useSpring(mousePosition.y - 400, { damping: 40, stiffness: 300 });

    useEffect(() => {
        lightX.set(mousePosition.x - 400);
        lightY.set(mousePosition.y - 400);
    }, [mousePosition.x, mousePosition.y, lightX, lightY]);

    return (
        <div className={`flex flex-col min-h-screen bg-white ${isDark ? 'dark:bg-[#0a0a0b]' : ''} relative overflow-hidden transition-colors duration-500`}>

            {/* Layer 0: Particles Matrix */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-transparent">
                {sphereConfigs.map((cfg, idx) => (
                    <AnimatedSphere
                        key={idx}
                        baseX={windowSize.w * cfg.x}
                        baseY={windowSize.h * cfg.y}
                        size={cfg.s}
                        mousePos={mousePosition}
                        isDark={isDark}
                    />
                ))}
            </div>

            {/* Layer 5: Interactive Lighting Follower (Between Particles and Content) */}
            <motion.div
                style={{ x: lightX, y: lightY }}
                className={`fixed w-[800px] h-[800px] rounded-full pointer-events-none z-[5] transition-opacity duration-300 ${isDark ? 'mix-blend-plus-lighter' : 'mix-blend-multiply'} ${mousePosition.x < 0 ? 'opacity-0' : 'opacity-100'}`}
                animate={{
                    background: isDark
                        ? 'radial-gradient(circle, rgba(53,191,92,0.3) 0%, transparent 60%)'
                        : 'radial-gradient(circle, rgba(15,23,42,0.05) 0%, transparent 60%)'
                }}
            />

            {/* Layer 10: Flowing Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                {/* Main changed to completely transparent with backdrop blur to let everything shine through */}
                <main className="flex-grow bg-transparent backdrop-blur-[2px] transition-colors duration-300">
                    <Outlet />
                </main>
            </div>

            {/* Invisible FAB trigger at the bottom right corner */}
            <div
                className="fixed bottom-0 right-0 w-8 h-8 cursor-default z-[90]"
                onClick={() => setIsTerminalOpen(true)}
                aria-hidden="true"
            />

            <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        </div>
    );
};

export default Layout;
