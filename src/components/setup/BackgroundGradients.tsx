import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { backgroundAnimations } from '@/utils/animationVariants';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";

const BackgroundGradients: React.FC = () => {
  // Particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Optional callback for when particles container is loaded
  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // console.log(container);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {/* Particles background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        className="absolute inset-0 z-0"
        options={{
          fpsLimit: 60,
          fullScreen: false,
          background: {
            color: {
              value: "transparent",
            },
          },
          particles: {
            color: {
              value: ["#4338CA", "#2563EB", "#8B5CF6", "#3B82F6", "#6366F1"],
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 1500,
              },
              value: 50,
            },
            opacity: {
              value: 0.8,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
            links: {
              color: "#a5b4fc",
              distance: 150,
              enable: true,
              opacity: 0.6,
              width: 1,
            },
          },
          detectRetina: true,
        }}
      />

      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/60 to-[#0c0f1b]/60 z-10"></div>
    
      
    </div>
  );
};

export default BackgroundGradients;
