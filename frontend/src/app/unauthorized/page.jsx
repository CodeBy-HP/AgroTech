// pages/unauthorized.tsx
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { LockIcon } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <>
      <Head>
        <title>Unauthorized Access</title>
        <meta name="description" content="Unauthorized access page" />
      </Head>
      
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 mx-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-50">
              <LockIcon className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="mb-3 text-2xl font-semibold text-gray-900">Unauthorized Access</h1>
            
            <p className="mb-8 text-center text-gray-600">
              You don't have permission to access this page. Please sign in with the appropriate credentials to continue.
            </p>
            
            <div className="w-full">
              <Link 
                href="/login" 
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </Link>
              
              <Link 
                href="/" 
                className="flex justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;