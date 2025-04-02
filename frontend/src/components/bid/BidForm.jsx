'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFarm } from '@/context/FarmContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatters';

export default function BidForm({ farmId }) {
  const router = useRouter();
  const { getFarmById, createBid, loading } = useFarm();
  const { user, token } = useAuth();
  const [farm, setFarm] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated or not a company
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.user_type !== 'company') {
      router.push('/unauthorized');
    } else {
      loadFarm();
    }
  }, [user, farmId, router]);

  const loadFarm = async () => {
    if (!farmId || !token) return;
    
    try {
      setIsLoading(true);
      const farmData = await getFarmById(farmId);
      setFarm(farmData);
      
      // Set min bid amount based on farm's min asking price if available
      if (farmData.min_asking_price) {
        setBidAmount(farmData.min_asking_price);
      }
    } catch (err) {
      setError("Failed to load farm data. Please try again.");
      console.error("Error loading farm:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      setError('You must be logged in to place a bid');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      if (!bidAmount || bidAmount <= 0) {
        setError('Please enter a valid bid amount');
        return;
      }
      
      // Create bid
      const bidData = {
        farm_id: farmId,
        bid_amount: parseFloat(bidAmount)
      };
      
      await createBid(bidData);
      
      setSuccess('Your bid has been placed successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/dashboard/company/farms/${farmId}`);
      }, 2000);
      
    } catch (err) {
      if (err.message === 'Not authenticated') {
        setError('Session expired. Please log in again');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const errorMsg = err.message || 'Failed to place bid. Please try again.';
        setError(errorMsg);
      }
    }
  };

  // If not logged in or not a company, show a message
  if (!user || user.user_type !== 'company') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600">
          {!user ? 'Not authenticated. Please log in.' : 'You must be a company to access this feature.'}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600">
          Farm not found or you don't have access to view this farm.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Place a Bid for {farm.crop_type}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Farm Location: {farm.farm_location}
        </p>
        
        {farm.min_asking_price && (
          <div className="mt-4 text-sm text-gray-700">
            <span className="font-medium">Minimum asking price: </span>
            {formatCurrency(farm.min_asking_price)}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="bid_amount" className="block text-sm font-medium text-gray-700">
            Your Bid Amount (₹)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="bid_amount"
              min="0"
              step="0.01"
              value={bidAmount}
              onChange={e => setBidAmount(e.target.value)}
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="0.00"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter your bid amount in Indian Rupees (₹).
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/company/farms/${farmId}`)}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Placing Bid...' : 'Place Bid'}
          </button>
        </div>
      </form>
    </div>
  );
} 