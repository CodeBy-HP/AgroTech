'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFarm } from '@/context/FarmContext';
import Link from 'next/link';

export default function FarmerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getMyFarms, getBids, loading: farmLoading } = useFarm();
  const [stats, setStats] = useState({
    totalFarms: 0,
    activeFarms: 0,
    totalBids: 0,
    pendingBids: 0
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_type !== 'farmer') {
        // Redirect if user is not a farmer
        router.push('/unauthorized');
      } else {
        loadDashboardData();
      }
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      // Get farms
      const farms = await getMyFarms();
      
      // Count active farms (growing or harvested)
      const activeFarms = farms.filter(farm => 
        farm.farm_status === 'growing' || farm.farm_status === 'harvested'
      ).length;
      
      // Get bids for all farms
      let allBids = [];
      for (const farm of farms) {
        const bids = await getBids({ farm_id: farm.id });
        allBids = [...allBids, ...bids];
      }
      
      // Count pending bids
      const pendingBids = allBids.filter(bid => bid.status === 'pending').length;
      
      setStats({
        totalFarms: farms.length,
        activeFarms,
        totalBids: allBids.length,
        pendingBids
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user || user.user_type !== 'farmer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-5 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.full_name}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your farm today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Farms
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalFarms}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Farms
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeFarms}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Bids
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalBids}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Bids
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.pendingBids}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Activity
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {stats.pendingBids > 0 ? (
                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-green-600 truncate">
                        You have {stats.pendingBids} pending bid{stats.pendingBids > 1 ? 's' : ''}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <p className="flex items-center text-sm text-gray-500">
                        Review and respond to these bids to close deals
                      </p>
                    </div>
                  </div>
                </li>
              ) : (
                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <p className="text-sm text-gray-500">No recent activity to show</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/farmer/farms/new"
            className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Create New Listing
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              List your crops for sale
            </span>
          </Link>

          <Link
            href="/dashboard/farmer/farms"
            className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Manage Farms
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              View and update your farm listings
            </span>
          </Link>

          <div
            className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Calendar View
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
