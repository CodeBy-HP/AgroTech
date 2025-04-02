'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFarm } from '@/context/FarmContext';
import Link from 'next/link';
import BidList from '@/components/bid/BidList';
import { formatDate, formatCurrency, formatFarmStatus } from '@/utils/formatters';

export default function CompanyFarmDetailPage({ params }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getFarmById, loading: farmLoading } = useFarm();
  const [farm, setFarm] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const paramValue = use(params);
  const farmId = paramValue.id;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_type !== 'company') {
        router.push('/unauthorized');
      } else {
        // Load farm data
        loadFarm();
      }
    }
  }, [user, authLoading, farmId]);

  const loadFarm = async () => {
    try {
      setIsLoading(true);
      const farmData = await getFarmById(farmId);
      
      // Check if farmData is null (error fetching)
      if (!farmData) {
        setError("Failed to load farm data. Please try again.");
        return;
      }
      
      setFarm(farmData);
    } catch (err) {
      setError("Failed to load farm data. Please try again.");
      console.error("Error loading farm:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user || user.user_type !== 'company') {
    return null; // Don't render anything until redirect happens
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-red-600 mb-4">{error}</div>
          <Link 
            href="/dashboard/company/farms" 
            className="text-green-600 hover:text-green-800"
          >
            Return to Farms
          </Link>
        </div>
      </div>
    );
  }

  if (!farm) return null;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
        <div className="flex items-center">
          <Link 
            href="/dashboard/company/farms" 
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {farm.crop_type || 'Farm Details'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{farm.farm_location}</p>
          </div>
        </div>
        
        <Link
          href={`/dashboard/company/farms/${farm.id}/bid`}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Place Bid
        </Link>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Farm Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and specifications of the farm.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  farm.farm_status === 'harvested' ? 'bg-green-100 text-green-800' :
                  farm.farm_status === 'growing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {formatFarmStatus(farm.farm_status)}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Farm Area</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{farm.farm_area} hectares</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Farming Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {farm.is_organic ? 'Organic' : 'Conventional'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expected Harvest Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(farm.expected_harvest_date)}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expected Quantity</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {farm.expected_quantity ? `${farm.expected_quantity} tons` : 'Not specified'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Minimum Asking Price</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {farm.min_asking_price ? formatCurrency(farm.min_asking_price) : 'Not specified'}
              </dd>
            </div>
            {farm.pesticides_used && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Pesticides/Fertilizers Used</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{farm.pesticides_used}</dd>
              </div>
            )}
            {farm.latitude && farm.longitude && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Geolocation</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Latitude: {farm.latitude}, Longitude: {farm.longitude}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <BidList 
          farmId={farm.id} 
          title="My Bids for this Farm" 
          showFilters={false} 
        />
      </div>
    </div>
  );
} 