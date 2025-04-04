'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFarm } from '@/context/FarmContext';
import BidList from '@/components/bid/BidList';
import Link from 'next/link';

export default function FarmerBidsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getMyFarms, getBids, loading: farmLoading } = useFarm();
  const [farms, setFarms] = useState([]);
  const [farmBids, setFarmBids] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingBidsCount, setPendingBidsCount] = useState(0);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_type !== 'farmer') {
        router.push('/unauthorized');
      } else {
        loadFarmsAndBids();
      }
    }
  }, [user, authLoading, router]);

  const loadFarmsAndBids = async () => {
    try {
      setLoading(true);
      
      // Get all farms belonging to the farmer
      const farmsData = await getMyFarms();
      setFarms(farmsData);
      
      // Get bids for each farm
      const bidsData = {};
      let pendingCount = 0;
      
      for (const farm of farmsData) {
        const farmBids = await getBids({ farm_id: farm.id });
        bidsData[farm.id] = farmBids;
        
        // Count pending bids
        pendingCount += farmBids.filter(bid => bid.status === 'pending').length;
      }
      
      setFarmBids(bidsData);
      setPendingBidsCount(pendingCount);
      
    } catch (err) {
      console.error("Error loading farms and bids:", err);
      setError("Failed to load your farms and bids data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
          <p className="mt-4 text-lg text-green-800 font-medium">Loading bids...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'farmer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Link 
                  href="/dashboard/farmer"
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
                {pendingBidsCount > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-yellow-200">
                    {pendingBidsCount} pending
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">Manage bids from companies interested in your farm produce</p>
            </div>

            <Link
              href="/dashboard/farmer/farms"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Manage Farms
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {farms.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No farms found</h3>
            <p className="mt-2 text-sm text-gray-500">You need to create farms before you can receive bids.</p>
            <div className="mt-6">
              <Link
                href="/dashboard/farmer/farms/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Your First Farm
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* All bids section with status filter */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                All Bids
                {pendingBidsCount > 0 && (
                  <span className="ml-2 text-sm font-medium text-yellow-600">
                    ({pendingBidsCount} pending require your attention)
                  </span>
                )}
              </h2>
              
              <BidList
                showFilters={true}
                title="Bids"
                onlyMyBids={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 