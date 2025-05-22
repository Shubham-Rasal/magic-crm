import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SetupNavigationProps {
  currentStep: number;
  maxStep: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const SetupNavigation: React.FC<SetupNavigationProps> = ({
  currentStep,
  maxStep,
  loading,
  onPrevious,
  onNext
}) => {
  const router = useRouter();

  return (
    <motion.div 
      className="flex justify-between px-4 mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <motion.button
        type="button"
        onClick={onPrevious}
        disabled={currentStep <= 1}
        className={`px-6 py-3 text-base font-medium border border-secondary/50 text-white rounded-lg bg-transparent transition-all flex items-center gap-2
          ${currentStep <= 1 
            ? 'opacity-40 cursor-not-allowed' 
            : 'hover:bg-secondary/10'}`}
        whileHover={currentStep <= 1 ? {} : { scale: 1.02 }}
        whileTap={currentStep <= 1 ? {} : { scale: 0.98 }}
      >
        <ArrowLeft size={16} />
        Previous
      </motion.button>
      
      <div>
        <motion.button
          type="button"
          onClick={onNext}
          disabled={loading}
          className={`px-6 py-3 text-base font-medium bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2
            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          whileHover={loading ? {} : { scale: 1.02 }}
          whileTap={loading ? {} : { scale: 0.98 }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : currentStep < maxStep ? (
            <>
              {currentStep === 0 ? "Get Started" : "Continue"}
              <ArrowRight size={16} />
            </>
          ) : (
            <>
              Launch Your Sales Engine
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SetupNavigation;
