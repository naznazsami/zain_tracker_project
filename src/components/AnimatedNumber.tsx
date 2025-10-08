"use client";
import { useEffect, useRef } from "react";

export default function AnimatedNumber({ value, duration = 800, prefix = "", suffix = "" }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const latest = useRef<number>(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const start = latest.current;
    const end = value;
    const delta = end - start;
    const startTime = performance.now();

    let raf = 0;
    const step = (t: number) => {
      const elapsed = Math.min(1, (t - startTime) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = start + delta * eased;
      node.textContent = `${prefix}${current.toFixed(0)}${suffix}`;
      if (elapsed < 1) {
        raf = requestAnimationFrame(step);
      } else {
        latest.current = end;
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, prefix, suffix]);

  return <span ref={ref}>{`${prefix}${value.toFixed(0)}${suffix}`}</span>;
}


