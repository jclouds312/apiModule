'use client';

import { useState, useEffect, useRef } from 'react';
import WAVES from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';

export default function VantaBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  useEffect(() => {
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
          color: 0x3b82f6,
          shininess: 60,
          waveHeight: 15,
          waveSpeed: 0.25,
          zoom: 1.1,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="fixed inset-0 -z-10 h-screen w-screen" />;
}
