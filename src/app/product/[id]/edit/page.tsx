'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProductForm from '@/components/ProductForm';
import { IProduct } from '@/data/productData';
import { Loader2 } from 'lucide-react';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get product data from localStorage
    const storedProducts = localStorage.getItem('magicCRM_products');
    
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
    
    setLoading(false);
  }, [params.id, router]);

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

  return (
    <div className="min-h-screen bg-[rgb(22,24,28)] flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {product ? (
            <ProductForm existingProduct={product} />
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
              <p className="text-zinc-400">The product you're trying to edit doesn't exist or has been removed.</p>
              <button 
                onClick={() => router.push('/')}
                className="mt-4 px-4 py-2 bg-[#1A4D4F] text-white rounded-md hover:bg-[#235D5F] transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
