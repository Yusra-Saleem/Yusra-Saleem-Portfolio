import { useEffect } from "react";

export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            console.log(`FCP: ${entry.startTime.toFixed(2)}ms`);
          }
          if (entry.entryType === "largest-contentful-paint") {
            console.log(`LCP: ${entry.startTime.toFixed(2)}ms`);
          }
          if (
            entry.entryType === "layout-shift" &&
            !(entry as any).hadRecentInput
          ) {
            console.log(`CLS: ${(entry as any).value?.toFixed(3)}`);
          }
        }
      });

      observer.observe({
        entryTypes: ["paint", "largest-contentful-paint", "layout-shift"]
      });

      return () => observer.disconnect();
    }
  }, []);
}