'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFarm } from '@/context/FarmContext';
import Link from 'next/link';
import BidList from '@/components/bid/BidList';
import ImageGallery from '@/components/farm/ImageGallery';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="p-8 rounded-full bg-white shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'company') {
    return null; // Don't render anything until redirect happens
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500">
          <div className="text-red-600 mb-6 flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
          <Link 
            href="/dashboard/company/farms" 
            className="inline-flex items-center px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Farms
          </Link>
        </div>
      </div>
    );
  }

  if (!farm) return null;

  // Function to get farm status color classes
  const getStatusClasses = (status) => {
    switch(status) {
      case 'harvested': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'growing': 
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default: 
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-5 sm:px-8 flex justify-between items-start relative">
            <div className="flex items-center">
              <Link 
                href="/dashboard/company/farms" 
                className="mr-4 p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                  {farm.crop_type || 'Farm Details'}
                  <span className={`ml-4 px-3 py-1 text-xs font-bold rounded-full ${getStatusClasses(farm.farm_status)}`}>
                    {formatFarmStatus(farm.farm_status)}
                  </span>
                </h1>
                <p className="mt-2 text-sm text-gray-500 flex items-center">
                  <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {farm.farm_location}
                </p>
              </div>
            </div>
            
            <Link
              href={`/dashboard/company/farms/${farm.id}/bid`}
              className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Place Bid
            </Link>
          </div>
        </div>

        {/* Farm Information Section */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-5 sm:px-8 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Farm Information</h3>
            <p className="mt-1 text-sm text-gray-500">Details and specifications of the farm.</p>
          </div>
          
          {/* Farm Images Section */}
          {farm.images && farm.images.length > 0 ? (
            <div className="px-6 py-5 sm:px-8 border-b border-gray-100">
              <div className="flex items-center mb-4">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Farm Images</h3>
              </div>
              <ImageGallery images={farm.images} />
            </div>
          ) : (
            <div className="px-6 py-5 sm:px-8 border-b border-gray-100">
              <div className="flex items-center mb-4">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Farm Images</h3>
              </div>
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path 
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No images uploaded for this farm</p>
              </div>
            </div>
          )}
          
          <div className="bg-white">
            <dl>
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 hover:bg-green-50 transition-colors duration-200">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Farm Area
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">{farm.farm_area} hectares</dd>
              </div>
              
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 bg-gray-50 hover:bg-green-50 transition-colors duration-200">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Farming Type
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${farm.is_organic ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {farm.is_organic ? 'Organic' : 'Conventional'}
                  </span>
                </dd>
              </div>
              
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 hover:bg-green-50 transition-colors duration-200">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Expected Harvest Date
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(farm.expected_harvest_date)}
                </dd>
              </div>
              
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 bg-gray-50 hover:bg-green-50 transition-colors duration-200">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  Expected Quantity
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                  {farm.expected_quantity ? `${farm.expected_quantity} tons` : 'Not specified'}
                </dd>
              </div>
              
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 hover:bg-green-50 transition-colors duration-200">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Minimum Asking Price
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                  {farm.min_asking_price ? formatCurrency(farm.min_asking_price) : 'Not specified'}
                </dd>
              </div>
              
              {farm.pesticides_used && (
                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 bg-gray-50 hover:bg-green-50 transition-colors duration-200">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Pesticides/Fertilizers
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">{farm.pesticides_used}</dd>
                </div>
              )}
              
              {farm.latitude && farm.longitude && (
                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 hover:bg-green-50 transition-colors duration-200">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Geolocation
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <span className="mr-3">Latitude: {farm.latitude}</span>
                      <span>Longitude: {farm.longitude}</span>
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Bids Section */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="px-6 py-5 sm:px-8 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">My Bids for this Farm</h3>
          </div>
          <div className="p-2 sm:p-4">
            <BidList 
              farmId={farm.id} 
              title="" 
              showFilters={false} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}