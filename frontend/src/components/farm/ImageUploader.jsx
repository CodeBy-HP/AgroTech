'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function ImageUploader({ images, setImages, maxImages = 5 }) {
  const [previewImages, setPreviewImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const newFiles = Array.from(files).filter(file => 
      validImageTypes.includes(file.type) && 
      !images.some(img => img.name === file.name)
    );
    
    if (images.length + newFiles.length > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }
    
    // Create preview URLs
    const newPreviewImages = newFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    
    // Update image list for form submission
    setImages(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index) => {
    // Revoke object URL to avoid memory leaks
    if (previewImages[index]) {
      URL.revokeObjectURL(previewImages[index]);
    }
    
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive 
            ? 'border-green-400 bg-green-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } transition-colors duration-200 cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          <p className="mt-1 text-sm text-gray-600">
            {images.length === 0 
              ? `Drag and drop images here, or click to select files` 
              : `${images.length} ${images.length === 1 ? 'image' : 'images'} selected (max ${maxImages})`
            }
          </p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
      </div>

      {/* Preview Images */}
      {previewImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previewImages.map((src, index) => (
            <div key={index} className="relative group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image 
                  src={src} 
                  alt={`Preview ${index + 1}`} 
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 