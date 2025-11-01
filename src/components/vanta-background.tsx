'use client';

import { useState, useEffect, useRef } from 'react';
import WAVES from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

// Utility to convert HSL to a number format THREE.js understands
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return parseInt(`0x${f(0)}${f(8)}${f(4)}`);
};


export default function VantaBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    let color;
    // HSL values from globals.css
    // Primary Light: 235 48% 49%
    // Primary Dark: 235 48% 55%
    if (theme === 'dark') {
      color = hslToHex(235, 48, 55);
    } else {
      color = hslToHex(235, 48, 49);
    }
    
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
          color: color,
          shininess: 60,
          waveHeight: 15,
          waveSpeed: 0.25,
          zoom: 1.1,
        })
      );
    } else {
       // Update color when theme changes
       vantaEffect.setOptions({ color: color });
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [theme, vantaEffect]);

  return <div ref={vantaRef} className="fixed inset-0 -z-10 h-screen w-screen" />;
}
