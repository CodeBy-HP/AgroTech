'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFarm } from '@/context/FarmContext';
import Link from 'next/link';
import FarmForm from '@/components/farm/FarmForm';

export default function EditFarmPage({ params }) {
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
      } else if (user.user_type !== 'farmer') {
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
      
      // Check if the current user is the owner of this farm
      if (farmData.farmer_username !== user.username) {
        setError("You don't have permission to edit this farm");
        router.push('/dashboard/farmer/farms');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-800 font-medium">Loading farm data...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'farmer') {
    return null; // Don't render anything until redirect happens
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-red-100">
          <div className="flex items-center mb-4 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
          <Link 
            href="/dashboard/farmer/farms" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Return to My Farms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white">
            <Link 
              href={`/dashboard/farmer/farms/${farmId}`} 
              className="mr-4 text-white hover:text-green-100 transition-colors"
              aria-label="Back to farm details"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Farm</h1>
              <p className="text-sm text-green-100">Update your farm information</p>
            </div>
          </div>

          <div className="p-6">
            {farm && (
              <div className="bg-green-50 p-4 mb-6 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-green-800">You are editing: {farm.name}</span>
                </div>
                <p className="text-sm text-green-700">Make changes to your farm details below</p>
              </div>
            )}
            
            {farm && (
              <FarmForm 
                initialData={farm} 
                isEdit={true} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}