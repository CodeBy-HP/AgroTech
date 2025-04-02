'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFarm } from '@/context/FarmContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/formatters';

export default function FarmForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const { createFarm, updateFarm, loading } = useFarm();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
        result = await createFarm(farmData);
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="farm_location" className="block text-sm font-medium text-gray-700">
              Farm Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="farm_location"
              name="farm_location"
              value={formData.farm_location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g. Pune, Maharashtra"
              required
            />
          </div>
          
          <div>
            <label htmlFor="farm_area" className="block text-sm font-medium text-gray-700">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g. 5.5"
              required
            />
          </div>
          
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              step="0.000001"
              value={formData.latitude}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g. 18.5204"
            />
          </div>
          
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              step="0.000001"
              value={formData.longitude}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g. 73.8567"
            />
          </div>
          
          <div>
            <label htmlFor="crop_type" className="block text-sm font-medium text-gray-700">
              Crop Type
            </label>
            <input
              type="text"
              id="crop_type"
              name="crop_type"
              value={formData.crop_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g. Wheat, Rice"
            />
          </div>
          
          <div>
            <label htmlFor="farm_status" className="block text-sm font-medium text-gray-700">
              Farm Status
            </label>
            <select
              id="farm_status"
              name="farm_status"
              value={formData.farm_status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="empty">Empty</option>
              <option value="growing">Growing</option>
              <option value="harvested">Harvested</option>
            </select>
          </div>
          
          <div>
            <div className="flex items-center h-full mt-6">
              <input
                id="is_organic"
                name="is_organic"
                type="checkbox"
                checked={formData.is_organic}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="is_organic" className="ml-2 block text-sm text-gray-900">
                Organic Farming
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="pesticides_used" className="block text-sm font-medium text-gray-700">
              Pesticides/Fertilizers Used
            </label>
            <input
              type="text"
              id="pesticides_used"
              name="pesticides_used"
              value={formData.pesticides_used}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g. Neem oil, vermicompost"
            />
          </div>
          
          <div>
            <label htmlFor="expected_harvest_date" className="block text-sm font-medium text-gray-700">
              Expected Harvest Date
            </label>
            <input
              type="date"
              id="expected_harvest_date"
              name="expected_harvest_date"
              value={formData.expected_harvest_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="expected_quantity" className="block text-sm font-medium text-gray-700">
              Expected Quantity (tons)
            </label>
            <input
              type="number"
              id="expected_quantity"
              name="expected_quantity"
              min="0"
              step="0.1"
              value={formData.expected_quantity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g. 10.5"
            />
          </div>
          
          <div>
            <label htmlFor="min_asking_price" className="block text-sm font-medium text-gray-700">
              Minimum Asking Price (₹)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                id="min_asking_price"
                name="min_asking_price"
                min="0"
                step="0.01"
                value={formData.min_asking_price}
                onChange={handleChange}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/dashboard/farmer/farms')}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Farm' : 'Create Farm'}
          </button>
        </div>
      </form>
    </div>
  );
} 