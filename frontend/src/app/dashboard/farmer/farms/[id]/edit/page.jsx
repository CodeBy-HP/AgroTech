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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user || user.user_type !== 'farmer') {
    return null; // Don't render anything until redirect happens
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-red-600 mb-4">{error}</div>
          <Link 
            href="/dashboard/farmer/farms" 
            className="text-green-600 hover:text-green-800"
          >
            Return to My Farms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6 flex items-center">
        <Link 
          href={`/dashboard/farmer/farms/${farmId}`} 
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Farm</h1>
      </div>

      <div className="mt-6">
        {farm && (
          <FarmForm 
            initialData={farm} 
            isEdit={true} 
          />
        )}
      </div>
    </div>
  );
} 