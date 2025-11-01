'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import WAVES from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';

export default function VantaBackground() {
  const { theme } = useTheme();
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    // Only initialize Vanta when the component mounts
    if (!vantaEffect) {
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          // Colors are set in the next useEffect
        })
      );
    }
  }, [vantaEffect]); // Run only once

  useEffect(() => {
    // Update colors when theme changes
    if (vantaEffect) {
      vantaEffect.setOptions({
        color: theme === 'dark' ? 0x152238 : 0x93c5fd, // A darker blue for dark, a light blue for light
        shininess: 35,
        waveHeight: 15,
        waveSpeed: 0.25,
        zoom: 0.9,
      });
      vantaEffect.resize();
    }

    // Cleanup function to destroy Vanta effect on unmount or re-render
    return () => {
      if (vantaEffect) {
        // vantaEffect.destroy();
      }
    };
  }, [theme, vantaEffect]);


  // A separate effect for cleanup on component unmount
   useEffect(() => {
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 z-[-1] h-screen w-screen"
    />
  );
}
