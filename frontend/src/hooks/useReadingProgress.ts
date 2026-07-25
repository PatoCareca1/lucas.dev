import { useEffect, useRef, useState, type RefObject } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface UseReadingProgressResult {
    progress: number;
    reducedMotion: boolean;
}

export const useReadingProgress = (ref: RefObject<HTMLElement | null>): UseReadingProgressResult => {
    const [progress, setProgress] = useState(0);
    const reducedMotion = usePrefersReducedMotion();
    const frame = useRef<number | undefined>(undefined);

    useEffect(() => {
        const measure = () => {
            frame.current = undefined;
            const element = ref.current;
            if (!element) return;

            const top = element.getBoundingClientRect().top + window.scrollY;
            const span = element.offsetHeight - window.innerHeight;

            if (span <= 0) {
                setProgress(window.scrollY >= top ? 100 : 0);
                return;
            }

            const ratio = ((window.scrollY - top) / span) * 100;
            setProgress(Math.min(100, Math.max(0, ratio)));
        };

        const onScroll = () => {
            if (frame.current !== undefined) return;
            frame.current = window.requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame.current !== undefined) window.cancelAnimationFrame(frame.current);
        };
    }, [ref]);

    return { progress, reducedMotion };
};
