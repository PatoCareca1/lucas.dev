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
            whileHover={{ scale: 1.03 }}
        >
            {/* Subtle outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-manjaro-green/40 shadow-[0_0_12px_rgba(53,191,92,0.15)]"></div>

            {/* Image Container */}
            <div className="w-full h-full rounded-full border-2 border-manjaro-green/60 flex items-center justify-center overflow-hidden bg-[#1e2329]">
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
