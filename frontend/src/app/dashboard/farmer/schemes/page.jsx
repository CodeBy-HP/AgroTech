"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeftIcon, GlobeAsiaAustraliaIcon, BuildingLibraryIcon, DocumentTextIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function GovernmentSchemes() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!user || !token) {
      return;
    }
    
    fetchSchemes();
  }, [user, token]);
  
  const fetchSchemes = async () => {
    try {
      console.log("Fetching schemes with token:", token ? "Token exists" : "No token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schemes/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to fetch schemes: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setSchemes(data);
    } catch (err) {
      console.error('Error fetching schemes:', err);
      setError('Failed to load government schemes. Please try again later.');
      
      // Use mock data if API fails
      setSchemes([
        {
          id: 1,
          scheme_name: "Namo Drone Didi",
          detailed_description: "Provides drones to 15,000 Women Self Help Groups (SHGs) to assist with precision agriculture, crop health monitoring, and timely interventions. The scheme offers central assistance covering 80% of the drone cost (up to ₹8 lakh) and is designed to empower women while enhancing productivity, with the potential for SHGs to earn up to ₹1 lakh per year.",
          type: "Central",
          url: "https://pmkisan.gov.in/drone-scheme"
        },
        {
          id: 2,
          scheme_name: "National Food Security Mission (NFSM)",
          detailed_description: "Aims to boost production of rice, wheat, pulses, and millets by expanding the cultivated area and improving productivity through modern agricultural practices, quality inputs, and efficient resource management. It also supports seed hubs and Farmer Producer Organizations (FPOs) to create sustainable food systems.",
          type: "Central",
          url: "https://nfsmonline.nic.in/"
        },
        {
          id: 3,
          scheme_name: "Mission for Integrated Development of Horticulture (MIDH)",
          detailed_description: "Focuses on the comprehensive growth of the horticulture sector by supporting production, post-harvest management, and market access for fruits, vegetables, spices, and flowers. Since 2014-15, MIDH has covered about 12.95 lakh hectares, offering technical guidance, financial assistance, and capacity building to enhance quality and productivity.",
          type: "Central",
          url: "https://midh.gov.in/"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredSchemes = schemes.filter(scheme => {
    // Filter by type
    if (filter !== 'All' && scheme.type !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !scheme.scheme_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  if (!user) {
    return <div className="py-8 text-center">Please log in to view this page.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Link
            href="/dashboard/farmer"
            className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <BuildingLibraryIcon className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Government Schemes</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover and access government initiatives designed to support farmers across India
            </p>
          </div>

          <div className="mb-10 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search schemes..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="mr-2 text-gray-700">Filter:</label>
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Schemes</option>
                <option value="Central">Central</option>
                <option value="State">State</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <GlobeAsiaAustraliaIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No schemes found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSchemes.map((scheme) => (
                <div 
                  key={scheme.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="px-6 py-5 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-amber-100 p-2 rounded-full">
                          <DocumentTextIcon className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="ml-3 text-xl font-semibold text-gray-900">{scheme.scheme_name}</h3>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {scheme.type}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-gray-700 leading-relaxed">
                      {scheme.detailed_description}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <a 
                        href={scheme.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors duration-200"
                      >
                        Learn more
                        <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          <p>All government scheme information is updated regularly. Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
} 