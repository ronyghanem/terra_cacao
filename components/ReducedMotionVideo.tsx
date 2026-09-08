"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
};

export default function ReducedMotionVideo({
  src,
  poster,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const handleMotionPreference = () => {
      if (mediaQuery.matches) {
        video.removeAttribute("autoplay");
        video.pause();
      }
    };

    handleMotionPreference();

    mediaQuery.addEventListener(
      "change",
      handleMotionPreference
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleMotionPreference
      );
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}