'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import FarmList from '@/components/farm/FarmList';
import { Tractor, Plus } from 'lucide-react';

export default function FarmerFarmsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_type !== 'farmer') {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
          <p className="mt-4 text-green-700 font-medium">Loading your farms...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'farmer') {
    return null; // Don't render anything until redirect happens
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Tractor size={24} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Farms Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your farm listings and view bids from companies.
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard/farmer/farms/new" 
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 self-start sm:self-auto"
            >
              <Plus size={18} className="mr-2" />
              Add New Farm
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              My Farm Listings
              <span className="ml-2 px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Active
              </span>
            </h2>
          </div>
          <div className="mt-4">
            <FarmList
              onlyMyFarms={true}
              title="My Farm Listings"
              showFilters={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}