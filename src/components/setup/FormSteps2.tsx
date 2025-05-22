import React from 'react';
import { motion } from 'framer-motion';
import { slideVariants, itemVariants, containerVariants } from '@/utils/animationVariants';
import { TextArea, SelectInput, CheckboxGroup, OtherInput } from './FormComponents';

interface VisionStatementFormProps {
  formData: {
    visionStatement: string;
    coreValues: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const VisionStatementForm: React.FC<VisionStatementFormProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <motion.div
      key="step3"
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
        Your Business DNA
      </motion.h2>
      
      <motion.div 
        className="space-y-7"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TextArea
          label="Vision Statement"
          name="visionStatement"
          value={formData.visionStatement}
          onChange={handleInputChange}
          placeholder="Where are you taking your industry?"
          optional
        />
        
        <TextArea
          label="Core Values"
          name="coreValues"
          value={formData.coreValues}
          onChange={handleInputChange}
          placeholder="What principles drive your success?"
          optional
        />
      </motion.div>
    </motion.div>
  );
};

interface GoToMarketStrategyFormProps {
  formData: {
    marketPositioning: string;
    marketPositioningOther: string;
    primarySalesChannels: string[];
    primarySalesChannelsOther: string;
    partnerships: string;
  };
  positioningOptions: { value: string; label: string }[];
  salesChannelsOptions: string[];
  showOtherInput: {
    marketPositioning: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

export const GoToMarketStrategyForm: React.FC<GoToMarketStrategyFormProps> = ({
  formData,
  positioningOptions,
  salesChannelsOptions,
  showOtherInput,
  handleInputChange,
  handleCheckboxChange
}) => {
  return (
    <motion.div
      key="step4"
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
        Your Go-To-Market Strategy
      </motion.h2>
      
      <motion.div 
        className="space-y-7"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SelectInput
          label="Market Positioning"
          name="marketPositioning"
          value={formData.marketPositioning}
          onChange={handleInputChange}
          options={positioningOptions}
          optional
        />
        
        {showOtherInput.marketPositioning && (
          <OtherInput
            name="marketPositioningOther"
            value={formData.marketPositioningOther}
            onChange={handleInputChange}
            placeholder="Describe your positioning"
          />
        )}
        
        <CheckboxGroup
          label="Sales Channels"
          options={salesChannelsOptions}
          selectedValues={formData.primarySalesChannels}
          onChange={handleCheckboxChange}
          fieldName="primarySalesChannels"
        />
        
        {formData.primarySalesChannels.includes("Other") && (
          <OtherInput
            name="primarySalesChannelsOther"
            value={formData.primarySalesChannelsOther}
            onChange={handleInputChange}
            placeholder="Specify other sales channels"
          />
        )}
        
        <TextArea
          label="Strategic Partnerships"
          name="partnerships"
          value={formData.partnerships}
          onChange={handleInputChange}
          placeholder="Who are your key allies in the market?"
          optional
        />
      </motion.div>
    </motion.div>
  );
};
