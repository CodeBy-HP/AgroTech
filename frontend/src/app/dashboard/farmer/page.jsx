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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-800 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'farmer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 mb-8">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h1 className="text-3xl font-bold">
              Welcome back, {user.full_name}!
            </h1>
            <p className="mt-2 text-green-100">
              Here's what's happening with your farm today.
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Farms
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {stats.totalFarms}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm text-gray-500">
                <Link href="/dashboard/farmer/farms" className="text-green-600 hover:text-green-800 font-medium">
                  View all farms →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Farms
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {stats.activeFarms}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm text-gray-500">
                <span className="text-green-600 font-medium">
                  {stats.activeFarms > 0 ? `${(stats.activeFarms / stats.totalFarms * 100).toFixed(0)}% of your farms` : 'No active farms'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Bids
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {stats.totalBids}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm text-gray-500">
                <span className="text-green-600 font-medium">
                  {stats.totalBids > 0 ? 'Market activity' : 'No bids yet'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Bids
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {stats.pendingBids}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm">
                {stats.pendingBids > 0 ? (
                  <span className="text-yellow-600 font-medium">
                    Needs attention
                  </span>
                ) : (
                  <span className="text-green-600 font-medium">
                    All caught up
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="bg-white shadow-md overflow-hidden rounded-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activity
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {stats.pendingBids > 0 ? (
                <li className="hover:bg-green-50 transition-colors duration-150">
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p className="text-md font-medium text-gray-800">
                          You have {stats.pendingBids} pending bid{stats.pendingBids > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="flex items-center text-sm text-gray-600 ml-8">
                        Review and respond to these bids to close deals
                      </p>
                      <Link href="/dashboard/farmer/bids" className="text-green-600 hover:text-green-800 text-sm font-medium">
                        View all bids →
                      </Link>
                    </div>
                  </div>
                </li>
              ) : (
                <li>
                  <div className="px-6 py-5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">No recent activity to show</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 px-1">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/farmer/farms/new"
            className="relative block w-full border-2 border-green-200 rounded-lg p-6 text-center hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="mt-4 block text-lg font-medium text-gray-900">
              Create New Listing
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              List your crops for sale
            </span>
          </Link>

          <Link
            href="/dashboard/farmer/farms"
            className="relative block w-full border-2 border-green-200 rounded-lg p-6 text-center hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <span className="mt-4 block text-lg font-medium text-gray-900">
              Manage Farms
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              View and update your farm listings
            </span>
          </Link>

          <Link
            href="/dashboard/farmer/bids"
            className="relative block w-full border-2 border-green-200 rounded-lg p-6 text-center hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <span className="mt-4 block text-lg font-medium text-gray-900">
              Manage Bids
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Review and respond to offers
            </span>
            {stats.pendingBids > 0 && (
              <div className="absolute top-3 right-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-medium text-yellow-800">
                  {stats.pendingBids}
                </span>
              </div>
            )}
          </Link>

          <Link
            href="/dashboard/farmer/market-prices"
            className="relative block w-full border-2 border-green-200 rounded-lg p-6 text-center hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <span className="mt-4 block text-lg font-medium text-gray-900">
              Track Market Price
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              View latest commodity prices
            </span>
          </Link>

          <Link
            href="/dashboard/farmer/weather"
            className="relative block w-full border-2 border-green-200 rounded-lg p-6 text-center hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="mt-4 block text-lg font-medium text-gray-900">
              Weather Forecast
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Check weather conditions for your farms
            </span>
          </Link>

          <Link
            href="/dashboard/farmer/crop-health"
            className="relative block w-full border-2 border-green-200 rounded-lg p-6 text-center hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l3-3 3 3m0 0l-3 3m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="mt-4 block text-lg font-medium text-gray-900">
              Crop Health Assistant
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Identify diseases and get treatment recommendations
            </span>
          </Link>

          <Link
            href="/dashboard/farmer/schemes"
            className="relative block w-full border-2 border-amber-200 rounded-lg p-6 text-center hover:bg-amber-50 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-amber-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="mt-4 block text-lg font-medium text-gray-900">
              Government Schemes
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Access government initiatives for farmers
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}