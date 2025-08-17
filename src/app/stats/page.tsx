'use client';

import { useEffect, useState } from 'react';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

interface PlatformStats {
  platform: string;
  count: number;
  percentage: number;
}

export default function Stats() {
  const [totalGenerated, setTotalGenerated] = useState(0);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [lastGeneratedDate, setLastGeneratedDate] = useState<string>('');

  // In a real application, you would fetch these stats from your backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stats');
        }
        
        // Calculate total platform generations
        const totalPlatformGens = Object.values(data.platformStats as Record<string, number>)
          .reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
        
        // Convert platform stats to array format with percentages
        const platforms = Object.entries(data.platformStats as Record<string, number>)
          .map(([platform, count]) => ({
            platform,
            count: typeof count === 'number' ? count : 0,
            percentage: totalPlatformGens > 0 ? (count / totalPlatformGens) * 100 : 0
          }))
          .sort((a, b) => b.count - a.count);

        setTotalGenerated(data.totalBiosGenerated);
        setPlatformStats(platforms);
        setLastGeneratedDate(data.lastGeneratedDate || '');
    } catch (error) {
      console.error('Error loading stats:', error);
      // Set default values if there's an error
      setTotalGenerated(0);
      setPlatformStats([]);
      setLastGeneratedDate('');
    }
    };

    fetchStats();

    // State updates are now handled inside the try block
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Generation Statistics</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-orange-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Bio Generated</h2>
              <p className="text-4xl font-bold text-orange-600">{totalGenerated}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Last Generated</h2>
              <p className="text-xl text-blue-600">
                {lastGeneratedDate || 'No bio generated yet'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Distribution</h2>
          <div className="space-y-4">
            {platformStats.map((stat) => (
              <div key={stat.platform} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{stat.platform}</span>
                  <span className="text-sm font-medium text-gray-700">{stat.count} bio</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${stat.percentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <FAQ />
      <Footer />
    </main>
  );
}
