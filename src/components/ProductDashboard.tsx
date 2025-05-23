// Product dashboard component
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Package, ChevronRight, Calendar, ArrowUpRight, Users, Sparkles } from 'lucide-react';
import { IProduct, sampleProducts } from '@/data/productData';
import Link from 'next/link';

export default function ProductDashboard() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize with sample products for now
  // Later will load from localStorage/backend
  useEffect(() => {
    // Get products from localStorage or use samples
    const storedProducts = localStorage.getItem('magicCRM_products');
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        console.error('Error parsing stored products', e);
        setProducts(sampleProducts);
      }
    } else {
      setProducts(sampleProducts);
    }
    setLoading(false);
  }, []);

  // Save products to localStorage when they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('magicCRM_products', JSON.stringify(products));
    }
  }, [products, loading]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Your Magic Sheets
        </motion.h1>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A4D4F] text-[#3DD2D3] rounded-lg hover:bg-[#235D5F] transition-colors"
          onClick={() => {
            // Navigate to product creation page
            window.location.href = '/product/new';
          }}
        >
          <PlusCircle size={18} />
          <span>Create Magic Sheet</span>
        </motion.button>
      </div>
      
      {/* Product Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {loading ? (
          // Skeleton loaders
          Array(3).fill(null).map((_, index) => (
            <div 
              key={`skeleton-${index}`} 
              className="bg-zinc-800/30 rounded-xl border border-zinc-700/40 p-6 h-64 animate-pulse"
            />
          ))
        ) : products.length > 0 ? (
          // Product cards
          products.map((product) => (
            <Link 
              href={`/product/${product.id}`} 
              key={product.id}
              className="block"
            >
              <motion.div 
                className="bg-zinc-800/30 hover:bg-zinc-800/50 rounded-xl border border-zinc-700/40 p-6 h-full flex flex-col transition-colors group relative"
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-70 transition-opacity">
                  <ChevronRight size={20} className="text-zinc-400" />
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#1A4D4F]/40 flex items-center justify-center">
                    <Package size={20} className="text-[#3DD2D3]" />
                  </div>
                  <h2 className="text-xl font-semibold text-white truncate max-w-[200px]">
                    {product.name}
                  </h2>
                </div>
                
                <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                  {product.description}
                </p>
                
                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Calendar size={14} />
                      <span>Updated {new Date(product.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Users size={14} />
                      <span>
                        {(() => {
                          try {
                            const storedLeads = localStorage.getItem(`magicCRM_leads_${product.id}`);
                            if (storedLeads) {
                              const leads = JSON.parse(storedLeads);
                              return `${leads.length} Leads`;
                            }
                            return '0 Leads';
                          } catch (e) {
                            return '0 Leads';
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Target market tags */}
                  <div className="flex flex-wrap gap-2">
                    {product.targetMarket.slice(0, 2).map((market, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 text-xs rounded-full bg-zinc-700/40 text-zinc-300"
                      >
                        {market}
                      </span>
                    ))}
                    {product.targetMarket.length > 2 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-zinc-700/40 text-zinc-300">
                        +{product.targetMarket.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          // Empty state
          <div className="col-span-full bg-zinc-800/30 rounded-xl border border-zinc-700/40 p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1A4D4F]/40 flex items-center justify-center mb-4">
              <Sparkles size={28} className="text-[#3DD2D3]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Magic Sheets Yet</h3>
            <p className="text-zinc-400 mb-6 max-w-md">
              Create your first Magic Sheet to start generating leads and sales pitches for your product.
            </p>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#1A4D4F] text-[#3DD2D3] rounded-lg hover:bg-[#235D5F] transition-colors"
              onClick={() => {
                window.location.href = '/product/new';
              }}
            >
              <PlusCircle size={18} />
              <span>Create Your First Magic Sheet</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
