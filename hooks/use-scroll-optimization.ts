import { useEffect, useCallback } from "react";

/**
 * useScrollOptimization
 * Optimizes scroll performance by batching DOM reads/writes and limiting style recalculations.
 * Ensures accessibility & performance without UI changes.
 */
export function useScrollOptimization() {
  // Reusable debounce utility
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const optimizeScroll = useCallback(() => {
    let ticking = false;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section"));

    const onScroll = debounce(() => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const viewportHeight = window.innerHeight;

          for (const section of sections) {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < viewportHeight && rect.bottom > 0;

            // Apply will-change only when visible (reduces GPU memory usage)
            section.style.willChange = isVisible ? "transform, opacity" : "auto";
          }

          ticking = false;
        });
        ticking = true;
      }
    }, 120); // slightly longer debounce for fewer style recalcs

    document.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", onScroll);
      // cleanup any leftover will-change
      sections.forEach((section) => {
        section.style.willChange = "auto";
      });
    };
  }, []);

  useEffect(() => {
    const cleanup = optimizeScroll();
    return cleanup;
  }, [optimizeScroll]);
}
