// Animation variants for the setup wizard components

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: { when: "afterChildren" }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    }
  },
  exit: { y: -20, opacity: 0 }
};

export const slideVariants = {
  hidden: { x: 300, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      mass: 1.2
    }
  },
  exit: { 
    x: -300, 
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: "easeInOut" 
    }
  }
};

// Background animation properties for the gradient blobs
export const backgroundAnimations = {
  topRight: {
    animate: {
      scale: [1, 1.4, 0.9, 1.3, 1],
      opacity: [0.3, 0.7, 0.2, 0.6, 0.3],
      x: [0, 60, -20, 40, 0],
      y: [0, -50, 30, -30, 0],
      rotate: [0, 45, -20, 30, 0]
    },
    transition: {
      duration: 25,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  },
  bottomLeft: {
    animate: {
      scale: [1.2, 0.7, 1.5, 0.9, 1.2],
      opacity: [0.4, 0.8, 0.3, 0.7, 0.4],
      x: [0, -60, 40, -40, 0],
      y: [0, 70, -30, 50, 0],
      rotate: [0, -30, 60, -45, 0]
    },
    transition: {
      duration: 22,
      repeat: Infinity,
      repeatType: "reverse" as const,
      delay: 1,
      ease: "easeInOut"
    }
  },
  centerLeft: {
    animate: {
      scale: [0.8, 1.6, 0.6, 1.2, 0.8],
      opacity: [0.3, 0.6, 0.1, 0.5, 0.3],
      y: [0, -90, 60, -70, 0],
      x: [0, 50, -40, 30, 0],
      rotate: [0, 90, -60, 45, 0]
    },
    transition: {
      duration: 28,
      repeat: Infinity,
      repeatType: "reverse" as const,
      delay: 2,
      ease: "easeInOut"
    }
  },
  bottomRight: {
    animate: {
      scale: [1, 0.6, 1.4, 0.85, 1],
      opacity: [0.2, 0.6, 0.1, 0.4, 0.2],
      y: [0, 60, -40, 40, 0],
      x: [0, -30, 50, -20, 0],
      rotate: [0, -45, 90, -30, 0]
    },
    transition: {
      duration: 20,
      repeat: Infinity,
      repeatType: "reverse" as const,
      delay: 3,
      ease: "easeInOut"
    }
  },
  accent1: {
    animate: {
      scale: [1, 2.2, 0.5, 1.8, 1],
      opacity: [0.1, 0.4, 0.05, 0.3, 0.1],
      x: [0, 80, -60, 40, 0],
      y: [0, -40, 80, -20, 0],
      rotate: [0, 180, -90, 135, 0]
    },
    transition: {
      duration: 35,
      repeat: Infinity,
      repeatType: "reverse" as const,
      delay: 4,
      ease: "easeInOut"
    }
  },
  accent2: {
    animate: {
      scale: [1, 0.4, 2, 0.8, 1],
      opacity: [0.12, 0.5, 0.08, 0.35, 0.12],
      x: [0, -50, 70, -30, 0],
      y: [0, 60, -80, 40, 0],
      rotate: [0, -120, 240, -60, 0]
    },
    transition: {
      duration: 30,
      repeat: Infinity,
      repeatType: "reverse" as const,
      delay: 5,
      ease: "easeInOut"
    }
  }
};

// Light trail animations - super dynamic and exciting!
export const lightTrailAnimations = {
  horizontal1: {
    animate: {
      scaleX: [0, 1.5, 0.3, 2, 0],
      opacity: [0, 0.8, 0.2, 0.6, 0],
      x: ["-100%", "50%", "-50%", "100%", "-100%"],
      scaleY: [1, 3, 0.5, 2, 1]
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.3, 0.5, 0.8, 1]
    }
  },
  horizontal2: {
    animate: {
      scaleX: [0, 2, 0.5, 1.8, 0],
      opacity: [0, 0.9, 0.3, 0.7, 0],
      x: ["100%", "-30%", "80%", "-100%", "100%"],
      scaleY: [1, 4, 0.3, 2.5, 1]
    },
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2,
      times: [0, 0.25, 0.6, 0.85, 1]
    }
  },
  vertical1: {
    animate: {
      scaleY: [0, 1.8, 0.4, 2.2, 0],
      opacity: [0, 0.7, 0.15, 0.5, 0],
      y: ["-100%", "40%", "-60%", "100%", "-100%"],
      scaleX: [1, 5, 0.8, 3, 1]
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
      times: [0, 0.35, 0.55, 0.9, 1]
    }
  },
  vertical2: {
    animate: {
      scaleY: [0, 2.5, 0.2, 1.5, 0],
      opacity: [0, 0.8, 0.1, 0.6, 0],
      y: ["100%", "-50%", "70%", "-100%", "100%"],
      scaleX: [1, 6, 0.5, 4, 1]
    },
    transition: {
      duration: 14,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 3,
      times: [0, 0.3, 0.7, 0.9, 1]
    }
  },
  diagonal1: {
    animate: {
      scaleX: [0, 1.2, 0.6, 2.5, 0],
      opacity: [0, 0.6, 0.25, 0.8, 0],
      x: ["-100%", "20%", "-40%", "150%", "-100%"],
      rotate: [-12, -8, -15, -5, -12],
      scaleY: [1, 8, 2, 12, 1]
    },
    transition: {
      duration: 16,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2.5,
      times: [0, 0.4, 0.6, 0.85, 1]
    }
  },
  diagonal2: {
    animate: {
      scaleX: [0, 2, 0.3, 1.8, 0],
      opacity: [0, 0.5, 0.12, 0.7, 0],
      x: ["-100%", "60%", "-20%", "120%", "-100%"],
      rotate: [6, 12, 3, 9, 6],
      scaleY: [1, 10, 1.5, 15, 1]
    },
    transition: {
      duration: 18,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 4.5,
      times: [0, 0.3, 0.65, 0.9, 1]
    }
  }
};

