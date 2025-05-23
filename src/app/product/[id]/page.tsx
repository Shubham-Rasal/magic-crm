'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, RefreshCw, Mail, Phone, Calendar, Download, Upload, Trash2, Loader2 } from 'lucide-react';
import { IProduct, IProductLead, engagementStatuses } from '@/data/productData';
import Header from '@/components/Header';
import Grid from '@/components/grid';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [leads, setLeads] = useState<IProductLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingLeads, setGeneratingLeads] = useState(false);
  
  // Fetch product and leads from localStorage (would be from API in production)
  useEffect(() => {
    const storedProducts = localStorage.getItem('magicCRM_products');
    const storedLeads = localStorage.getItem(`magicCRM_leads_${params.id}`);
    
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        const currentProduct = parsedProducts.find((p: IProduct) => p.id === params.id);
        
        if (currentProduct) {
          setProduct(currentProduct);
        } else {
          // Product not found, redirect to main page
          router.push('/');
        }
      } catch (e) {
        console.error('Error parsing stored products', e);
        router.push('/');
      }
    } else {
      router.push('/');
    }
    
    if (storedLeads) {
      try {
        setLeads(JSON.parse(storedLeads));
      } catch (e) {
        console.error('Error parsing stored leads', e);
        setLeads([]);
      }
    }
    
    setLoading(false);
  }, [params.id, router]);
  
  // Generate leads using Perplexity API
  const generateLeads = async () => {
    if (!product) return;
    
    setGeneratingLeads(true);
    
    try {
      // Simulate API call for now
      setTimeout(() => {
        // Create some dummy leads for demonstration
        const newLeads: IProductLead[] = [
          {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            fullName: "Alex Thompson",
            email: "alex.thompson@cloudtech.io",
            companyName: "CloudTech Solutions",
            jobTitle: "Director of IT",
            phoneNumber: "555-234-5678",
            leadScore: 87,
            engagementStatus: "New",
            lastContacted: null,
            followUpDate: new Date(Date.now() + 3*24*60*60*1000),
            notes: "Found via LinkedIn search, company matches ideal customer profile",
            location: "Seattle, WA",
            buyerIntentSignals: ["Viewed pricing page", "Downloaded whitepaper"],
            customerFit: "High",
          },
          {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            fullName: "Jamie Rivera",
            email: "j.rivera@techconnections.com",
            companyName: "Tech Connections Inc.",
            jobTitle: "CIO",
            phoneNumber: "555-876-5432",
            leadScore: 75,
            engagementStatus: "New",
            lastContacted: null,
            followUpDate: new Date(Date.now() + 4*24*60*60*1000),
            notes: "Company recently received funding, potential need for new solutions",
            location: "Denver, CO",
            buyerIntentSignals: ["Attended webinar"],
            customerFit: "Medium",
          },
          {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            fullName: "Taylor Kim",
            email: "taylor.kim@rapidgrowth.net",
            companyName: "RapidGrowth Networks",
            jobTitle: "Head of Operations",
            phoneNumber: "555-345-6789",
            leadScore: 82,
            engagementStatus: "New",
            lastContacted: null,
            followUpDate: new Date(Date.now() + 2*24*60*60*1000),
            notes: "Company is scaling quickly, need our solution",
            location: "Portland, OR",
            buyerIntentSignals: ["Downloaded case study", "Multiple page visits"],
            customerFit: "High",
          },
        ];
        
        // Combine new leads with existing ones
        const combinedLeads = [...leads, ...newLeads];
        setLeads(combinedLeads);
        
        // Save to localStorage
        localStorage.setItem(`magicCRM_leads_${params.id}`, JSON.stringify(combinedLeads));
        setGeneratingLeads(false);
      }, 2000);
      
      /* Actual API call would look like this:
      const response = await fetch('/api/perplexity/generate-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate leads');
      }
      
      const data = await response.json();
      
      // Combine new leads with existing ones
      const newLeads = [...leads, ...data.leads];
      setLeads(newLeads);
      
      // Save to localStorage (would be API in production)
      localStorage.setItem(`magicCRM_leads_${params.id}`, JSON.stringify(newLeads));
      */
      
    } catch (error) {
      console.error('Error generating leads:', error);
      alert('Failed to generate leads. Please try again.');
      setGeneratingLeads(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(22,24,28)] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin mr-2">
            <Loader2 size={24} className="text-[#3DD2D3]" />
          </div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-[rgb(22,24,28)] flex flex-col">
        <Header />
        <div className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
            <p className="text-zinc-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="px-4 py-2 bg-[#1A4D4F] text-white rounded-md hover:bg-[#235D5F] transition-colors">
              Go back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[rgb(22,24,28)] flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Back button and title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <button 
                onClick={() => router.push('/')}
                className="flex items-center text-zinc-400 hover:text-white transition-colors mb-2"
              >
                <ArrowLeft size={16} className="mr-1" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                href={`/product/${product.id}/edit`}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors"
              >
                <Edit size={16} />
                <span>Edit</span>
              </Link>
              
              <button 
                onClick={generateLeads}
                disabled={generatingLeads}
                className={`flex items-center gap-2 px-3 py-2 bg-[#1A4D4F] text-white rounded-md hover:bg-[#235D5F] transition-colors ${
                  generatingLeads ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {generatingLeads ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Generate Leads</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Product details and sales pitch */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-zinc-800/30 rounded-xl border border-zinc-700/40 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Product Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-zinc-400">Description</h3>
                  <p className="text-white">{product.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400 mb-2">Features</h3>
                    <ul className="list-disc list-inside text-white">
                      {product.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400 mb-2">Benefits</h3>
                    <ul className="list-disc list-inside text-white">
                      {product.benefits?.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400 mb-2">Target Market</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.targetMarket?.map((market, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 text-xs rounded-full bg-zinc-700/40 text-zinc-300"
                        >
                          {market}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400 mb-2">Pricing</h3>
                    <p className="text-white">
                      <span className="text-zinc-300">{product.pricing.model}:</span> {product.pricing.startingAt}
                    </p>
                    {product.pricing.tiers && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium text-zinc-400 mb-1">Tiers:</h4>
                        <ul className="list-disc list-inside text-white text-sm">
                          {product.pricing.tiers.map((tier, index) => (
                            <li key={index}>{tier}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-800/30 rounded-xl border border-zinc-700/40 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Sales Pitch</h2>
              
              {product.salesPitch ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="whitespace-pre-line">{product.salesPitch}</div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <p className="text-zinc-400 mb-4">No sales pitch generated yet.</p>
                  <Link 
                    href={`/product/${product.id}/edit`}
                    className="px-3 py-1 bg-[#1A4D4F] text-white text-sm rounded-md hover:bg-[#235D5F] transition-colors"
                  >
                    Generate Sales Pitch
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Leads section with updated Grid component */}
          <div className="bg-zinc-800/30 rounded-xl border border-zinc-700/40 p-6">
            <Grid 
              productId={params.id} 
              onGenerateLeads={generateLeads} 
              loading={generatingLeads} 
              leads={leads}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
