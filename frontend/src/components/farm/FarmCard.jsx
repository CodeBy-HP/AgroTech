'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { formatDate, formatCurrency, formatFarmStatus } from '@/utils/formatters';

export default function FarmCard({ farm }) {
  const { user } = useAuth();
  
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'harvested':
        return 'bg-green-100 text-green-800';
      case 'growing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {farm.crop_type || 'Unspecified Crop'}
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(farm.farm_status)}`}>
            {formatFarmStatus(farm.farm_status)}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          {farm.farm_location}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-500">Farm Area</p>
            <p className="text-sm font-medium">{farm.farm_area} hectares</p>
          </div>
          {farm.expected_harvest_date && (
            <div>
              <p className="text-xs text-gray-500">Expected Harvest</p>
              <p className="text-sm font-medium">{formatDate(farm.expected_harvest_date)}</p>
            </div>
          )}
          {farm.expected_quantity && (
            <div>
              <p className="text-xs text-gray-500">Expected Quantity</p>
              <p className="text-sm font-medium">{farm.expected_quantity} tons</p>
            </div>
          )}
          {farm.min_asking_price && (
            <div>
              <p className="text-xs text-gray-500">Min. Asking Price</p>
              <p className="text-sm font-medium">{formatCurrency(farm.min_asking_price)}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
          <div className="flex-1">
            {farm.is_organic && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Organic
              </span>
            )}
          </div>
          
          <Link
            href={`/dashboard/${user.user_type}/farms/${farm.id}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 