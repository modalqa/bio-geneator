'use client';

import Hero from '@/components/Hero';
import Features from '@/components/Features';
import BioGenerator from '@/components/BioGenerator';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Hero />
      <Features />
      <BioGenerator />
      <FAQ />
      <Footer />
    </main>
  );
}
