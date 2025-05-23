'use client';
import React from 'react';
import Header from '@/components/Header';
import ProductForm from '@/components/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="min-h-screen bg-[rgb(22,24,28)] flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <ProductForm />
        </div>
      </main>
    </div>
  );
}
