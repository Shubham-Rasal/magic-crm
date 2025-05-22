import React from 'react';
import { motion } from 'framer-motion';
import { slideVariants, itemVariants, containerVariants } from '@/utils/animationVariants';
import { TextInput, SelectInput, OtherInput } from './FormComponents';

interface CompanyDetailsFormProps {
  formData: {
    companyName: string;
    websiteUrl: string;
    location: string;
    companySize: string;
    companySizeOther: string;
  };
  companySizeOptions: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  showOtherInput: boolean;
}

export const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({
  formData,
  companySizeOptions,
  handleInputChange,
  showOtherInput
}) => {
  return (
    <motion.div
      key="step1"
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mb-8"
    >
      <motion.h2 
        className="text-2xl font-bold text-white mb-8 px-4"
        variants={itemVariants}
      >
        Your Brand Identity
      </motion.h2>
      
      <motion.div 
        className="space-y-7" 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TextInput
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="What's your company called?"
          required
        />
        
        <TextInput
          label="Website URL"
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={handleInputChange}
          placeholder="yourcompany.com"
          optional
          type="url"
        />
        
        <TextInput
          label="HQ Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="San Francisco, United States"
          optional
        />
        
        <SelectInput
          label="Company Size"
          name="companySize"
          value={formData.companySize}
          onChange={handleInputChange}
          options={companySizeOptions}
        />
        
        {formData.companySize === "Other" && (
          <OtherInput
            name="companySizeOther"
            value={formData.companySizeOther}
            onChange={handleInputChange}
            placeholder="Specify your company size"
          />
        )}
      </motion.div>
    </motion.div>
  );
};

interface MarketDetailsFormProps {
  formData: {
    industry: string;
    industryOther: string;
    geographicalMarkets: string[];
    geographicalMarketsOther: string;
  };
  industryOptions: string[];
  marketOptions: string[];
  showOtherInput: {
    industry: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

export const MarketDetailsForm: React.FC<MarketDetailsFormProps> = ({
  formData,
  industryOptions,
  marketOptions,
  showOtherInput,
  handleInputChange,
  handleCheckboxChange
}) => {
  return (
    <motion.div
      key="step2"
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mb-8"
    >
      <motion.h2 
        className="text-2xl font-bold text-white mb-8 px-4"
        variants={itemVariants}
      >
        Your Target Battleground
      </motion.h2>
      
      <motion.div 
        className="space-y-7"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SelectInput
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleInputChange}
          options={industryOptions}
          required
        />
        
        {showOtherInput.industry && (
          <OtherInput
            name="industryOther"
            value={formData.industryOther}
            onChange={handleInputChange}
            placeholder="Specify your industry"
            required
          />
        )}
        
        <motion.div 
          variants={itemVariants}
          className="px-4"
        >
          <label className="block text-lg font-bold text-white mb-4">
            Markets You're Conquering
          </label>
          <div className="grid grid-cols-2 gap-5">
            {marketOptions.map((market) => (
              <div key={market} className="flex items-center group">
                <div className="relative w-5 h-5">
                  <input
                    type="checkbox"
                    id={market}
                    value={market}
                    onChange={(e) => handleCheckboxChange(e, 'geographicalMarkets')}
                    checked={(formData.geographicalMarkets).includes(market)}
                    className="peer absolute w-0 h-0 opacity-0"
                  />
                  <label 
                    htmlFor={market} 
                    className="absolute inset-0 flex items-center justify-center w-5 h-5 rounded-md border-2 border-secondary/40 bg-black/20 backdrop-blur-sm cursor-pointer transition-all duration-200
                    before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:right-[2px] before:bottom-[2px] before:rounded-sm before:bg-secondary/0 before:transition-all before:duration-200
                    peer-checked:border-secondary peer-checked:bg-secondary/10 peer-checked:shadow-[0_0_8px_rgba(var(--secondary-rgb),0.3)] peer-checked:before:bg-secondary/20
                    group-hover:border-secondary/60 group-hover:bg-black/30"
                  >
                    {(formData.geographicalMarkets).includes(market) && (
                      <motion.svg 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3.5 h-3.5 text-secondary z-10"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </label>
                </div>
                <label htmlFor={market} className="ml-3 text-base text-white cursor-pointer">
                  {market}
                </label>
              </div>
            ))}
          </div>

          {formData.geographicalMarkets.includes("Other") && (
            <OtherInput
              name="geographicalMarketsOther"
              value={formData.geographicalMarketsOther}
              onChange={handleInputChange}
              placeholder="Specify other markets"
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
