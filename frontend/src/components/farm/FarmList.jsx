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
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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
    if (window.innerWidth < 768) {
      setIsFilterVisible(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      crop_type: '',
      is_organic: '',
      farm_location: '',
      farm_status: ''
    });
  };

  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-white p-6 rounded-xl shadow-md border border-green-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          {title}
        </h2>
        
        {showFilters && (
          <button 
            onClick={toggleFilters}
            className="md:hidden px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        )}
      </div>
      
      {showFilters && (
        <div className={`mb-8 bg-white p-5 rounded-xl shadow-sm border border-green-100 transition-all duration-300 ${isFilterVisible ? 'block' : 'hidden md:block'}`}>
          <h3 className="text-lg font-medium text-green-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Farms
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label htmlFor="crop_type" className="block text-sm font-medium text-gray-700">
                Crop Type
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="crop_type"
                  name="crop_type"
                  value={filters.crop_type}
                  onChange={handleFilterChange}
                  className="pl-10 block w-full rounded-md border-gray-300 bg-white text-gray-900 placeholder-gray-500 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  placeholder="e.g. Wheat, Rice"
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="farm_location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="farm_location"
                  name="farm_location"
                  value={filters.farm_location}
                  onChange={handleFilterChange}
                  className="pl-10 block w-full rounded-md border-gray-300 bg-white text-gray-900 placeholder-gray-500 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  placeholder="e.g. Punjab, Maharashtra"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="farm_status" className="block text-sm font-medium text-gray-700">
                Farm Status
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  id="farm_status"
                  name="farm_status"
                  value={filters.farm_status}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                >
                  <option value="">All Statuses</option>
                  <option value="empty">Empty</option>
                  <option value="growing">Growing</option>
                  <option value="harvested">Harvested</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center mt-7">
              <input
                id="is_organic"
                name="is_organic"
                type="checkbox"
                checked={filters.is_organic === true}
                onChange={(e) => setFilters(prev => ({ ...prev, is_organic: e.target.checked ? true : '' }))}
                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="is_organic" className="ml-2 block text-sm text-gray-900">
                Organic Only
              </label>
            </div>
          </div>
          
          <div className="mt-5 flex justify-end space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {errorState && (
        <div className="mb-4 p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorState}
        </div>
      )}
      
      {loadingState ? (
        <div className="flex flex-col justify-center items-center h-60 bg-white bg-opacity-50 rounded-lg border border-gray-100">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
          <p className="text-green-800">Loading farms...</p>
        </div>
      ) : farmsState.length === 0 ? (
        <div className="text-center py-12 bg-white bg-opacity-60 rounded-lg border border-dashed border-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-lg text-gray-600">No farms found matching your criteria.</p>
          {!onlyMyFarms && user?.user_type === 'farmer' && (
            <Link href="/dashboard/farmer/farms/new" className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create a new farm listing
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