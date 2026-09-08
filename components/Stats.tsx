"use client";

import { useEffect, useRef, useState } from "react";

type StatProps = {
  target: number;
  suffix?: string;
  label: string;
};

function Stat({ target, suffix = "", label }: StatProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = statRef.current;

    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setCount(target);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.4,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!started) return;

    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const value = Math.floor(progress * target);

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [started, target]);

  return (
    <div ref={statRef} className="stat">
      <dt>{label}</dt>

      <dd>
        <span className="count">
          {count}
          {suffix}
        </span>
      </dd>
    </div>
  );
}

export default function Stats() {
  return (
    <dl className="story-stats">
      <Stat target={2015} label="Founded" />

      <Stat
        target={11}
        label="Farms we buy from directly"
      />

      <Stat
        target={6}
        suffix=" days"
        label="Days of fermentation, typical"
      />

      <Stat
        target={3}
        label="Ingredients in any bar, maximum"
      />
    </dl>
  );
}