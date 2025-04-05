'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('farmers');
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  
  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animation on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Hero section with clean design */}
      <div className="relative bg-gradient-to-r from-green-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Hackathon badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-green-100 to-amber-100 px-6 py-2 border border-green-200">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600 font-bold">
                Made with ❤️ in Bhopal
              </span>
            </div>
          </div>

          {/* Main heading */}
          <div className="text-center mb-12">
            <h1 className="text-center text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-amber-600">
                AgroTech
              </span>
              <span className="block text-3xl md:text-5xl mt-4 text-gray-800">
                Revolutionizing <span className="text-amber-600">Indian Agriculture</span>
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Empowering 140 million farmers with cutting-edge AI, direct market access, and essential government support in one revolutionary platform.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {!user ? (
                <>
                  <Link
                    href="/register/farmer"
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-1"
                  >
                    Register as Farmer
                  </Link>
                  <Link
                    href="/register/company"
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-1"
                  >
                    Register as Company
                  </Link>
                </>
              ) : (
                <Link
                  href={user.user_type === 'farmer' ? '/dashboard/farmer' : '/dashboard/company'}
                  className="rounded-xl bg-gradient-to-r from-green-600 to-amber-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-1"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </div>

      {/* Interactive App Showcase with 3D-like effect */}
      <div className="relative z-10 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-green-600 mb-4">
              Visualize Our Revolutionary Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the seamless integration of AI, market connectivity, and agricultural insights
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-amber-500 mx-auto rounded-full mt-4"></div>
          </motion.div>

          {/* 3D-like App Mockup Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="perspective-1000"
          >
            <div className="relative mx-auto max-w-5xl transform-3d rotateX-10">
              {/* Shadow */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-amber-600 rounded-3xl blur-2xl opacity-10 transform translate-y-8"></div>
              
              {/* Glass-like monitor frame */}
              <div className="relative bg-white backdrop-blur-sm border border-gray-200 rounded-3xl overflow-hidden shadow-xl">
                {/* App header bar with tabs */}
                <div className="bg-gray-100 border-b border-gray-200 px-6 py-4 flex items-center">
                  <div className="flex space-x-2 mr-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {['Dashboard', 'Crop Health', 'Gov Schemes'].map((tab, index) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(['farmers', 'health', 'schemes'][index])}
                        className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                          activeTab === ['farmers', 'health', 'schemes'][index]
                            ? 'bg-white text-gray-900'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  <div className="ml-auto flex">
                    <div className="bg-white rounded-full h-8 w-48 flex items-center px-4 border border-gray-200">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-gray-400 text-sm">Search...</span>
                    </div>
                  </div>
                </div>
                
                {/* App content area */}
                <div className="h-96 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                  {/* Content tabs */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'farmers' && (
                      <motion.div
                        key="farmers"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col p-8"
                      >
                        <div className="flex mb-6">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Farmer Dashboard</h3>
                            <p className="text-gray-500 text-sm">Welcome back, Rajesh Kumar</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                            RK
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6 mb-6">
                          {['Active Listings', 'Market Analytics', 'Weather'].map((card, i) => (
                            <div 
                              key={card} 
                              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                            >
                              <div className="text-sm text-gray-500 mb-2">{card}</div>
                              <div className="text-xl font-bold text-gray-900">{
                                i === 0 ? '8 Active' : i === 1 ? '+12.5%' : '32°C'
                              }</div>
                              <div className={`text-sm ${i === 0 ? 'text-amber-600' : i === 1 ? 'text-green-600' : 'text-blue-600'}`}>
                                {i === 0 ? '2 New Bids' : i === 1 ? 'Prices Rising' : 'Sunny'}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900">Recent Activity</h3>
                            <button className="text-sm text-amber-600">View All</button>
                          </div>
                          {['Wheat bid accepted from AgriCorp', 'New message from SeedTech Ltd', 'Price alert: Rice prices rising'].map((item, i) => (
                            <div key={i} className="flex items-center py-2 border-b border-gray-100">
                              <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-amber-500'} mr-2`}></div>
                              <span className="text-gray-700 text-sm">{item}</span>
                              <span className="ml-auto text-xs text-gray-500">Today</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {activeTab === 'health' && (
                      <motion.div
                        key="health"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col p-8"
                      >
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">AI Crop Health Assistant</h3>
                          <p className="text-gray-500 text-sm">Upload an image to identify diseases</p>
                        </div>
                        
                        <div className="flex-1 flex gap-6">
                          <div className="w-1/2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center p-6">
                            <div className="w-full h-48 mb-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-gray-500 text-sm mb-2">Drag and drop an image here</p>
                              <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 transition text-white rounded-lg text-sm">Upload Image</button>
                            </div>
                            <div className="grid grid-cols-3 gap-2 w-full">
                              {[...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-md"></div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="w-1/2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Disease Detection Results</h3>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                              <div className="flex items-center mb-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-green-600 font-medium">Rice Blast Detected</span>
                                <span className="ml-auto text-gray-500 text-sm">95% Confidence</span>
                              </div>
                              <p className="text-gray-700 text-sm mb-3">A fungal disease affecting rice plants, caused by Magnaporthe oryzae.</p>
                              <h4 className="font-medium text-gray-900 text-sm mb-2">Recommended Treatment:</h4>
                              <ul className="text-gray-700 text-sm space-y-1">
                                <li>• Apply fungicide containing tricyclazole</li>
                                <li>• Improve field drainage</li>
                                <li>• Adjust nitrogen application timing</li>
                              </ul>
                            </div>
                            
                            <button className="w-full py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-lg text-sm">Get Detailed Analysis</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {activeTab === 'schemes' && (
                      <motion.div
                        key="schemes"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col p-8"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Government Schemes</h3>
                            <p className="text-gray-500 text-sm">Discover agricultural support programs</p>
                          </div>
                          <div className="flex gap-2">
                            <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                              <option>All Schemes</option>
                              <option>Central Schemes</option>
                              <option>State Schemes</option>
                            </select>
                            <button className="bg-amber-500 hover:bg-amber-600 transition text-white rounded-lg px-3 py-2 text-sm">Filter</button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 70px)" }}>
                          {[
                            { name: "PM Kisan Samman Nidhi", type: "Central", desc: "Direct income support of ₹6,000 per year to farmer families" },
                            { name: "Pradhan Mantri Fasal Bima Yojana", type: "Central", desc: "Crop insurance scheme with minimal premiums" },
                            { name: "Kisan Credit Card", type: "Central", desc: "Provides farmers with affordable credit" },
                            { name: "e-NAM", type: "Central", desc: "Online trading platform for agricultural commodities" }
                          ].map((scheme, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-amber-500 transition">
                              <div className="flex items-center mb-2">
                                <span className="text-amber-600 font-medium">{scheme.name}</span>
                                <span className="ml-auto text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">{scheme.type}</span>
                              </div>
                              <p className="text-gray-700 text-sm mb-3">{scheme.desc}</p>
                              <div className="flex justify-between">
                                <button className="text-sm text-amber-600 hover:text-amber-700 transition">Learn more</button>
                                <button className="text-sm text-green-600 hover:text-green-700 transition">Apply now</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Problem Statement Section with Interactive Visualization */}
      <div className="relative z-10 py-24 bg-gray-50 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section heading with animation */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              <span className="text-amber-600">Major Challenges</span> Facing Indian Agriculture
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-amber-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Interactive Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {problems.map((problem, idx) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-100 rounded-2xl opacity-20 blur-sm"></div>
                <div className="relative bg-white border border-gray-200 rounded-2xl p-6 h-full shadow-md">
                  {/* Problem icon with subtle effect */}
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 bg-amber-100 rounded-xl opacity-50"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                      <problem.icon className="h-10 w-10 text-amber-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h3>
                  <p className="text-gray-600">{problem.description}</p>
                  
                  {/* Problem impact stat */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="text-4xl font-bold text-amber-600 mb-1">
                      {idx === 0 ? '72%' : idx === 1 ? '40%' : idx === 2 ? '65%' : idx === 3 ? '3x' : idx === 4 ? '55%' : '78%'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {idx === 0 ? 'of small farmers affected' : 
                       idx === 1 ? 'yield loss from poor knowledge' : 
                       idx === 2 ? 'unaware of eligible schemes' : 
                       idx === 3 ? 'higher prices with direct access' : 
                       idx === 4 ? 'unprepared for weather changes' : 
                       'lack digital literacy tools'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Revolutionary Solution Section with Rotating Features */}
      <div className="relative z-10 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Our <span className="text-green-600">Revolutionary</span> Solution
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              AgroTech integrates cutting-edge technology with deep agricultural expertise to create a comprehensive platform that addresses the core challenges.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-amber-500 mx-auto rounded-full mt-8"></div>
          </motion.div>

          {/* Featured solution with rotating highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Rotating feature highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative h-96">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 overflow-hidden relative shadow-md">
                      {/* Subtle accent */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-green-100 opacity-50 blur-3xl"></div>
                      
                      {/* Feature content */}
                      <div className="relative h-full flex flex-col">
                        <div className="mb-6">
                          <div className="inline-block p-2 rounded-lg bg-green-100 mb-2">
                            {(() => {
                              const FeatureIcon = features[currentFeature].icon;
                              return <FeatureIcon className="h-8 w-8 text-green-600" />;
                            })()}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{features[currentFeature].name}</h3>
                          <div className="h-1 w-12 bg-green-500 rounded-full"></div>
                        </div>
                        
                        <p className="text-gray-600 mb-6 flex-grow">{features[currentFeature].description}</p>
                        
                        {/* Feature visualization based on type */}
                        <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center p-4 border border-gray-200">
                          {currentFeature === 0 && (
                            <div className="grid grid-cols-3 gap-2 w-full">
                              <div className="col-span-1 flex flex-col items-center bg-white p-2 rounded-lg shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-green-100 mb-2 flex items-center justify-center text-sm text-green-700 font-medium">F</div>
                                <div className="text-center text-xs text-gray-500">Farmer</div>
                              </div>
                              <div className="col-span-1 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-gradient-to-r from-green-500 to-amber-500 relative">
                                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-md animate-ping"></div>
                                </div>
                              </div>
                              <div className="col-span-1 flex flex-col items-center bg-white p-2 rounded-lg shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-amber-100 mb-2 flex items-center justify-center text-sm text-amber-700 font-medium">C</div>
                                <div className="text-center text-xs text-gray-500">Company</div>
                              </div>
                            </div>
                          )}
                          
                          {currentFeature === 1 && (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-20 h-20">
                                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-400 animate-spin-slow"></div>
                                  <div className="absolute inset-0 rounded-full border-2 border-green-500 opacity-50"></div>
                                </div>
                              </div>
                              <div className="relative z-10 text-center">
                                <div className="text-green-600 font-bold mb-1">AI Detection</div>
                                <div className="text-xs text-gray-500">95% Accuracy</div>
                              </div>
                            </div>
                          )}
                          
                          {currentFeature === 2 && (
                            <div className="grid grid-cols-2 gap-2 w-full">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center p-2 bg-white rounded-lg shadow-sm">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                                  <div className="text-xs text-gray-700 truncate">
                                    {i === 0 ? 'PM Kisan Yojana' : i === 1 ? 'Crop Insurance' : i === 2 ? 'Soil Health Card' : 'E-NAM Portal'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {currentFeature === 3 && (
                            <div className="w-full h-full flex flex-col">
                              <div className="text-center mb-2">
                                <div className="text-green-600 font-medium text-sm">Market Price Trends</div>
                              </div>
                              <div className="flex-1 flex items-end justify-between px-2 relative">
                                {/* Chart background grid */}
                                <div className="absolute inset-0 grid grid-cols-7 grid-rows-4">
                                  {[...Array(28)].map((_, i) => (
                                    <div key={i} className="border-t border-l border-gray-200"></div>
                                  ))}
                                </div>
                                
                                {/* Price bars */}
                                <div className="h-50% w-5 bg-gradient-to-t from-green-500 to-green-300 rounded-t z-10 relative group">
                                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-xs text-green-600 font-medium px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    ₹1950
                                  </div>
                                </div>
                                <div className="h-60% w-5 bg-gradient-to-t from-green-500 to-green-300 rounded-t z-10 relative group">
                                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-xs text-green-600 font-medium px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    ₹2100
                                  </div>
                                </div>
                                <div className="h-45% w-5 bg-gradient-to-t from-green-500 to-green-300 rounded-t z-10 relative group">
                                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-xs text-green-600 font-medium px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    ₹1850
                                  </div>
                                </div>
                                <div className="h-70% w-5 bg-gradient-to-t from-green-500 to-green-300 rounded-t z-10 relative group">
                                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-xs text-green-600 font-medium px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    ₹2250
                                  </div>
                                </div>
                                <div className="h-80% w-5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t z-10 relative group">
                                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-xs text-amber-600 font-medium px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    ₹2500
                                  </div>
                                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-amber-600 font-medium">
                                    +12%
                                  </div>
                                </div>
                              </div>
                              <div className="mt-1 flex justify-between px-2">
                                <div className="text-xs text-gray-500">Mon</div>
                                <div className="text-xs text-gray-500">Wed</div>
                                <div className="text-xs text-gray-500">Fri</div>
                                <div className="text-xs text-gray-500">Sun</div>
                                <div className="text-xs text-gray-500">Today</div>
                              </div>
                              <div className="mt-2 text-center">
                                <div className="text-xs text-gray-500">Wheat price per quintal</div>
                              </div>
                            </div>
                          )}
                          
                          {currentFeature === 4 && (
                            <div className="w-full h-full flex flex-col">
                              <div className="flex justify-between items-center mb-3">
                                <div className="text-green-600 font-medium text-sm">5-Day Forecast</div>
                                <div className="text-xs text-gray-500">Hyderabad Region</div>
                              </div>
                              
                              <div className="flex-1 grid grid-cols-5 gap-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                                  <div key={day} className="bg-white rounded-lg shadow-sm p-2 flex flex-col items-center">
                                    <div className="text-xs font-medium text-gray-700 mb-1">{day}</div>
                                    <div className="flex-1 flex items-center justify-center">
                                      {i === 0 && (
                                        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                        </svg>
                                      )}
                                      {i === 1 && (
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                        </svg>
                                      )}
                                      {i === 2 && (
                                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 5v.2M16 8.5v.2M16 12v.2M12 5v.2M12 8.5v.2M12 12v.2M8 5v.2M8 8.5v.2M8 12v.2" />
                                        </svg>
                                      )}
                                      {i === 3 && (
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 14v.2M12 14v.2M8 14v.2" />
                                        </svg>
                                      )}
                                      {i === 4 && (
                                        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                        </svg>
                                      )}
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                      {i === 0 ? '32°C' : i === 1 ? '29°C' : i === 2 ? '25°C' : i === 3 ? '27°C' : '30°C'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {i === 0 ? 'Sunny' : i === 1 ? 'Cloudy' : i === 2 ? 'Rain' : i === 3 ? 'Drizzle' : 'Clear'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-3 text-center">
                                <div className="inline-flex items-center px-2 py-1 bg-blue-50 rounded text-xs text-blue-600">
                                  <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Rain alert: Prepare fields by Wednesday
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {currentFeature !== 0 && currentFeature !== 1 && currentFeature !== 2 && currentFeature !== 3 && currentFeature !== 4 && (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                              Feature visualization
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Feature navigation dots */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {features.slice(0, 6).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentFeature(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentFeature === idx 
                          ? 'bg-green-500 w-6' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Platform Features</h3>
              
              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <motion.div
                    key={feature.name}
                    whileHover={{ x: 5 }}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      currentFeature === idx 
                        ? 'bg-gradient-to-r from-green-50 to-transparent border-l-4 border-green-500' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentFeature(idx)}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${currentFeature === idx ? 'bg-green-100' : 'bg-gray-100'} mr-4`}>
                        <feature.icon className={`h-6 w-6 ${currentFeature === idx ? 'text-green-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className={`font-bold mb-1 ${currentFeature === idx ? 'text-green-600' : 'text-gray-900'}`}>
                          {feature.name}
                        </h4>
                        <p className="text-sm text-gray-600">{feature.description.split('.')[0]}.</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Impact Statistics Section with Animated Counters */}
      <div className="relative z-10 py-24 bg-gray-50">
        {/* Background elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-100 rounded-full opacity-40 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section header */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Transforming Indian Agriculture At Scale
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-amber-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Animated Stats */}
          <div 
            ref={statsRef} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { label: "Indian Farmers", value: "140M+" },
              { label: "Income Increase", value: "30%" },
              { label: "Gov Schemes", value: "18" },
              { label: "Disease Detection Accuracy", value: "95%" }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-amber-200 rounded-full opacity-50 blur-xl"></div>
                  <div className="relative w-24 h-24 rounded-full flex items-center justify-center border border-gray-200 bg-white shadow-sm">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600">
                      {stat.value}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-lg">{stat.label}</div>
                <div className="mt-2 h-0.5 w-1/4 bg-gradient-to-r from-green-500 to-transparent mx-auto"></div>
              </motion.div>
            ))}
          </div>
          
          {/* Real-time users ticker */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 relative">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <p className="text-gray-700">
                <span className="font-medium">2,348</span> farmers online right now
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-green-50 to-amber-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Join the Agricultural Revolution
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Be part of the digital transformation in agriculture. Connect, grow, and prosper with AgroTech.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              {!user ? (
                <>
                  <Link
                    href="/register/farmer"
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition hover:-translate-y-1"
                  >
                    Get Started Today
                  </Link>
                  <Link
                    href="/about"
                    className="w-full sm:w-auto text-base font-semibold text-gray-700 hover:text-green-600 transition flex items-center justify-center"
                  >
                    Learn more <span className="ml-1" aria-hidden="true">→</span>
                  </Link>
                </>
              ) : (
                <Link
                  href={user.user_type === 'farmer' ? '/dashboard/farmer' : '/dashboard/company'}
                  className="rounded-xl bg-gradient-to-r from-green-600 to-amber-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition hover:-translate-y-1"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes rotating-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: rotating-slow 10s linear infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-3d {
          transform-style: preserve-3d;
        }
        
        .rotateX-10 {
          transform: rotateX(10deg);
        }
      `}</style>
    </div>
  );
}

// Problems we're solving
const problems = [
  {
    title: "Limited Market Access",
    description: "Small farmers struggle to reach larger markets, often forced to sell at lower prices to intermediaries.",
    icon: function ProblemIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
        </svg>
      );
    }
  },
  {
    title: "Lack of Technical Know-how",
    description: "Limited access to knowledge about modern farming techniques and disease identification leads to crop losses.",
    icon: function ProblemIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      );
    }
  },
  {
    title: "Government Scheme Unawareness",
    description: "Many farmers miss out on beneficial government initiatives due to lack of information and complicated access.",
    icon: function ProblemIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      );
    }
  },
  {
    title: "Low Bargaining Power",
    description: "Without direct market access, farmers accept whatever price is offered, often well below market value.",
    icon: function ProblemIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      );
    }
  },
  {
    title: "Weather Unpredictability",
    description: "Increasing climate unpredictability leads to crop failures and financial distress for unprepared farmers.",
    icon: function ProblemIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      );
    }
  },
  {
    title: "Digital Divide",
    description: "Lack of technical literacy prevents adoption of digital solutions that could improve agricultural efficiency.",
    icon: function ProblemIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
        </svg>
      );
    }
  }
];

// Our main features
const features = [
  {
    name: "Direct Market Connection",
    description: "Connecting farmers directly with companies, eliminating middlemen and ensuring fair prices for agricultural produce.",
    icon: function FeatureIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
        </svg>
      );
    }
  },
  {
    name: "AI-Powered Crop Health Assistant",
    description: "Advanced machine learning algorithms to identify crop diseases from images, providing treatment advice and preventive measures.",
    icon: function FeatureIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      );
    }
  },
  {
    name: "Government Scheme Navigator",
    description: "Curated information about relevant government schemes, simplified access procedures, and guidance for application.",
    icon: function FeatureIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      );
    }
  },
  {
    name: "Track Market Price",
    description: "Real-time tracking of agricultural commodity prices across different markets to help farmers make informed selling decisions.",
    icon: function FeatureIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      );
    }
  },
  {
    name: "Weather Forecast",
    description: "Localized weather predictions and alerts to help farmers plan their agricultural activities and mitigate climate-related risks.",
    icon: function FeatureIcon(props) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      );
    }
  }
];

// Impact statistics
const stats = [
  { value: '140M+', label: 'Indian Farmers Who Can Benefit' },
  { value: '30%', label: 'Potential Income Increase for Small Farmers' },
  { value: '18', label: 'Government Schemes Made Accessible' },
  { value: '100+', label: 'Crop Diseases Detectable by Our AI' }
];