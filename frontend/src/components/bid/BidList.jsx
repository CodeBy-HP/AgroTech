'use client';

import { useState, useEffect } from 'react';
import { useFarm } from '@/context/FarmContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import BidCard from './BidCard';

export default function BidList({ 
  farmId = null, 
  showFilters = true,
  onlyMyBids = false,
  title = "Bids"
}) {
  const { loading, error, getBids, getMyBids } = useFarm();
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [filters, setFilters] = useState({
    farm_id: farmId,
    status: ''
  });

  const fetchBids = async () => {
    try {
      let fetchedBids;
      if (onlyMyBids && user?.user_type === 'company') {
        fetchedBids = await getMyBids(filters.status || null);
      } else {
        fetchedBids = await getBids(filters);
      }
      setBids(fetchedBids);
    } catch (err) {
      console.error("Error fetching bids:", err);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [farmId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchBids();
  };

  const resetFilters = () => {
    setFilters({
      farm_id: farmId,
      status: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      
      {showFilters && !farmId && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Bids</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : bids.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No bids found matching your criteria.</p>
          {!farmId && user?.user_type === 'company' && (
            <Link href="/dashboard/company/farms" className="mt-4 inline-block text-green-600 hover:text-green-800">
              Browse farms to place bids
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map(bid => (
            <BidCard key={bid.id} bid={bid} onStatusChange={fetchBids} />
          ))}
        </div>
      )}
    </div>
  );
} 