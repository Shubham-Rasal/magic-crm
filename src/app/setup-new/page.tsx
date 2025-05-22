"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Target, Dna, Rocket } from "lucide-react";

// Custom components
import ModernStepper from "@/components/StepIndicator";
import LoadingAnimation from "@/components/LoadingAnimation";
import BackgroundGradients from "@/components/setup/BackgroundGradients";
import { IntroStep, CompanySearchStep } from "@/components/setup/IntroSteps";
import { CompanyDetailsForm, MarketDetailsForm } from "@/components/setup/FormSteps1";
import { VisionStatementForm, GoToMarketStrategyForm } from "@/components/setup/FormSteps2";
import SetupNavigation from "@/components/setup/SetupNavigation";

// Custom hooks and data
import useSetupForm from "@/hooks/useSetupForm";
import { 
  companySize,
  industries, 
  geographicalMarkets,
  marketPositioningOptions,
  salesChannels,
  setupSteps
} from "@/data/setupFormData";

export default function SetupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for intro screen

  // Use custom hook for form handling
  const {
    formData,
    showOtherInput,
    companyNameInput,
    isLoadingCompanyData,
    handleInputChange,
    handleCompanyNameInput,
    handleCheckboxChange,
    fetchCompanyData
  } = useSetupForm();

  // Get icons for steps
  const stepsWithIcons = setupSteps.map((step) => ({
    ...step,
    icon: getIconForStep(step.icon)
  }));

  // Helper function to get icon component from string
  function getIconForStep(iconName: string) {
    switch (iconName) {
      case "Building": return Building2;
      case "Target": return Target;
      case "Dna": return Dna;
      case "Rocket": return Rocket;
      default: return Building2;
    }
  }

  // Helper function to validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      // Allow empty URLs (they're optional)
      if (!url.trim()) return true;
      
      // Add protocol if missing
      const urlToCheck = url.startsWith('http') ? url : `https://${url}`;
      new URL(urlToCheck);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Function to validate required fields for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Company Search 
        if (!companyNameInput.trim()) {
          alert("Please enter your company name");
          return false;
        }
        return true;
        
      case 2: // Company Details
        if (!formData.companyName.trim()) {
          alert("Please enter your company name");
          return false;
        }
        // Website URL is optional but should be valid if provided
        if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
          alert("Please enter a valid website URL or leave it blank");
          return false;
        }
        return true;
        
      case 3: // Market Details
        if (!formData.industry) {
          alert("Please select your industry");
          return false;
        }
        if (formData.industry === "Other" && !formData.industryOther.trim()) {
          alert("Please specify your industry");
          return false;
        }
        if (formData.geographicalMarkets.length === 0) {
          alert("Please select at least one geographical market");
          return false;
        }
        if (formData.geographicalMarkets.includes("Other") && !formData.geographicalMarketsOther.trim()) {
          alert("Please specify your other geographical markets");
          return false;
        }
        return true;
        
      case 4: // Vision Statement
        // These fields are optional, so no validation needed
        return true;
        
      case 5: // Go-To-Market Strategy
        if (!formData.marketPositioning) {
          alert("Please select your market positioning");
          return false;
        }
        if (formData.marketPositioning === "Other" && !formData.marketPositioningOther.trim()) {
          alert("Please specify your market positioning");
          return false;
        }
        if (formData.primarySalesChannels.length === 0) {
          alert("Please select at least one sales channel");
          return false;
        }
        if (formData.primarySalesChannels.includes("Other") && !formData.primarySalesChannelsOther.trim()) {
          alert("Please specify your other sales channels");
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  // New function to handle the actual form submission
  const submitFormData = async () => {
    // Final validation of all required fields
    const requiredFields = [
      { field: 'companyName', label: 'Company Name' },
      { field: 'industry', label: 'Industry' },
      { field: 'role', label: 'Role', value: 'User' } // Added by us, so always valid
    ];
    
    const missingFields = requiredFields.filter(({ field }) => 
      field !== 'role' && !formData[field as keyof typeof formData]
    ).map(f => f.label);
    
    if (missingFields.length > 0) {
      alert(`Please fill in these required fields before submitting: ${missingFields.join(', ')}`);
      return;
    }
    
    // Check for "Other" fields
    if (formData.industry === "Other" && !formData.industryOther) {
      alert("Please specify your industry in the 'Other' field");
      return;
    }
    
    if (formData.marketPositioning === "Other" && !formData.marketPositioningOther) {
      alert("Please specify your market positioning in the 'Other' field");
      return;
    }
    
    // Validate arrays
    if (formData.geographicalMarkets.length === 0) {
      alert("Please select at least one geographical market");
      return;
    }
    
    if (formData.primarySalesChannels.length === 0) {
      alert("Please select at least one sales channel");
      return;
    }
    
    setLoading(true);
    
    try {
      // Debug log to check form data
      console.log("Submitting setup data:", formData);
      
      // Prepare data for submission with required fields
      const dataToSubmit = {
        ...formData,
        role: "User", // Add the required role field that's missing
        setupComplete: true
      };
      
      console.log("Sending API request with data:", dataToSubmit);
      
      // Send the data to our API
      const response = await fetch('/api/user/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData, "Status:", response.status);
        throw new Error(`Failed to save setup data: ${errorData.error || response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log("API response:", responseData);
      
      // Success message
      console.log("Setup completed successfully!");
      
      // Wait a moment to ensure the database update is processed before redirecting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error completing your setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Form handler that just prevents default submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Just prevent default form submission
  };

  const nextStep = () => {
    // If we're already at the final step, submit the form data
    if (currentStep === 5) {
      submitFormData();
      return;
    }
    
    // Validate the current step before proceeding
    if (!validateStep(currentStep)) {
      return;
    }

    // Otherwise just increment the step
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Function that gets called after successfully fetching company data
  const onFetchSuccess = () => {
    setCurrentStep(2);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(30,40,50)] to-[rgb(15,25,35)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced animated background gradients */}
      <BackgroundGradients />
      
      <div className="w-full max-w-4xl relative z-20">
        <AnimatePresence mode="wait">
          {/* Intro welcome screen */}
          {currentStep === 0 && (
            <IntroStep 
              onContinue={nextStep} 
              userName={session?.user?.name || undefined}
            />
          )}

          {/* Company name input step */}
          {currentStep === 1 && !isLoadingCompanyData && (
            <CompanySearchStep
              companyNameInput={companyNameInput}
              onInputChange={handleCompanyNameInput}
              onSearch={() => {
                if (!companyNameInput.trim()) {
                  alert("Please enter a company name");
                  return;
                }
                fetchCompanyData().then(() => onFetchSuccess());
              }}
              isLoading={isLoadingCompanyData}
            />
          )}
          
          {/* Loading animation when fetching company data */}
          {isLoadingCompanyData && (
            <LoadingAnimation companyName={companyNameInput} />
          )}
          
          {currentStep > 1 && !isLoadingCompanyData && (
            <>
              {/* Improved progress indicator with ModernStepper component */}
              <div className="w-full px-4 mb-2">
                {/* Pass the actual currentStep (adjusting for zero-based intro step) */}
                <ModernStepper 
                  currentStep={currentStep - 1} 
                  setCurrentStep={(step) => setCurrentStep(step + 1)}
                  steps={stepsWithIcons}
                  showControls={false}
                />
              </div>
              
              <form onSubmit={handleFormSubmit}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Company Details */}
                  {currentStep === 2 && (
                    <CompanyDetailsForm 
                      formData={{
                        companyName: formData.companyName,
                        websiteUrl: formData.websiteUrl,
                        location: formData.location,
                        companySize: formData.companySize,
                        companySizeOther: formData.companySizeOther
                      }}
                      companySizeOptions={companySize}
                      handleInputChange={handleInputChange}
                      showOtherInput={formData.companySize === "Other"}
                    />
                  )}
                  
                  {/* Step 2: Market Details */}
                  {currentStep === 3 && (
                    <MarketDetailsForm 
                      formData={{
                        industry: formData.industry,
                        industryOther: formData.industryOther,
                        geographicalMarkets: formData.geographicalMarkets,
                        geographicalMarketsOther: formData.geographicalMarketsOther
                      }}
                      industryOptions={industries}
                      marketOptions={geographicalMarkets}
                      showOtherInput={{ industry: showOtherInput.industry }}
                      handleInputChange={handleInputChange}
                      handleCheckboxChange={handleCheckboxChange}
                    />
                  )}
                  
                  {/* Step 3: Vision Statement */}
                  {currentStep === 4 && (
                    <VisionStatementForm 
                      formData={{
                        visionStatement: formData.visionStatement,
                        coreValues: formData.coreValues
                      }}
                      handleInputChange={handleInputChange}
                    />
                  )}
                  
                  {/* Step 4: Go-To-Market Strategy */}
                  {currentStep === 5 && (
                    <GoToMarketStrategyForm 
                      formData={{
                        marketPositioning: formData.marketPositioning,
                        marketPositioningOther: formData.marketPositioningOther,
                        primarySalesChannels: formData.primarySalesChannels,
                        primarySalesChannelsOther: formData.primarySalesChannelsOther,
                        partnerships: formData.partnerships
                      }}
                      positioningOptions={marketPositioningOptions}
                      salesChannelsOptions={salesChannels}
                      showOtherInput={{ marketPositioning: showOtherInput.marketPositioning }}
                      handleInputChange={handleInputChange}
                      handleCheckboxChange={handleCheckboxChange}
                    />
                  )}
                </AnimatePresence>
                
                {/* Navigation buttons */}
                <SetupNavigation 
                  currentStep={currentStep}
                  maxStep={5}
                  loading={loading}
                  onPrevious={prevStep}
                  onNext={nextStep}
                />
              </form>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
