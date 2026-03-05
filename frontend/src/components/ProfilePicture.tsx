import React from 'react';
import { motion } from 'framer-motion';

interface ProfilePictureProps {
    src?: string;
    alt?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ src, alt = "Lucas Profile" }) => {
    // Use Vite's asset handling for the placeholder
    const imageSrc = src || new URL('../assets/Perfil.jpg', import.meta.url).href;

    return (
        <motion.div
            className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
        >
            {/* Neon Glow Background */}
            <div className="absolute inset-0 bg-manjaro-green rounded-full blur-xl opacity-40 animate-pulse"></div>

            {/* Image Container with Neon Border */}
            <div className="w-full h-full rounded-full border-4 border-manjaro-green shadow-[0_0_20px_rgba(53,191,92,0.5)] flex items-center justify-center relative z-10 overflow-hidden bg-[#1e2329]">
                <img
                    src={imageSrc}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            </div>
        </motion.div>
    );
};

export default ProfilePicture;
