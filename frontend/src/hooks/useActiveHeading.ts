import { useCallback, useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const ROOT_MARGIN = '-96px 0px -65% 0px';
const SCROLL_OFFSET = 92;

interface UseActiveHeadingResult {
    activeAnchor: string;
    goTo: (anchor: string) => void;
    reducedMotion: boolean;
}

export const useActiveHeading = (anchors: string[]): UseActiveHeadingResult => {
    const [activeAnchor, setActiveAnchor] = useState(anchors[0] ?? '');
    const reducedMotion = usePrefersReducedMotion();

    const anchorKey = anchors.join('|');

    useEffect(() => {
        const list = anchorKey ? anchorKey.split('|') : [];
        if (!list.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible.length) setActiveAnchor(visible[0].target.id);
            },
            { rootMargin: ROOT_MARGIN, threshold: 0 },
        );

        list
            .map((anchor) => document.getElementById(anchor))
            .filter((element): element is HTMLElement => element !== null)
            .forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [anchorKey]);

    const goTo = useCallback(
        (anchor: string) => {
            const element = document.getElementById(anchor);
            if (!element) return;

            const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
            window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
            setActiveAnchor(anchor);
        },
        [reducedMotion],
    );

    return { activeAnchor, goTo, reducedMotion };
};
