'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { formatDate, formatCurrency, formatFarmStatus } from '@/utils/formatters';

export default function FarmCard({ farm }) {
  const { user } = useAuth();
  
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'harvested':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'growing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Crop-specific background patterns/colors
  const getCropStyleClass = () => {
    const cropType = (farm.crop_type || '').toLowerCase();
    if (cropType.includes('wheat')) return 'bg-amber-50';
    if (cropType.includes('rice')) return 'bg-teal-50';
    if (cropType.includes('corn')) return 'bg-yellow-50';
    if (cropType.includes('cotton')) return 'bg-blue-50';
    return 'bg-lime-50'; // Default for other crops
  };

  return (
    <div className={`border-2 border-green-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${getCropStyleClass()}`}>
      {/* Top curved decoration */}
      <div className="h-3 bg-green-500 w-full rounded-b-3xl mb-2"></div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-green-800 mb-1 flex items-center">
              {farm.crop_type || 'Unspecified Crop'}
              {farm.is_organic && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800 border border-green-300">
                  <span className="mr-1">•</span>Organic
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {farm.farm_location}
            </p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColorClass(farm.farm_status)}`}>
            {formatFarmStatus(farm.farm_status)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white bg-opacity-60 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Farm Area</p>
            <p className="text-sm font-bold text-gray-800">{farm.farm_area} hectares</p>
          </div>
          
          {farm.expected_harvest_date && (
            <div className="bg-white bg-opacity-60 p-3 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Expected Harvest</p>
              <p className="text-sm font-bold text-gray-800">{formatDate(farm.expected_harvest_date)}</p>
            </div>
          )}
          
          {farm.expected_quantity && (
            <div className="bg-white bg-opacity-60 p-3 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Expected Yield</p>
              <p className="text-sm font-bold text-gray-800">{farm.expected_quantity} tons</p>
            </div>
          )}
          
          {farm.min_asking_price && (
            <div className="bg-white bg-opacity-60 p-3 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Min. Price</p>
              <p className="text-sm font-bold text-green-700">{formatCurrency(farm.min_asking_price)}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-green-100">
          <Link
            href={`/dashboard/${user.user_type}/farms/${farm.id}`}
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}