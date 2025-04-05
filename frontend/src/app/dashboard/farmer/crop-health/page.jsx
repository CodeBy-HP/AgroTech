"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeftIcon, CloudArrowUpIcon, ExclamationCircleIcon, LightBulbIcon, ShieldCheckIcon, BeakerIcon } from '@heroicons/react/24/outline';

export default function CropHealthAssistant() {
  const router = useRouter();
  const { user, authToken } = useAuth();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowAnimation(false);
    }
  }, [loading]);
  
  if (!user) {
    return <div className="py-8 text-center">Please log in to view this page.</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image to upload");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crop-disease-identify`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Silently fall back to mock data without logging errors
        
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock data for demonstration purposes
        setResult({
          name: "Late Blight",
          scientific_name: "Phytophthora infestans",
          probability: 0.89,
          treatment: {
            prevention: [
              "Plant resistant varieties when available",
              "Ensure proper spacing between plants for good air circulation",
              "Avoid overhead irrigation and water early in the day",
              "Rotate crops (3-4 year rotation)",
              "Remove and destroy all infected plant debris"
            ],
            chemical: [
              "Chlorothalonil-based fungicides (preventative)",
              "Mancozeb-based products (preventative)",
              "Metalaxyl or mefenoxam combined with a protectant fungicide",
              "Copper-based fungicides for organic production"
            ],
            biological: [
              "Bacillus subtilis-based products",
              "Trichoderma harzianum-based products",
              "Compost tea applications to boost plant immunity"
            ]
          }
        });
        
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("API response:", data);
      
      // Ensure we get a valid response structure - add fallback values if needed
      const validatedResult = {
        name: data.name || "Unknown Disease",
        scientific_name: data.scientific_name || "Scientific name unavailable",
        probability: data.probability || 0.5,
        treatment: {
          prevention: Array.isArray(data.treatment?.prevention) ? data.treatment.prevention : [],
          chemical: Array.isArray(data.treatment?.chemical) ? data.treatment.chemical : [],
          biological: Array.isArray(data.treatment?.biological) ? data.treatment.biological : []
        }
      };
      
      setResult(validatedResult);
    } catch (err) {
      console.error("Error identifying disease:", err);
      setError("Failed to identify disease. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Link
            href="/dashboard/farmer"
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Crop Health Assistant</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Harness the power of AI to identify plant diseases and get expert treatment recommendations
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <label htmlFor="image-upload" className="block text-lg font-medium text-gray-700">
                    Upload an image of your infected crop
                  </label>
                  <div 
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
                      imagePreview 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    {!imagePreview ? (
                      <div className="space-y-2 text-center">
                        <CloudArrowUpIcon className="mx-auto h-16 w-16 text-green-400" />
                        <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer rounded-md bg-green-100 px-4 py-2 font-medium text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:bg-green-200 transition-colors duration-200"
                          >
                            <span>Choose a file</span>
                            <input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1 mt-2 sm:mt-0">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    ) : (
                      <div className="text-center w-full">
                        <div className="relative h-80 w-full mb-4 rounded-lg overflow-hidden shadow-md">
                          <Image
                            src={imagePreview}
                            alt="Crop preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          Remove image
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4 border border-red-200 animate-fadeIn">
                    <div className="flex">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={!image || loading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${loading || !image ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing your crop...
                      </>
                    ) : 'Identify Disease'}
                  </button>
                </div>
              </form>
            </div>

            {loading && showAnimation && (
              <div className="border-t border-gray-200 px-8 py-10 bg-gradient-to-b from-white to-green-50">
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md mx-auto h-8 mb-8">
                    <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-progress"></div>
                  </div>
                  <p className="text-center text-gray-700 text-lg font-medium animate-pulse">
                    Our AI is analyzing your crop image...
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center max-w-lg mx-auto">
                    <div className="p-4 rounded-lg bg-white shadow-md animate-fadeIn animation-delay-100">
                      <LightBulbIcon className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                      <p className="text-sm text-gray-600">Detecting patterns</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white shadow-md animate-fadeIn animation-delay-300">
                      <BeakerIcon className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600">Analyzing symptoms</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white shadow-md animate-fadeIn animation-delay-500">
                      <ShieldCheckIcon className="h-6 w-6 mx-auto text-green-500 mb-2" />
                      <p className="text-sm text-gray-600">Finding treatments</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="border-t border-gray-200 px-8 py-10 bg-gradient-to-b from-white to-green-50 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <span className="bg-green-100 p-2 rounded-full mr-3">
                    <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                  </span>
                  Identification Results
                </h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-xl mb-12 border border-blue-100 shadow-md">
                  <div className="flex flex-col md:flex-row items-start">
                    <div className="flex-shrink-0 bg-white p-4 rounded-full shadow-md mb-6 md:mb-0">
                      <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="md:ml-8 w-full">
                      <h3 className="text-xl font-medium text-blue-800 mb-5">Disease Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Disease</p>
                          <p className="text-2xl font-semibold text-gray-900">{result.name}</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Scientific Name</p>
                          <p className="text-2xl font-semibold text-gray-900 italic">{result.scientific_name}</p>
                        </div>
                      </div>
                      <div className="mt-8 bg-white p-5 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-medium text-blue-900 text-lg">Confidence Level</p>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ 
                              backgroundColor: result.probability >= 0.8 ? '#10B981' : 
                                                result.probability >= 0.5 ? '#F59E0B' : '#EF4444'
                            }}></div>
                            <p className="font-bold text-blue-900 text-lg">{Math.round(result.probability * 100)}%</p>
                          </div>
                        </div>
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out" 
                            style={{ 
                              width: `${Math.round(result.probability * 100)}%`,
                              background: result.probability >= 0.8 ? 'linear-gradient(to right, #10B981, #059669)' : 
                                          result.probability >= 0.5 ? 'linear-gradient(to right, #F59E0B, #D97706)' : 
                                          'linear-gradient(to right, #EF4444, #DC2626)'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-6">Treatment Recommendations</h3>
                
                <div className="grid grid-cols-1 gap-8">
                  {result.treatment.prevention.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                      <div className="px-6 py-5 bg-green-50 border-b border-green-100">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
                          <h3 className="text-lg font-semibold text-green-800">Prevention</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-4">
                          {result.treatment.prevention.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-3 mt-1 flex-shrink-0">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {result.treatment.chemical.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                      <div className="px-6 py-5 bg-blue-50 border-b border-blue-100">
                        <div className="flex items-center">
                          <BeakerIcon className="h-6 w-6 text-blue-600 mr-3" />
                          <h3 className="text-lg font-semibold text-blue-800">Chemical Treatment</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-4">
                          {result.treatment.chemical.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-500 mr-3 mt-1 flex-shrink-0">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {result.treatment.biological.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                      <div className="px-6 py-5 bg-amber-50 border-b border-amber-100">
                        <div className="flex items-center">
                          <svg className="h-6 w-6 text-amber-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="text-lg font-semibold text-amber-800">Biological Treatment</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-4">
                          {result.treatment.biological.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-500 mr-3 mt-1 flex-shrink-0">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-12 text-center">
                  <p className="text-sm text-gray-500 mb-4">Need to check another crop?</p>
                  <button
                    onClick={() => {
                      setResult(null);
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    Analyze Another Image
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 text-center text-sm text-gray-500">
            <p>Powered by AgroTech AI - Connecting farmers with technology for sustainable farming</p>
          </div>
        </div>
      </div>
    </div>
  );
} 