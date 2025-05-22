import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Loader2 } from 'lucide-react';
import { slideVariants, itemVariants } from '@/utils/animationVariants';

interface IntroStepProps {
  onContinue: () => void;
  userName?: string;
}

export const IntroStep: React.FC<IntroStepProps> = ({ onContinue, userName }) => {
  return (
    <motion.div
      key="intro"
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center flex flex-col items-center"
    >
      <motion.h1 
        variants={itemVariants}
        className="text-6xl font-extrabold text-white mb-6 tracking-tight"
      >
        Ready to Dominate Your Market?
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-secondary/90 text-xl mb-12 max-w-2xl mx-auto"
      >
        {userName ? `Welcome aboard, ${userName}!` : 'Welcome aboard!'} Let's supercharge your sales process and build your revenue machine.
      </motion.p>
      
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className="px-8 py-4 text-base font-semibold bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2"
      >
        Let's Get Started
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
};

interface CompanySearchStepProps {
  companyNameInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const CompanySearchStep: React.FC<CompanySearchStepProps> = ({
  companyNameInput,
  onInputChange,
  onSearch,
  isLoading
}) => {
  return (
    <motion.div
      key="companyNameStep"
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center flex flex-col items-center"
    >
      <motion.h1 
        variants={itemVariants}
        className="text-4xl font-bold text-white mb-6 tracking-tight"
      >
        Let's start with your company
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-secondary/90 text-lg mb-10 max-w-2xl mx-auto"
      >
        Enter your company name and our AI will gather key information to help you set up your sales engine.
      </motion.p>
      
      <motion.div
        variants={itemVariants}
        className="w-full max-w-lg mx-auto mb-10"
      >
        <div className="group relative">
          <input
            type="text"
            value={companyNameInput}
            onChange={onInputChange}
            className="w-full px-5 py-4 bg-black/10 backdrop-blur-sm border-0 border-b-2 border-secondary/40 focus:border-secondary focus:ring-0 text-white placeholder:text-white/40 text-xl rounded-t-lg transition-all duration-300 group-hover:bg-black/20"
            placeholder="Your company name"
          />
        </div>
      </motion.div>
      
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSearch}
        disabled={!companyNameInput.trim() || isLoading}
        className={`px-8 py-4 text-base font-semibold bg-secondary text-white rounded-lg transition-all shadow-xl shadow-secondary/20 flex items-center gap-2
          ${!companyNameInput.trim() || isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary/90'}`}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Retrieving Info...
          </>
        ) : (
          <>
            Fetch Company Details
            <Search size={18} />
          </>
        )}
      </motion.button>
    </motion.div>
  );
};
