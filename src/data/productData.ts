// Product data structure for the Magic CRM
import { faker } from '@faker-js/faker';

// Product interface
export interface IProduct {
  id: string;
  name: string;
  description: string;
  features: string[];
  benefits: string[];
  targetMarket: string[];
  pricing: {
    model: string; // 'subscription', 'one-time', 'freemium', etc.
    startingAt: string; // price string like "$99/month"
    tiers?: string[];
  };
  competitorAnalysis: string[];
  salesPitch?: string; // Auto-generated sales pitch
  createdAt: Date;
  updatedAt: Date;
}

// Lead data specifically for a product
export interface IProductLead {
  id: string;
  productId?: string; // Link to the specific product (optional to match current implementation)
  fullName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  phoneNumber?: string; // Added to match Grid component
  location: string;
  leadScore: number;
  buyerIntentSignals: string | string[]; // Support both string and array of strings
  notes: string;
  lastContacted: Date | null; // Standardized to Date or null
  followUpDate: Date | null; // Standardized to Date or null
  engagementStatus: string;
  customerFit?: string; // Added to match Grid component
  linkedinUrl?: string;
  matchReason?: string; // Why this lead matches the product
}

// Types of pricing models available
export const pricingModels = [
  'Subscription', 
  'One-time purchase',
  'Freemium',
  'Usage-based',
  'Tiered pricing',
  'Enterprise custom'
];

// Types of engagement statuses for leads
export const engagementStatuses = [
  'New Lead', 
  'In Progress', 
  'Qualified', 
  'Nurturing', 
  'Closed Won', 
  'Closed Lost'
];

// Generate a sample product
export function generateSampleProduct(): IProduct {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    features: Array(faker.number.int({ min: 3, max: 8 }))
      .fill(null)
      .map(() => faker.commerce.productAdjective() + ' ' + faker.commerce.productDescription()),
    benefits: Array(faker.number.int({ min: 2, max: 5 }))
      .fill(null)
      .map(() => faker.commerce.productDescription()),
    targetMarket: faker.helpers.arrayElements([
      'Small Businesses',
      'Enterprise',
      'Startups',
      'Healthcare',
      'Education',
      'E-commerce',
      'Finance',
      'Technology'
    ], { min: 1, max: 3 }),
    pricing: {
      model: faker.helpers.arrayElement(pricingModels),
      startingAt: `$${faker.number.int({ min: 9, max: 999 })}${faker.helpers.arrayElement(['', '/month', '/year'])}`,
      tiers: faker.datatype.boolean() 
        ? ['Basic', 'Pro', 'Enterprise'].map(tier => 
            `${tier}: $${faker.number.int({ min: 9, max: 999 })}${faker.helpers.arrayElement(['', '/month', '/year'])}`)
        : undefined
    },
    competitorAnalysis: Array(faker.number.int({ min: 1, max: 3 }))
      .fill(null)
      .map(() => `${faker.company.name()}: ${faker.commerce.productAdjective()}`),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  };
}

// Generate sample leads for a product
export function generateSampleLeadsForProduct(productId: string, count: number = 5): IProductLead[] {
  return Array(count).fill(null).map(() => ({
    id: faker.string.uuid(),
    productId: productId,
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    companyName: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    phoneNumber: faker.phone.number(), // Added to match Grid component
    location: faker.location.city() + ', ' + faker.location.country(),
    leadScore: faker.number.int({ min: 50, max: 100 }),
    buyerIntentSignals: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
    notes: faker.lorem.paragraph(),
    lastContacted: faker.datatype.boolean() ? faker.date.recent() : null,
    followUpDate: faker.datatype.boolean() ? faker.date.future() : null,
    engagementStatus: faker.helpers.arrayElement(engagementStatuses),
    customerFit: faker.helpers.arrayElement(['Good', 'Average', 'Poor']), // Added to match Grid component
    linkedinUrl: `linkedin.com/in/${faker.internet.userName()}`,
    matchReason: faker.lorem.sentence()
  }));
}

// Generate a sample product with leads
export function generateSampleProductWithLeads(): {product: IProduct, leads: IProductLead[]} {
  const product = generateSampleProduct();
  
  const leads = Array(faker.number.int({ min: 5, max: 15 })).fill(null).map(() => ({
    id: faker.string.uuid(),
    productId: product.id,
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    companyName: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    phoneNumber: faker.phone.number(), // Added to match Grid component
    location: faker.location.city() + ', ' + faker.location.country(),
    leadScore: faker.number.int({ min: 1, max: 100 }),
    buyerIntentSignals: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
    notes: faker.lorem.paragraph(),
    lastContacted: faker.datatype.boolean() ? faker.date.recent() : null,
    followUpDate: faker.datatype.boolean() ? faker.date.future() : null,
    engagementStatus: faker.helpers.arrayElement(engagementStatuses),
    customerFit: faker.helpers.arrayElement(['Good', 'Average', 'Poor']), // Added to match Grid component
    linkedinUrl: `linkedin.com/in/${faker.internet.userName()}`,
    matchReason: faker.lorem.sentence()
  }));
  
  return { product, leads };
}

// Array of sample products for testing
export const sampleProducts: IProduct[] = Array(3).fill(null).map(() => generateSampleProduct());

// Create a complete dataset with products and associated leads
export const sampleProductsWithLeads = sampleProducts.map(product => {
  const leads = Array(faker.number.int({ min: 3, max: 8 })).fill(null).map(() => ({
    id: faker.string.uuid(),
    productId: product.id,
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    companyName: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    phoneNumber: faker.phone.number(), // Added to match Grid component
    location: faker.location.city() + ', ' + faker.location.country(),
    leadScore: faker.number.int({ min: 1, max: 100 }),
    buyerIntentSignals: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
    notes: faker.lorem.paragraph(),
    lastContacted: faker.datatype.boolean() ? faker.date.recent() : null,
    followUpDate: faker.datatype.boolean() ? faker.date.future() : null,
    engagementStatus: faker.helpers.arrayElement(engagementStatuses),
    customerFit: faker.helpers.arrayElement(['Good', 'Average', 'Poor']), // Added to match Grid component
    linkedinUrl: `linkedin.com/in/${faker.internet.userName()}`,
    matchReason: faker.lorem.sentence()
  }));
  
  return { product, leads };
});
