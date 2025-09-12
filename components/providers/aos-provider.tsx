"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";


export function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 400,          // shorter animation duration (better perf)
      once: true,             // animate once for less CPU usage
      easing: "ease-out",     // smooth easing
      mirror: false,          // avoid animating elements when scrolling back
      offset: 40              // slight offset before triggering
    });
  }, []);

  return <>{children}</>;
}
