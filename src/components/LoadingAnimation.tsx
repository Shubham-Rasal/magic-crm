"use client";

import { motion } from "framer-motion";

interface LoadingAnimationProps {
  companyName?: string;
}

export default function LoadingAnimation({ companyName = "your company" }: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-56 h-56">
        {/* Base circle */}
        <motion.div 
          className="w-56 h-56 border-4 border-secondary/20 rounded-full absolute"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Spinning arc */}
        <motion.div 
          className="w-56 h-56 border-4 border-transparent border-t-secondary rounded-full absolute"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.4, 
            ease: "linear", 
            repeat: Infinity 
          }}
        />
        
        {/* Orbiting dots */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
            initial={{ rotate: i * 72 }}
            animate={{ rotate: i * 72 + 360 }}
            transition={{ 
              duration: 8, 
              ease: "linear", 
              repeat: Infinity 
            }}
          >
            <motion.div 
              className="w-4 h-4 rounded-full bg-secondary"
              style={{ 
                x: 110,
                opacity: 0.8 - (i * 0.15)
              }}
              animate={{ 
                scale: [1, 1.3, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.4 
              }}
            />
          </motion.div>
        ))}
        
        {/* Pulsing center */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-secondary rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6] 
          }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        />
      </div>
      
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">Analyzing {companyName}...</h3>
        <p className="text-secondary/80 text-lg max-w-md">
          We're using AI to gather insights about your company
        </p>
      </motion.div>
      
      {/* Animated progress text */}
      <motion.div
        className="mt-8 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div 
          className="text-white/70 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <LoadingMessage />
        </motion.div>
      </motion.div>
    </div>
  );
}

function LoadingMessage() {
  const messages = [
    "Scanning industry databases...",
    "Analyzing market positioning...",
    "Identifying geographical presence...",
    "Extracting company vision...",
    "Detecting sales channels...",
    "Synthesizing strategic partnerships..."
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5 }
        }}
        exit={{ 
          opacity: 0,
          y: -10,
          transition: { duration: 0.3 }
        }}
      >
        {messages.map((message, index) => (
          <motion.p 
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: "auto",
              transition: { delay: index * 2, duration: 0.5 } 
            }}
            className="h-6 my-1"
          >
            {message}
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  );
}
