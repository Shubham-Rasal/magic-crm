// Product creation form
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PlusCircle, XCircle, Loader2 } from 'lucide-react';
import { IProduct, pricingModels, generateSampleLeadsForProduct } from '@/data/productData';

export default function ProductForm({ existingProduct = null }: { existingProduct?: IProduct | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatingSalesPitch, setGeneratingSalesPitch] = useState(false);
  const [generatingLeads, setGeneratingLeads] = useState(false);

  // Form state
  const [product, setProduct] = useState<Partial<IProduct>>(existingProduct || {
    name: '',
    description: '',
    features: ['', '', ''],
    benefits: ['', ''],
    targetMarket: [''],
    pricing: {
      model: 'Subscription',
      startingAt: '',
    },
    competitorAnalysis: [''],
    salesPitch: '',
  });

  // For dynamic fields (features, benefits, etc.)
  const handleArrayItemChange = (
    field: 'features' | 'benefits' | 'targetMarket' | 'competitorAnalysis',
    index: number,
    value: string
  ) => {
    setProduct(prev => ({
      ...prev,
      [field]: prev[field]?.map((item: string, i: number) => 
        i === index ? value : item
      ),
    }));
  };

  const addArrayItem = (
    field: 'features' | 'benefits' | 'targetMarket' | 'competitorAnalysis'
  ) => {
    setProduct(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ''],
    }));
  };

  const removeArrayItem = (
    field: 'features' | 'benefits' | 'targetMarket' | 'competitorAnalysis',
    index: number
  ) => {
    setProduct(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_: string, i: number) => i !== index),
    }));
  };

  // Handle simple field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields like pricing.model
      const [parent, child] = name.split('.');
      setProduct(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value,
        },
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Generate a sales pitch using Perplexity API
  const generateSalesPitch = async () => {
    if (!product.name || !product.description) {
      alert('Please fill in product name and description first');
      return;
    }

    setGeneratingSalesPitch(true);
    
    try {
      // Call the generate-pitch API route
      const response = await fetch('/api/perplexity/generate-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate sales pitch');
      }
      
      const data = await response.json();
      
      setProduct(prev => ({
        ...prev,
        salesPitch: data.salesPitch,
      }));
    } catch (error) {
      console.error('Error generating sales pitch:', error);
      alert('Failed to generate sales pitch. Please try again.');
    } finally {
      setGeneratingSalesPitch(false);
    }
  };

  // Save product and optionally generate leads
  const saveProduct = async (generateLeads = false) => {
    // Validation
    if (!product.name || !product.description) {
      alert('Please fill in product name and description');
      return;
    }
    
    if (!product.features || product.features.length === 0 || !product.features[0]) {
      alert('Please add at least one feature');
      return;
    }
    
    if (!product.benefits || product.benefits.length === 0 || !product.benefits[0]) {
      alert('Please add at least one benefit');
      return;
    }
    
    if (!product.targetMarket || product.targetMarket.length === 0 || !product.targetMarket[0]) {
      alert('Please add at least one target market');
      return;
    }
    
    if (!product.pricing?.startingAt) {
      alert('Please add pricing information');
      return;
    }

    setLoading(true);
    
    try {
      // Create the complete product object
      const completeProduct: IProduct = {
        id: existingProduct?.id || crypto.randomUUID(),
        ...product as Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>,
        createdAt: existingProduct?.createdAt || new Date(),
        updatedAt: new Date(),
      } as IProduct;
      
      // Save to local storage (later we can use a backend)
      const existingProducts = JSON.parse(
        localStorage.getItem('magicCRM_products') || '[]'
      );
      
      const updatedProducts = existingProduct
        ? existingProducts.map((p: IProduct) => 
            p.id === existingProduct.id ? completeProduct : p
          )
        : [...existingProducts, completeProduct];
        
      localStorage.setItem('magicCRM_products', JSON.stringify(updatedProducts));
      
      // Always ensure there are some leads for demo purposes if this is a new product
      if (!existingProduct) {
        // Generate some sample leads if not already generating AI leads
        if (!generateLeads) {
          // Create 5 sample leads
          const sampleLeads = generateSampleLeadsForProduct(completeProduct.id, 5);
          localStorage.setItem(`magicCRM_leads_${completeProduct.id}`, JSON.stringify(sampleLeads));
        }
      }
      
      // Always ensure there are some leads for demo purposes if this is a new product
      if (!existingProduct) {
        // Generate some sample leads if not already generating AI leads
        if (!generateLeads) {
          // Create 5 sample leads
          const sampleLeads = generateSampleLeadsForProduct(completeProduct.id, 5);
          localStorage.setItem(`magicCRM_leads_${completeProduct.id}`, JSON.stringify(sampleLeads));
        }
      }
      
      // If user wants to generate leads
      if (generateLeads) {
        setGeneratingLeads(true);
        
        // Call the lead generation API
        const response = await fetch('/api/perplexity/generate-leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product: completeProduct }),
        });
        
        if (response.ok) {
          // Get the generated leads
          const data = await response.json();
          
          if (data.leads) {
            // Save leads to localStorage
            localStorage.setItem(`magicCRM_leads_${completeProduct.id}`, JSON.stringify(data.leads));
          }
        } else {
          console.error('Failed to generate leads:', await response.text());
        }
      }
      
      // Navigate to the product view page
      router.push(`/product/${completeProduct.id}`);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
      setGeneratingLeads(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <motion.h1 
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {existingProduct ? 'Edit Magic Sheet' : 'Create New Magic Sheet'}
        </motion.h1>
        <motion.p
          className="text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Fill in your product details and we'll help you generate leads and sales pitches
        </motion.p>
      </div>
      
      <motion.div 
        className="bg-zinc-800/30 rounded-xl border border-zinc-700/40 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <form onSubmit={(e) => { e.preventDefault(); saveProduct(false); }}>
          <div className="space-y-6">
            {/* Product basics */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Product Basics</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={product.name || ''}
                    onChange={handleChange}
                    className="w-full p-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white"
                    placeholder="e.g. CRM Platform, AI Chatbot, Marketing Analytics Software"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={product.description || ''}
                    onChange={handleChange}
                    className="w-full p-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white h-24"
                    placeholder="Describe your product and its main purpose"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Features and Benefits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-white">Features*</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('features')}
                    className="flex items-center gap-1 text-xs text-[#3DD2D3] hover:text-[#4DE7E8] transition-colors"
                  >
                    <PlusCircle size={14} />
                    <span>Add Feature</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {product.features?.map((feature, index) => (
                    <div key={`feature-${index}`} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleArrayItemChange('features', index, e.target.value)}
                        className="flex-1 p-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {product.features && product.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('features', index)}
                          className="text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-white">Benefits*</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('benefits')}
                    className="flex items-center gap-1 text-xs text-[#3DD2D3] hover:text-[#4DE7E8] transition-colors"
                  >
                    <PlusCircle size={14} />
                    <span>Add Benefit</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {product.benefits?.map((benefit, index) => (
                    <div key={`benefit-${index}`} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayItemChange('benefits', index, e.target.value)}
                        className="flex-1 p-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white"
                        placeholder={`Benefit ${index + 1}`}
                      />
                      {product.benefits && product.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('benefits', index)}
                          className="text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Target Market and Pricing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Target Market */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-white">Target Market*</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('targetMarket')}
                    className="flex items-center gap-1 text-xs text-[#3DD2D3] hover:text-[#4DE7E8] transition-colors"
                  >
                    <PlusCircle size={14} />
                    <span>Add Market</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {product.targetMarket?.map((market, index) => (
                    <div key={`market-${index}`} className="flex gap-2">
                      <input
                        type="text"
                        value={market}
                        onChange={(e) => handleArrayItemChange('targetMarket', index, e.target.value)}
                        className="flex-1 p-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white"
                        placeholder="e.g. Small Businesses, Healthcare, Education"
                      />
                      {product.targetMarket && product.targetMarket.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('targetMarket', index)}
                          className="text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pricing */}
              <div>
                <h2 className="text-lg font-medium text-white mb-4">Pricing*</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Pricing Model
                    </label>
                    <select
                      name="pricing.model"
                      value={product.pricing?.model || 'Subscription'}
                      onChange={handleChange}
                      className="w-full p-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white"
                    >
                      {pricingModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Starting Price
                    </label>
                    <input
                      type="text"
                      name="pricing.startingAt"
                      value={product.pricing?.startingAt || ''}
                      onChange={handleChange}
                      className="w-full p-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white"
                      placeholder="e.g. $99/month, Free, $499"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Competitors */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Competitors</h2>
                <button
                  type="button"
                  onClick={() => addArrayItem('competitorAnalysis')}
                  className="flex items-center gap-1 text-xs text-[#3DD2D3] hover:text-[#4DE7E8] transition-colors"
                >
                  <PlusCircle size={14} />
                  <span>Add Competitor</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {product.competitorAnalysis?.map((competitor, index) => (
                  <div key={`competitor-${index}`} className="flex gap-2">
                    <input
                      type="text"
                      value={competitor}
                      onChange={(e) => handleArrayItemChange('competitorAnalysis', index, e.target.value)}
                      className="flex-1 p-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white"
                      placeholder="Company: Advantage/Disadvantage"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('competitorAnalysis', index)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sales Pitch */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Sales Pitch</h2>
                <button
                  type="button"
                  onClick={generateSalesPitch}
                  disabled={generatingSalesPitch}
                  className={`flex items-center gap-1 text-sm px-3 py-1 rounded text-white bg-[#1A4D4F] hover:bg-[#235D5F] transition-colors ${
                    generatingSalesPitch ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {generatingSalesPitch ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Pitch</span>
                    </>
                  )}
                </button>
              </div>
              
              <textarea
                name="salesPitch"
                value={product.salesPitch || ''}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white h-32"
                placeholder="Generate a sales pitch based on your product details, or write your own"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Click "Generate Pitch" to create a sales pitch based on your product details.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-white border border-zinc-600 rounded-md hover:bg-zinc-700/50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-[#1A4D4F] text-white rounded-md hover:bg-[#235D5F] transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>Save Product</span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => saveProduct(true)}
                disabled={loading || generatingLeads}
                className={`px-4 py-2 bg-[#3DD2D3] text-zinc-900 rounded-md hover:bg-[#4DE7E8] transition-colors ${
                  loading || generatingLeads ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {generatingLeads ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Generating Leads...</span>
                  </div>
                ) : (
                  <span>Save & Generate Leads</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
