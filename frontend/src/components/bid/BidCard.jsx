'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFarm } from '@/context/FarmContext';
import Link from 'next/link';
import { formatDate, formatCurrency, formatBidStatus } from '@/utils/formatters';

export default function BidCard({ bid, onStatusChange }) {
  const { user } = useAuth();
  const { getFarmById, updateBid, deleteBid } = useFarm();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const loadFarm = async () => {
      try {
        const farmData = await getFarmById(bid.farm_id);
        setFarm(farmData);
      } catch (error) {
        console.error("Error loading farm details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFarm();
  }, [bid.farm_id]);

  const handleAcceptBid = async () => {
    try {
      await updateBid(bid.id, { status: 'accepted' });
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error accepting bid:", error);
    }
  };

  const handleRejectBid = async () => {
    try {
      await updateBid(bid.id, { status: 'rejected' });
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error rejecting bid:", error);
    }
  };

  const handleDeleteBid = async () => {
    try {
      await deleteBid(bid.id);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error deleting bid:", error);
    }
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const isFarmer = user?.user_type === 'farmer';
  const isCompany = user?.user_type === 'company';
  const canManageBid = isFarmer && farm?.farmer_username === user.username;
  const isOwnBid = isCompany && bid.company_username === user.username;

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link 
              href={`/dashboard/${user.user_type}/farms/${farm?.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-green-600"
            >
              {farm?.crop_type || 'Unknown Crop'}
            </Link>
            <p className="text-sm text-gray-600">
              Farm Location: {farm?.farm_location || 'Unknown'}
            </p>
          </div>
          
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(bid.status)}`}>
            {formatBidStatus(bid.status)}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Bid Amount</p>
              <p className="text-sm font-medium">{formatCurrency(bid.bid_amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Bid Date</p>
              <p className="text-sm font-medium">{formatDate(bid.bid_date)}</p>
            </div>
          </div>
          
          {bid.status === 'pending' && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              {canManageBid && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleAcceptBid}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleRejectBid}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Reject
                  </button>
                </div>
              )}
              
              {isOwnBid && (
                <div className="flex justify-end">
                  {confirmDelete ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Are you sure?</span>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteBid}
                        className="px-2 py-1 text-xs text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="text-sm text-gray-600 hover:text-red-600"
                    >
                      Cancel Bid
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 