'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import BidForm from '@/components/bid/BidForm';

export default function PlaceBidPage({ params }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const paramValue = use(params);
  const farmId = paramValue.id;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_type !== 'company') {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user || user.user_type !== 'company') {
    return null; // Don't render anything until redirect happens
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6 flex items-center">
        <Link 
          href={`/dashboard/company/farms/${farmId}`} 
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Place a Bid</h1>
      </div>

      <div className="mt-6">
        <BidForm farmId={farmId} />
      </div>
    </div>
  );
} 