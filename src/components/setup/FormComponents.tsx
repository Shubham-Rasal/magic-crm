import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '@/utils/animationVariants';

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  optional?: boolean;
  required?: boolean;
  type?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  optional = false,
  required = false,
  type = "text"
}) => {
  return (
    <motion.div variants={itemVariants} className="px-4">
      <label className="block text-lg font-bold text-white mb-3">
        {label} {optional && <span className="text-white/50 text-sm font-normal">(optional)</span>}
      </label>
      <div className="group relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-5 py-3 bg-black/10 backdrop-blur-sm border-0 border-b border-secondary/40 focus:border-secondary focus:ring-0 text-white placeholder:text-white/40 text-base rounded-t-lg transition-all duration-300 group-hover:bg-black/20"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </motion.div>
  );
};

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  optional?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  optional = false
}) => {
  return (
    <motion.div variants={itemVariants} className="px-4">
      <label className="block text-lg font-bold text-white mb-3">
        {label} {optional && <span className="text-white/50 text-sm font-normal">(optional)</span>}
      </label>
      <div className="group relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-5 py-3 bg-black/10 backdrop-blur-sm border-0 border-b border-secondary/40 focus:border-secondary focus:ring-0 text-white placeholder:text-white/40 min-h-[100px] resize-y text-base rounded-t-lg transition-all group-hover:bg-black/20"
          placeholder={placeholder}
        />
      </div>
    </motion.div>
  );
};

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[] | string[];
  optional?: boolean;
  required?: boolean;
}

export const SelectInput: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  optional = false,
  required = false
}) => {
  // Handle both formats of options (string[] or {value, label}[])
  const normalizedOptions = options.map(option => 
    typeof option === 'string' ? { value: option, label: option } : option
  );

  return (
    <motion.div variants={itemVariants} className="px-4">
      <label className="block text-lg font-bold text-white mb-3">
        {label} {optional && <span className="text-white/50 text-sm font-normal">(optional)</span>}
      </label>
      <div className="group relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-5 py-3 bg-black/10 backdrop-blur-sm border-0 border-b border-secondary/40 focus:border-secondary focus:ring-0 text-white text-base rounded-t-lg transition-all group-hover:bg-black/20 appearance-none"
          required={required}
        >
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  fieldName: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  fieldName
}) => {
  return (
    <motion.div variants={itemVariants} className="px-4">
      <label className="block text-lg font-bold text-white mb-4">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-5">
        {options.map((option) => (
          <div key={option} className="flex items-center group">
            <div className="relative w-5 h-5">
              <input
                type="checkbox"
                id={option}
                value={option}
                onChange={(e) => onChange(e, fieldName)}
                checked={selectedValues.includes(option)}
                className="peer absolute w-0 h-0 opacity-0"
              />
              <label 
                htmlFor={option} 
                className="absolute inset-0 flex items-center justify-center w-5 h-5 rounded-md border-2 border-secondary/40 bg-black/20 backdrop-blur-sm cursor-pointer transition-all duration-200
                before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:right-[2px] before:bottom-[2px] before:rounded-sm before:bg-secondary/0 before:transition-all before:duration-200
                peer-checked:border-secondary peer-checked:bg-secondary/10 peer-checked:shadow-[0_0_8px_rgba(var(--secondary-rgb),0.3)] peer-checked:before:bg-secondary/20
                group-hover:border-secondary/60 group-hover:bg-black/30"
              >
                {selectedValues.includes(option) && (
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
            <label htmlFor={option} className="ml-3 text-base text-white cursor-pointer">
              {option}
            </label>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

interface OtherInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

export const OtherInput: React.FC<OtherInputProps> = ({
  name,
  value,
  onChange,
  placeholder,
  required = false
}) => {
  return (
    <div className="mt-4 group relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-3 bg-black/10 backdrop-blur-sm border-0 border-b border-secondary/40 focus:border-secondary focus:ring-0 text-white placeholder:text-white/40 text-base rounded-t-lg transition-all group-hover:bg-black/20"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};
