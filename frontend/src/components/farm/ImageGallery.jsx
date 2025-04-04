'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageGallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(images.length > 0 ? 0 : null);
  const [imageUrls, setImageUrls] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Prepare image URLs, ensuring they include the full URL if needed
  useEffect(() => {
    if (images && images.length > 0) {
      // Map the image URLs to ensure they have the full API URL if they're relative paths
      const preparedUrls = images.map(img => {
        const imgUrl = img.image_url;
        // If the URL starts with / or media/, prepend the API URL
        if (imgUrl.startsWith('/') || imgUrl.startsWith('media/')) {
          return `${API_URL}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
        }
        return imgUrl;
      });
      
      setImageUrls(preparedUrls);
    }
  }, [images, API_URL]);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
          <p className="mt-1 text-sm text-gray-500">No images have been uploaded for this farm yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Main Image */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
        {imageUrls[selectedImage] ? (
          <div className="relative aspect-w-16 aspect-h-9 w-full h-64">
            <Image
              src={imageUrls[selectedImage]}
              alt="Farm"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading image...</p>
          </div>
        )}
      </div>

      {/* Thumbnails - show only if there are multiple images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto py-2">
          {imageUrls.map((url, index) => (
            <div
              key={`thumb-${index}`}
              className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
                selectedImage === index ? 'border-green-500' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative w-20 h-20">
                <Image
                  src={url}
                  alt={`Farm thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 