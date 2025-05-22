// Form options for the setup wizard
export const companySize = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
  "Other"
];

export const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Professional Services",
  "Media & Entertainment",
  "Real Estate",
  "Non-profit",
  "Other"
];

export const geographicalMarkets = [
  "North America",
  "Europe", 
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa", 
  "Global",
  "Other"
];

export const marketPositioningOptions = [
  { value: "", label: "How do you position yourself?" },
  { value: "Premium", label: "Premium" },
  { value: "Mid-market", label: "Mid-market" },
  { value: "Budget", label: "Budget" },
  { value: "Luxury", label: "Luxury" },
  { value: "Value", label: "Value" },
  { value: "Innovative", label: "Innovative" },
  { value: "Niche", label: "Niche" },
  { value: "Other", label: "Other" }
];

export const salesChannels = [
  "Direct Sales",
  "E-commerce",
  "Retail",
  "Distributors",
  "Partners",
  "Social Media",
  "Marketplaces",
  "Other"
];

// Setup steps configuration
export const setupSteps = [
  { step: 1, label: "Company", icon: "Building" },
  { step: 2, label: "Market", icon: "Target" },
  { step: 3, label: "Vision", icon: "Dna" },
  { step: 4, label: "Strategy", icon: "Rocket" }
];

// Initial form data
export const initialFormData = {
  // Basic Company Details
  companyName: "",
  websiteUrl: "",
  location: "",
  companySize: "1-10",
  companySizeOther: "",
  
  // Industry and Market
  industry: "Technology",
  industryOther: "",
  geographicalMarkets: [] as string[],
  geographicalMarketsOther: "",
  
  // Company Overview
  visionStatement: "",
  coreValues: "",
  
  // Other
  marketPositioning: "",
  marketPositioningOther: "",
  primarySalesChannels: [] as string[],
  primarySalesChannelsOther: "",
  partnerships: ""
};

// Initial "Other" input visibility state
export const initialOtherInputsState = {
  industry: false,
  marketPositioning: false
};