// Particle animations - super fun and lively!
export const particleAnimations = {
  float: {
    animate: {
      y: [0, -100, 50, -150, 0],
      x: [0, 60, -40, 80, 0],
      opacity: [0, 0.8, 0.3, 0.9, 0],
      scale: [0.5, 1.5, 0.8, 2, 0.5],
      rotate: [0, 360, -180, 540, 0]
    },
    transition: {
      duration: 25,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.25, 0.5, 0.75, 1]
    }
  },
  orb: {
    animate: {
      scale: [0.8, 1.6, 0.4, 1.2, 0.8],
      opacity: [0.1, 0.4, 0.05, 0.3, 0.1],
      y: [0, -80, 120, -60, 0],
      x: [0, 50, -70, 40, 0],
      rotate: [0, 180, -90, 270, 0]
    },
    transition: {
      duration: 30,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.3, 0.6, 0.8, 1]
    }
  },
  pulse: {
    animate: {
      scale: [1, 8, 2, 12, 1],
      opacity: [0.6, 0.1, 0.8, 0.05, 0.6],
      rotate: [0, 720, -360, 1080, 0]
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  scanLine: {
    animate: {
      y: ["-100%", "100%"],
      opacity: [0, 0.8, 0.6, 0.9, 0],
      scaleX: [0.5, 2, 1.5, 3, 0.5],
      scaleY: [1, 6, 3, 8, 1]
    },
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.3, 0.6, 0.8, 1]
    }
  },
  meteor: {
    animate: {
      x: ["-100%", "150%"],
      y: ["150%", "-100%"],
      opacity: [0, 1, 0.8, 0],
      scale: [0, 2, 1.5, 0],
      rotate: [0, 360]
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      repeatDelay: 8
    }
  },
  sparkle: {
    animate: {
      scale: [0, 1.5, 0],
      opacity: [0, 1, 0],
      rotate: [0, 180, 360]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      repeatDelay: 1
    }
  },
  wave: {
    animate: {
      scaleY: [0, 3, 1, 4, 0],
      opacity: [0, 0.6, 0.3, 0.8, 0],
      x: [0, 100, -50, 150, 0]
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  ripple: {
    animate: {
      scale: [0, 20],
      opacity: [1, 0],
      borderWidth: [10, 0]
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeOut",
      repeatDelay: 2
    }
  },
  vortex: {
    animate: {
      rotate: [0, 1080],
      scale: [1, 0.2, 2, 0.5, 1],
      opacity: [0.3, 0.8, 0.1, 0.6, 0.3]
    },
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  energy: {
    animate: {
      scale: [1, 3, 0.5, 4, 1],
      opacity: [0.4, 0.1, 0.9, 0.05, 0.4],
      rotate: [0, -720, 360, -1080, 0],
      x: [0, 30, -40, 60, 0],
      y: [0, -50, 80, -30, 0]
    },
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Exciting new animation types for extra visual flair
export const specialEffects = {
  lightning: {
    animate: {
      opacity: [0, 1, 0, 1, 0, 1, 0],
      scale: [0.5, 2, 0.8, 3, 1, 2.5, 0.5]
    },
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatDelay: 5,
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1]
    }
  },
  aurora: {
    animate: {
      background: [
        "linear-gradient(45deg, rgba(59,130,246,0.3), rgba(147,51,234,0.3))",
        "linear-gradient(90deg, rgba(16,185,129,0.3), rgba(59,130,246,0.3))",
        "linear-gradient(135deg, rgba(236,72,153,0.3), rgba(16,185,129,0.3))",
        "linear-gradient(180deg, rgba(147,51,234,0.3), rgba(236,72,153,0.3))"
      ],
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, 90, -45, 180, 0]
    },
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  glitch: {
    animate: {
      x: [0, -2, 4, -1, 3, 0],
      y: [0, 1, -3, 2, -1, 0],
      skewX: [0, 2, -4, 1, -2, 0],
      opacity: [1, 0.8, 1, 0.9, 1]
    },
    transition: {
      duration: 0.2,
      repeat: Infinity,
      repeatDelay: 3,
      ease: "easeInOut"
    }
  }
};