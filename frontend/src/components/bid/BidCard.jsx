'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFarm } from '@/context/FarmContext';
import Link from 'next/link';
import { formatDate, formatCurrency, formatBidStatus } from '@/utils/formatters';
import { AlertTriangle, CheckCircle, Clock, MapPin, Trash2, X } from 'lucide-react';

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

  // Get status color class and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'accepted':
        return {
          bgClass: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle size={14} className="mr-1" />
        };
      case 'rejected':
        return {
          bgClass: 'bg-red-100 text-red-800 border-red-200',
          icon: <X size={14} className="mr-1" />
        };
      default:
        return {
          bgClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock size={14} className="mr-1" />
        };
    }
  };

  const isFarmer = user?.user_type === 'farmer';
  const isCompany = user?.user_type === 'company';
  const canManageBid = isFarmer && farm?.farmer_username === user.username;
  const isOwnBid = isCompany && bid.company_username === user.username;
  const statusInfo = getStatusInfo(bid.status);

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm p-5 animate-pulse">
        <div className="flex justify-between">
          <div className="space-y-3 w-full">
            <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
            <div className="pt-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-3 bg-gray-200 rounded-md w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded-md w-2/3"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-200 rounded-md w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded-md w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Link 
              href={`/dashboard/${user.user_type}/farms/${farm?.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors inline-flex items-center"
            >
              {farm?.crop_type || 'Unknown Crop'}
              {bid.status === 'accepted' && (
                <span className="ml-2 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">Selected</span>
              )}
            </Link>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={14} className="mr-1 text-gray-400" />
              {farm?.farm_location || 'Unknown Location'}
            </div>
          </div>
          
          <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center ${statusInfo.bgClass}`}>
            {statusInfo.icon}
            {formatBidStatus(bid.status)}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium mb-1">Bid Amount</p>
              <p className="text-base font-semibold text-gray-800">{formatCurrency(bid.bid_amount)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium mb-1">Bid Date</p>
              <p className="text-base font-semibold text-gray-800">{formatDate(bid.bid_date)}</p>
            </div>
          </div>
          
          {bid.company_username && (
            <div className="text-sm text-gray-600 flex items-center">
              <span className="font-medium mr-1">Bidder:</span> {bid.company_username}
            </div>
          )}
          
          {bid.status === 'pending' && (
            <div className="pt-4 mt-2 border-t border-gray-100">
              {canManageBid && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAcceptBid}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
                  >
                    <CheckCircle size={16} className="mr-1.5" />
                    Accept Bid
                  </button>
                  <button
                    onClick={handleRejectBid}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center"
                  >
                    <X size={16} className="mr-1.5" />
                    Reject
                  </button>
                </div>
              )}
              
              {isOwnBid && (
                <div className="flex justify-end">
                  {confirmDelete ? (
                    <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                      <AlertTriangle size={16} className="text-red-500" />
                      <span className="text-sm text-red-700">Are you sure?</span>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteBid}
                        className="px-3 py-1 text-xs bg-red-600 rounded-md text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Cancel Bid
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          
          {bid.status === 'accepted' && (
            <div className="mt-2 pt-3 border-t border-gray-100">
              <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800 flex items-start">
                <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Bid accepted!</span> The farm owner has accepted this bid.
                </div>
              </div>
            </div>
          )}
          
          {bid.status === 'rejected' && (
            <div className="mt-2 pt-3 border-t border-gray-100">
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 flex items-start">
                <X size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Bid rejected.</span> The farm owner has declined this bid.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}