'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import FarmForm from '@/components/farm/FarmForm';

export default function NewFarmPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_type !== 'farmer') {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 via-emerald-50 to-green-50">
        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-600"></div>
          <p className="mt-4 text-emerald-700 font-medium">Loading your farm dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'farmer') {
    return null; // Don't render anything until redirect happens
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-emerald-50 to-green-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-emerald-100">
          {/* Header Bar */}
          <div className="px-6 py-5 border-b border-emerald-100 flex items-center bg-gradient-to-r from-emerald-50 to-green-50">
            <Link 
              href="/dashboard/farmer/farms" 
              className="mr-4 text-emerald-600 hover:text-emerald-800 transition-colors duration-200 flex items-center group"
            >
              <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 hidden sm:inline text-sm font-medium">Back to Farms</span>
            </Link>
            <div className="flex-1 flex items-center">
              <div className="bg-emerald-100 p-2 rounded-full mr-3">
                <svg className="h-7 w-7 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Add New Farm</h1>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Info Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg mb-6 border border-emerald-100 shadow-sm">
              <div className="flex items-start">
                <div className="bg-white p-1.5 rounded-full shadow-sm mr-3">
                  <svg className="h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-emerald-800 mb-1">Farm Registration</h3>
                  <p className="text-sm text-emerald-700">
                    Please fill in the details below to register your new farm. All fields marked with an asterisk (*) are required.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <FarmForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}