'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFarm } from '@/context/FarmContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/formatters';
import ImageUploader from './ImageUploader';
import dynamic from 'next/dynamic';

// Dynamically import MapPicker with SSR disabled (needed for Leaflet)
const MapPickerWithNoSSR = dynamic(
  () => import('./MapPicker'),
  { ssr: false, loading: () => (
    <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading map...</p>
      </div>
    </div>
  ) }
);

export default function FarmForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const { createFarm, updateFarm, uploadFarmImages, loading } = useFarm();
  const { user, logout } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState([]);
  const [showAuthHint, setShowAuthHint] = useState(false);
  
  // Basic redirection if not a farmer
  useEffect(() => {
    if (user && user.user_type !== 'farmer') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    farm_location: initialData?.farm_location || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    farm_area: initialData?.farm_area || '',
    crop_type: initialData?.crop_type || '',
    is_organic: initialData?.is_organic || false,
    pesticides_used: initialData?.pesticides_used || '',
    expected_harvest_date: initialData?.expected_harvest_date ? formatDate(initialData.expected_harvest_date, { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-') : '',
    expected_quantity: initialData?.expected_quantity || '',
    min_asking_price: initialData?.min_asking_price || '',
    farm_status: initialData?.farm_status || 'empty'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle map location selection - memoize to prevent re-renders
  const handleLocationSelect = useCallback((lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  }, []);

  const validateForm = () => {
    // Basic validation
    if (!formData.farm_location.trim()) {
      setError('Farm location is required');
      return false;
    }
    
    if (!formData.farm_area || formData.farm_area <= 0) {
      setError('Farm area must be greater than 0');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      // Convert numeric strings to numbers
      const farmData = {
        ...formData,
        farm_area: parseFloat(formData.farm_area),
        expected_quantity: formData.expected_quantity ? parseFloat(formData.expected_quantity) : null,
        min_asking_price: formData.min_asking_price ? parseFloat(formData.min_asking_price) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };
      
      // Remove empty strings
      Object.keys(farmData).forEach(key => {
        if (farmData[key] === '') {
          farmData[key] = null;
        }
      });
      
      let result;
      if (isEdit) {
        result = await updateFarm(initialData.id, farmData);
        setSuccess('Farm updated successfully!');
      } else {
        try {
          result = await createFarm(farmData);
        } catch (err) {
          console.error("Error during farm creation:", err);
          if (err.message.includes('Authentication') || err.response?.status === 401) {
            setShowAuthHint(true);
          }
          throw err;
        }
        
        // Upload images if there are any
        if (images.length > 0 && result) {
          try {
            await uploadFarmImages(result.id, images);
          } catch (imageErr) {
            console.error("Error uploading images:", imageErr);
            setSuccess('Farm created successfully, but there was an error uploading images.');
            
            // Redirect after a short delay
            setTimeout(() => {
              router.push(`/dashboard/farmer/farms/${result.id}`);
            }, 1500);
            
            return;
          }
        }
        
        setSuccess('Farm created successfully!');
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/dashboard/farmer/farms/${result.id}`);
      }, 1500);
      
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || 'An error occurred while saving the farm');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-white p-8 rounded-xl shadow-lg border border-green-100">
      <h2 className="text-2xl font-semibold text-green-800 mb-6">
        {isEdit ? 'Update Farm Details' : 'Register New Farm'}
      </h2>
      
      {error && (
        <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-lg border-l-4 border-red-500 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {showAuthHint && (
        <div className="mb-6 p-4 text-amber-700 bg-amber-50 rounded-lg border-l-4 border-amber-500">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">Authentication issue detected</p>
          </div>
          <p className="mb-3">Your login session may have expired. Please try logging out and logging back in.</p>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors"
          >
            Log out and try again
          </button>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 text-green-700 bg-green-50 rounded-lg border-l-4 border-green-500 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-green-700 mb-4 pb-2 border-b border-green-100">Farm Location Details</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="farm_location" className="block text-sm font-medium text-gray-700 mb-1">
                Farm Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="farm_location"
                name="farm_location"
                value={formData.farm_location}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 px-4 py-3 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                placeholder="e.g. Pune, Maharashtra"
                required
              />
            </div>
            
            <div>
              <label htmlFor="farm_area" className="block text-sm font-medium text-gray-700 mb-1">
                Farm Area (hectares) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="farm_area"
                name="farm_area"
                min="0.1"
                step="0.1"
                value={formData.farm_area}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 px-4 py-3 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                placeholder="e.g. 5.5"
                required
              />
            </div>
            
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Farm Location on Map
                <span className="ml-1 text-sm text-gray-500">(Click on the map to set your farm's exact location)</span>
              </label>
              
              {/* Replace manual lat/long inputs with the MapPicker component */}
              <MapPickerWithNoSSR
                onLocationSelect={handleLocationSelect}
                initialLat={formData.latitude}
                initialLng={formData.longitude}
              />
              
              {/* Hidden inputs to store the values */}
              <input
                type="hidden"
                id="latitude"
                name="latitude"
                value={formData.latitude}
              />
              <input
                type="hidden"
                id="longitude"
                name="longitude"
                value={formData.longitude}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-green-700 mb-4 pb-2 border-b border-green-100">Crop Information</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="crop_type" className="block text-sm font-medium text-gray-700 mb-1">
                Crop Type
              </label>
              <input
                type="text"
                id="crop_type"
                name="crop_type"
                value={formData.crop_type}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 px-4 py-3 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                placeholder="e.g. Wheat, Rice"
              />
            </div>
            
            <div>
              <label htmlFor="farm_status" className="block text-sm font-medium text-gray-700 mb-1">
                Farm Status
              </label>
              <select
                id="farm_status"
                name="farm_status"
                value={formData.farm_status}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 px-4 py-3 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              >
                <option value="empty">Empty</option>
                <option value="growing">Growing</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="pesticides_used" className="block text-sm font-medium text-gray-700 mb-1">
                Pesticides/Fertilizers Used
              </label>
              <input
                type="text"
                id="pesticides_used"
                name="pesticides_used"
                value={formData.pesticides_used}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 px-4 py-3 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                placeholder="e.g. Organic compost, Neem oil"
              />
            </div>
            
            <div className="flex items-center h-full pt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_organic"
                  name="is_organic"
                  checked={formData.is_organic}
                  onChange={handleChange}
                  className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="is_organic" className="ml-2 block text-sm text-gray-700">
                  Organic Farming
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-green-700 mb-4 pb-2 border-b border-green-100">Harvest Details</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="expected_harvest_date" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Harvest Date
              </label>
              <input
                type="date"
                id="expected_harvest_date"
                name="expected_harvest_date"
                value={formData.expected_harvest_date}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 px-4 py-3 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <label htmlFor="expected_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Quantity (kg)
              </label>
              <input
                type="number"
                id="expected_quantity"
                name="expected_quantity"
                min="1"
                step="1"
                value={formData.expected_quantity}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 px-4 py-3 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                placeholder="e.g. 1000"
              />
            </div>
            
            <div>
              <label htmlFor="min_asking_price" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Asking Price (₹/kg)
              </label>
              <input
                type="number"
                id="min_asking_price"
                name="min_asking_price"
                min="0"
                step="0.01"
                value={formData.min_asking_price}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 px-4 py-3 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                placeholder="e.g. 25.50"
              />
            </div>
          </div>
        </div>

        {!isEdit && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-green-700 mb-4 pb-2 border-b border-green-100">Farm Images</h3>
            <p className="mb-4 text-sm text-gray-600">
              Upload images of your farm to help buyers better understand your produce. You can upload up to 5 images.
            </p>
            <ImageUploader 
              images={images} 
              setImages={setImages} 
              maxImages={5} 
            />
          </div>
        )}
        
        <div className="pt-5 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-3 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              isEdit ? 'Update Farm' : 'Create Farm'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}