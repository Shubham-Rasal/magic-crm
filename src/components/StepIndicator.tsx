import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  step: number;
  label: string;
  icon: React.ElementType;
}

interface ModernStepperProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep?: (step: number) => void;
  showControls?: boolean;
}

const ModernStepper: React.FC<ModernStepperProps> = ({
  steps,
  currentStep,
  setCurrentStep,
  showControls = false
}) => {
  // If no custom handler is provided, create a default one that does nothing
  const handleStepChange = setCurrentStep || (() => {});

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* Demo Controls - only show if explicitly requested */}
      {showControls && (
        <div className="mb-12 text-center">
          <motion.h2 
            className="text-3xl font-bold text-white mb-6"
            style={{
              background: 'linear-gradient(90deg, rgb(49, 164, 180) 0%, rgba(49, 164, 180, 0.7) 50%, rgb(49, 164, 180) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Progress Journey
          </motion.h2>
          <div className="flex justify-center gap-3">
            {steps.map(({ step }) => (
              <motion.button
                key={step}
                onClick={() => handleStepChange(step)}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Step {step}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Stepper Component */}
      <div className="relative">
        {/* Background gradient line */}
        <div className="absolute top-7 h-1 bg-gradient-to-r from-slate-600/30 via-slate-500/30 to-slate-600/30 rounded-full" 
             style={{ left: '28px', right: '28px' }}>
          <motion.div
            className="h-full rounded-full origin-left bg-secondary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="flex items-start justify-between relative">
          {steps.map(({ step, label, icon: Icon }, index) => {
            const isActive = currentStep >= step;
            const isCompleted = currentStep > step;
            const isCurrent = currentStep === step;
            
            return (
              <div key={step} className="flex flex-col items-center relative z-10">
                {/* Step Circle with reduced glow effects using --secondary */}
                <motion.div 
                  className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 backdrop-blur-sm transition-all duration-500 cursor-pointer group overflow-hidden
                    ${isCompleted 
                      ? "border-secondary bg-secondary/20 shadow-[0_0_15px_rgba(var(--secondary-rgb),0.3)]" 
                      : isCurrent
                      ? "border-secondary bg-secondary/20 shadow-[0_0_20px_rgba(var(--secondary-rgb),0.4)]"
                      : isActive
                      ? "border-secondary bg-secondary/10 shadow-[0_0_10px_rgba(var(--secondary-rgb),0.2)]"
                      : "border-slate-500 bg-slate-700/50 hover:border-secondary/70"
                    }`}
                  onClick={() => handleStepChange(step)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.4, delay: step * 0.1 }}
                >
                  <motion.div
                    className="relative z-10"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: isCompleted ? 360 : 0 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <Check
                          size={24}
                          className="text-secondary drop-shadow-md"
                        />
                      </motion.div>
                    ) : (
                      <Icon
                        size={24}
                        className={`transition-all duration-500 ${
                          isCurrent || isActive 
                            ? "text-secondary" 
                            : "text-slate-400 group-hover:text-slate-300"
                        }`}
                      />
                    )}
                  </motion.div>
                </motion.div>
                
                {/* Step Label */}
                <motion.span 
                  className={`text-sm font-semibold mt-4 transition-all duration-500 text-center max-w-20 leading-tight
                    ${isCompleted || isCurrent || isActive
                      ? "text-secondary"
                      : "text-slate-400"
                    }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: step * 0.1 + 0.2 }}
                >
                  {label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Current Step Info with beautiful styling */}
      {showControls && (
        <motion.div 
          className="mt-12 p-6 rounded-2xl border backdrop-blur-lg relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(49, 164, 180, 0.1) 0%, rgba(51, 65, 85, 0.2) 50%, rgba(49, 164, 180, 0.05) 100%)',
            borderColor: 'rgba(49, 164, 180, 0.3)'
          }}
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0" 
               style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(49, 164, 180, 0.05) 50%, transparent 100%)' }} />
          
          <div className="text-center relative z-10">
            <motion.h3 
              className="text-xl font-bold mb-3"
              style={{
                background: 'linear-gradient(90deg, rgb(49, 164, 180) 0%, rgba(49, 164, 180, 0.8) 50%, rgb(49, 164, 180) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Current Step: {steps[currentStep - 1]?.label}
            </motion.h3>
            <motion.p 
              className="text-slate-300 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Step {currentStep} of {steps.length} • {Math.round((currentStep / steps.length) * 100)}% Complete
            </motion.p>
            
            {/* Progress bar */}
            <motion.div 
              className="mt-4 h-2 bg-slate-700/50 rounded-full overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, 
                    rgb(49, 164, 180) 0%, 
                    rgba(49, 164, 180, 0.8) 50%, 
                    rgb(49, 164, 180) 100%)`
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (currentStep / steps.length) }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ModernStepper;