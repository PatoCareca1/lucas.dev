import React from 'react';

interface ReadingProgressBarProps {
    progress: number;
    reducedMotion: boolean;
}

const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ progress, reducedMotion }) => (
    <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] z-40 bg-gray-900/[0.07] dark:bg-white/[0.06]"
    >
        <div
            className={`h-full bg-manjaro-green ${reducedMotion ? '' : 'transition-[width] duration-150 ease-linear'}`}
            style={{ width: `${progress}%` }}
        />
    </div>
);

export default ReadingProgressBar;
