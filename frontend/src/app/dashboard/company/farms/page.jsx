'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FarmList from '@/components/farm/FarmList';

export default function CompanyFarmsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_type !== 'company') {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user || user.user_type !== 'company') {
    return null; // Don't render anything until redirect happens
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900">Browse Farms</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find farms with available produce and place bids.
        </p>
      </div>

      <div className="mt-6">
        <FarmList showFilters={true} />
      </div>
    </div>
  );
} 