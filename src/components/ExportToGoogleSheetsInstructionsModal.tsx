'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, X, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ExportInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: string[];
  onOpenGoogleSheets: () => void;
}

export default function ExportToGoogleSheetsInstructionsModal({
  isOpen,
  onClose,
  title,
  steps,
  onOpenGoogleSheets
}: ExportInstructionsModalProps) {
  const [isCopied, setIsCopied] = React.useState(true);
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { when: "beforeChildren" }
    },
    exit: { 
      opacity: 0,
      transition: { when: "afterChildren" }
    }
  };
  
  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 500
      } 
    },
    exit: { 
      y: 50, 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };
  
  const stepVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        damping: 20, 
        stiffness: 300
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div 
            className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative flex items-center justify-between p-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-[rgb(32,34,38)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[rgb(39,154,170)]/20 text-[rgb(39,154,170)]">
                  <FileSpreadsheet size={22} />
                </div>
                <h3 className="text-lg font-medium text-white">{title}</h3>
              </div>
              
              <motion.button 
                className="rounded-full p-1 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            
            {/* Copy status indicator */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-2 p-2 rounded-md bg-[rgb(39,154,170)]/10 text-[rgb(39,154,170)]">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    repeatType: "reverse"
                  }}
                >
                  <CheckCircle2 size={18} />
                </motion.div>
                <span className="text-sm">
                  Your CRM data has been copied to clipboard
                </span>
              </div>
            </div>
            
            {/* Steps list */}
            <div className="px-6 py-4">
              <motion.div 
                className="space-y-3 mb-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {steps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    className="flex gap-3 items-start"
                    variants={stepVariant}
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[rgb(39,154,170)]/20 text-[rgb(39,154,170)] text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            {/* Action buttons */}
            <div className="p-4 bg-gray-800/40 flex justify-end gap-3">
              <motion.button
                className="flex items-center gap-2 px-4 py-2.5 rounded-md text-gray-300 hover:bg-gray-700/70 transition text-sm"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[rgb(39,154,170)] hover:bg-[rgb(39,154,170)]/90 text-white transition text-sm shadow-lg shadow-[rgb(39,154,170)]/20"
                onClick={onOpenGoogleSheets}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <ExternalLink size={16} />
                <span>Open Google Sheets</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
