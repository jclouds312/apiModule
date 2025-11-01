'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import FOG from 'vanta/dist/vanta.fog.min';
import * as THREE from 'three';

export default function VantaBackground() {
  const { theme } = useTheme();
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: theme === 'dark' ? 0x22d3ee : 0x3b82f6,
          midtoneColor: theme === 'dark' ? 0x9333ea : 0x22d3ee,
          lowlightColor: theme === 'dark' ? 0x0f172a : 0xc4b5fd,
          baseColor: theme === 'dark' ? 0x0f172a : 0xffffff,
          blurFactor: 0.5,
          speed: 1.2,
          zoom: 0.8,
        })
      );
    }
  }, [theme, vantaEffect]);

  useEffect(() => {
    if (vantaEffect) {
      vantaEffect.setOptions({
        highlightColor: theme === 'dark' ? 0x22d3ee : 0x3b82f6,
        midtoneColor: theme === 'dark' ? 0x9333ea : 0x22d3ee,
        lowlightColor: theme === 'dark' ? 0x0f172a : 0xc4b5fd,
        baseColor: theme === 'dark' ? 0x0f172a : 0xffffff,
      });
      vantaEffect.resize();
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [theme, vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 z-[-1] h-screen w-screen"
    />
  );
}
