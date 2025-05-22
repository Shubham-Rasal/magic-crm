import { useState } from 'react';
import { initialFormData, initialOtherInputsState } from '@/data/setupFormData';

interface UseSetupFormReturn {
  formData: typeof initialFormData;
  showOtherInput: typeof initialOtherInputsState;
  companyNameInput: string;
  isLoadingCompanyData: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCompanyNameInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  fetchCompanyData: () => Promise<void>;
  setIsLoadingCompanyData: (loading: boolean) => void;
}

export default function useSetupForm(): UseSetupFormReturn {
  const [formData, setFormData] = useState(initialFormData);
  const [showOtherInput, setShowOtherInput] = useState(initialOtherInputsState);
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [isLoadingCompanyData, setIsLoadingCompanyData] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Check if we need to show/hide the "Other" input field
    if (name === "industry") {
      setShowOtherInput(prev => ({...prev, industry: value === "Other"}));
    } else if (name === "marketPositioning") {
      setShowOtherInput(prev => ({...prev, marketPositioning: value === "Other"}));
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle input for the company name on the initial screen
  const handleCompanyNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyNameInput(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { value, checked } = e.target;
    
    // If it's the "Other" checkbox, handle the visibility of the text input
    if (value === "Other") {
      if (field === "geographicalMarkets") {
        setShowOtherInput(prev => ({...prev, geographicalMarkets: checked}));
      } else if (field === "primarySalesChannels") {
        setShowOtherInput(prev => ({...prev, primarySalesChannels: checked}));
      }
    }
    
    setFormData({
      ...formData,
      [field]: checked 
        ? [...(formData[field as keyof typeof formData] as string[]), value]
        : (formData[field as keyof typeof formData] as string[]).filter(item => item !== value)
    });
  };

  // Function to fetch company data from Perplexity API
  const fetchCompanyData = async () => {
    if (!companyNameInput.trim()) return;
    
    setIsLoadingCompanyData(true);
    
    try {
      // Call to your backend API that will make the Perplexity API request
      const response = await fetch('/api/perplexity/company-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName: companyNameInput }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }
      
      const data = await response.json();
      
      // Update form data with the fetched information
      setFormData({
        ...formData,
        companyName: companyNameInput,
        websiteUrl: data.websiteUrl || "",
        location: data.location || "",
        companySize: data.companySize || "1-10",
        industry: data.industry || "Technology",
        industryOther: data.industryOther || "",
        geographicalMarkets: data.geographicalMarkets || [],
        geographicalMarketsOther: data.geographicalMarketsOther || "",
        visionStatement: data.visionStatement || "",
        coreValues: data.coreValues || "",
        marketPositioning: data.marketPositioning || "",
        marketPositioningOther: data.marketPositioningOther || "",
        primarySalesChannels: data.primarySalesChannels || [],
        primarySalesChannelsOther: data.primarySalesChannelsOther || "",
        partnerships: data.partnerships || ""
      });
      
      // Update the "Other" input visibility based on fetched data
      setShowOtherInput({
        industry: data.industry === "Other",
        marketPositioning: data.marketPositioning === "Other"
      });
      
    } catch (error) {
      console.error("Error fetching company data:", error);
      // In case of error, still proceed with empty fields
    } finally {
      setIsLoadingCompanyData(false);
    }
  };

  return {
    formData,
    showOtherInput,
    companyNameInput,
    isLoadingCompanyData,
    handleInputChange,
    handleCompanyNameInput,
    handleCheckboxChange,
    fetchCompanyData,
    setIsLoadingCompanyData
  };
}
