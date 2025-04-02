'use client';

import { useState, useEffect } from 'react';
import { useFarm } from '@/context/FarmContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import FarmCard from './FarmCard';
import { formatDate } from '@/utils/formatters';

export default function FarmList({ 
  initialFilters = {}, 
  showFilters = true,
  onlyMyFarms = false,
  title = "Available Farms"
}) {
  const { farms, loading, error, getFarms, getMyFarms } = useFarm();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    crop_type: '',
    is_organic: '',
    farm_location: '',
    farm_status: '',
    ...initialFilters
  });
  const [loadingState, setLoading] = useState(loading);
  const [errorState, setError] = useState(error);
  const [farmsState, setFarms] = useState(farms);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      setError('');
      
      let farms;
      if (onlyMyFarms && user?.user_type === 'farmer') {
        farms = await getMyFarms();
      } else {
        farms = await getFarms(filters);
      }
      
      // Make sure we have farms array even if API returns null/undefined
      setFarms(farms || []);
    } catch (err) {
      console.error("Error fetching farms:", err);
      setError("Failed to fetch farms. Please try again later.");
      setFarms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox (boolean) separately
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const applyFilters = () => {
    fetchFarms();
  };

  const resetFilters = () => {
    setFilters({
      crop_type: '',
      is_organic: '',
      farm_location: '',
      farm_status: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      
      {showFilters && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Farms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="crop_type" className="block text-sm font-medium text-gray-700">
                Crop Type
              </label>
              <input
                type="text"
                id="crop_type"
                name="crop_type"
                value={filters.crop_type}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="e.g. Wheat, Rice"
              />
            </div>
            
            <div>
              <label htmlFor="farm_location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="farm_location"
                name="farm_location"
                value={filters.farm_location}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="e.g. Punjab, Maharashtra"
              />
            </div>
            
            <div>
              <label htmlFor="farm_status" className="block text-sm font-medium text-gray-700">
                Farm Status
              </label>
              <select
                id="farm_status"
                name="farm_status"
                value={filters.farm_status}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">All</option>
                <option value="empty">Empty</option>
                <option value="growing">Growing</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>
            
            <div className="flex items-center mt-7">
              <input
                id="is_organic"
                name="is_organic"
                type="checkbox"
                checked={filters.is_organic === true}
                onChange={(e) => setFilters(prev => ({ ...prev, is_organic: e.target.checked ? true : '' }))}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="is_organic" className="ml-2 block text-sm text-gray-900">
                Organic Only
              </label>
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
      
      {errorState && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {errorState}
        </div>
      )}
      
      {loadingState ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : farmsState.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No farms found matching your criteria.</p>
          {!onlyMyFarms && user?.user_type === 'farmer' && (
            <Link href="/dashboard/farmer/farms/new" className="mt-4 inline-block text-green-600 hover:text-green-800">
              + Create a new farm listing
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmsState.map(farm => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      )}
    </div>
  );
} 