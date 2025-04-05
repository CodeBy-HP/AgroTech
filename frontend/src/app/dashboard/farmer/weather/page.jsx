'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

// API key for OpenWeather
const API_KEY = "760abec5657efe64d2dada9efb3f6fd1";

// Weather icons mapping
const weatherIcons = {
  '01d': '/weather-icons/clear-day.svg',
  '01n': '/weather-icons/clear-night.svg',
  '02d': '/weather-icons/partly-cloudy-day.svg',
  '02n': '/weather-icons/partly-cloudy-night.svg',
  '03d': '/weather-icons/cloudy.svg',
  '03n': '/weather-icons/cloudy.svg',
  '04d': '/weather-icons/cloudy.svg',
  '04n': '/weather-icons/cloudy.svg',
  '09d': '/weather-icons/rain.svg',
  '09n': '/weather-icons/rain.svg',
  '10d': '/weather-icons/rain.svg',
  '10n': '/weather-icons/rain.svg',
  '11d': '/weather-icons/thunderstorms.svg',
  '11n': '/weather-icons/thunderstorms.svg',
  '13d': '/weather-icons/snow.svg',
  '13n': '/weather-icons/snow.svg',
  '50d': '/weather-icons/fog.svg',
  '50n': '/weather-icons/fog.svg',
};

export default function WeatherForecast() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Location state
  const [location, setLocation] = useState({
    lat: 23.2599, // Bhopal latitude
    lon: 77.4126, // Bhopal longitude
    locationName: 'Bhopal',
    userLocation: false,
    searchQuery: ''
  });
  
  // Weather data state
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Common Indian cities for quick selection
  const popularCities = [
    { name: "Delhi", lat: 28.6139, lon: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
    { name: "Chennai", lat: 13.0827, lon: 80.2707 },
    { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
    { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
    { name: "Pune", lat: 18.5204, lon: 73.8567 },
    { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
    { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
    { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  ];

  // Authentication check
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_type !== 'farmer') {
        router.push('/unauthorized');
      }
    }
  }, [user, authLoading, router]);

  // Get user's location on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              locationName: '',
              userLocation: true,
              searchQuery: ''
            });
          },
          (error) => {
            // Handle specific geolocation errors
            let errorMessage = "Unknown error occurred";
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Location access was denied by the user";
                // Show a user-friendly notification for permission denied
                setError("Location access was denied. Showing weather for Bhopal instead.");
                console.log(`Geolocation: ${errorMessage}`); // Use console.log for expected user actions
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable";
                console.error(`Geolocation error: ${errorMessage}`, error);
                break;
              case error.TIMEOUT:
                errorMessage = "Location request timed out";
                console.error(`Geolocation error: ${errorMessage}`, error);
                break;
              default:
                console.error(`Geolocation error: ${errorMessage}`, error);
            }
            
            // Keep using the default location (Bhopal)
            // No need to reset location state as it's already set to Bhopal by default
            fetchWeatherData();
          },
          {
            timeout: 10000,        // 10 seconds timeout
            maximumAge: 60 * 60000, // Accept cached positions up to 1 hour old
            enableHighAccuracy: false // Don't need high accuracy for weather
          }
        );
      } catch (err) {
        console.error("Geolocation API error:", err);
        fetchWeatherData(); // Fallback to default location
      }
    } else {
      console.log("Geolocation is not supported by this browser");
      fetchWeatherData(); // Fallback to default location
    }
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    if (location.lat && location.lon) {
      fetchWeatherData();
    }
  }, [location.lat, location.lon]);

  // Function to search for a location
  const searchLocation = async (e) => {
    e.preventDefault();
    if (!location.searchQuery) return;
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location.searchQuery}&limit=1&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        setLocation({
          lat: data[0].lat,
          lon: data[0].lon,
          locationName: data[0].name + (data[0].state ? `, ${data[0].state}` : ''),
          userLocation: false,
          searchQuery: ''
        });
      } else {
        setError("Location not found. Please try another search.");
      }
    } catch (err) {
      console.error("Error searching location:", err);
      setError(`Failed to search location: ${err.message}`);
    }
  };

  // Function to select a popular city
  const selectCity = (city) => {
    setLocation({
      lat: city.lat,
      lon: city.lon,
      locationName: city.name,
      userLocation: false,
      searchQuery: ''
    });
  };

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!currentResponse.ok) {
        throw new Error(`Weather API Error: ${currentResponse.status}`);
      }
      
      const currentData = await currentResponse.json();
      setCurrentWeather(currentData);
      
      // Update location name if not set
      if (!location.locationName) {
        setLocation(prev => ({
          ...prev,
          locationName: currentData.name + (currentData.sys.country ? `, ${currentData.sys.country}` : '')
        }));
      }
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API Error: ${forecastResponse.status}`);
      }
      
      const forecastData = await forecastResponse.json();
      
      // Process forecast data to group by day
      const dailyForecasts = {};
      
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayKey = `${day}-${formattedDate}`;
        
        if (!dailyForecasts[dayKey]) {
          dailyForecasts[dayKey] = {
            day,
            date: formattedDate,
            temps: [],
            icons: [],
            descriptions: [],
            humidities: [],
            windSpeeds: [],
            hourlyData: []
          };
        }
        
        // Add hourly data
        dailyForecasts[dayKey].hourlyData.push({
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temp: item.main.temp,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          dt: item.dt
        });
        
        dailyForecasts[dayKey].temps.push(item.main.temp);
        dailyForecasts[dayKey].icons.push(item.weather[0].icon);
        dailyForecasts[dayKey].descriptions.push(item.weather[0].description);
        dailyForecasts[dayKey].humidities.push(item.main.humidity);
        dailyForecasts[dayKey].windSpeeds.push(item.wind.speed);
      });
      
      // Convert to array and limit to 5 days
      const forecastArray = Object.values(dailyForecasts).map(day => ({
        ...day,
        maxTemp: Math.max(...day.temps),
        minTemp: Math.min(...day.temps),
        // Take the most frequent icon
        icon: day.icons.sort((a, b) => 
          day.icons.filter(i => i === a).length - day.icons.filter(i => i === b).length
        ).pop(),
        // Take the most frequent description
        description: day.descriptions.sort((a, b) => 
          day.descriptions.filter(d => d === a).length - day.descriptions.filter(d => d === b).length
        ).pop(),
        avgHumidity: Math.round(day.humidities.reduce((sum, h) => sum + h, 0) / day.humidities.length),
        avgWindSpeed: (day.windSpeeds.reduce((sum, w) => sum + w, 0) / day.windSpeeds.length).toFixed(1)
      })).slice(0, 5);
      
      setForecast(forecastArray);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(`Failed to fetch weather data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to get weather icon URL
  const getWeatherIcon = (iconCode) => {
    return weatherIcons[iconCode] || `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Format time from timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get weather gradient based on temperature
  const getTemperatureGradient = (temp) => {
    if (temp >= 30) return 'from-red-400 to-yellow-300'; // Hot
    if (temp >= 20) return 'from-yellow-300 to-green-300'; // Warm
    if (temp >= 10) return 'from-green-300 to-blue-300'; // Mild
    return 'from-blue-300 to-blue-500'; // Cold
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'farmer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <Link 
              href="/dashboard/farmer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Weather Forecast</h1>
          </div>
          <p className="mt-2 text-sm text-gray-800">
            Plan your farming activities with accurate weather forecasts
          </p>
        </div>

        {/* Location Search and City Selection */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">
              Select Location
            </h3>
          </div>
          <div className="p-6">
            <form onSubmit={searchLocation} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                  <label htmlFor="searchQuery" className="sr-only">Search location</label>
                  <input
                    type="text"
                    id="searchQuery"
                    name="searchQuery"
                    value={location.searchQuery}
                    onChange={(e) => setLocation(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Search for a location..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Search
                </button>
              </div>
            </form>

            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-2">Popular Cities:</h4>
              <div className="flex flex-wrap gap-2">
                {popularCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => selectCity(city)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Current Weather */}
        {!loading && currentWeather && (
          <div className="mb-8">
            <div className={`bg-gradient-to-r ${getTemperatureGradient(currentWeather.main.temp)} shadow-lg rounded-lg overflow-hidden border border-gray-200 text-white`}>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-1">{location.locationName}</h2>
                    <p className="text-lg text-white/80 mb-4">{formatDate(currentWeather.dt)}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <span className="text-4xl md:text-5xl font-bold">{Math.round(currentWeather.main.temp)}°C</span>
                        <span className="text-white/80 capitalize">{currentWeather.weather[0].description}</span>
                      </div>
                      <div className="h-20 w-20 relative">
                        {weatherIcons[currentWeather.weather[0].icon] ? (
                          <Image
                            src={getWeatherIcon(currentWeather.weather[0].icon)}
                            alt={currentWeather.weather[0].description}
                            width={80}
                            height={80}
                            priority
                          />
                        ) : (
                          <img 
                            src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                            alt={currentWeather.weather[0].description} 
                            className="w-20 h-20"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-white/70">Feels Like</p>
                      <p className="text-xl font-semibold">{Math.round(currentWeather.main.feels_like)}°C</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-white/70">Humidity</p>
                      <p className="text-xl font-semibold">{currentWeather.main.humidity}%</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-white/70">Wind</p>
                      <p className="text-xl font-semibold">{currentWeather.wind.speed} m/s</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-white/70">Pressure</p>
                      <p className="text-xl font-semibold">{currentWeather.main.pressure} hPa</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-white/70">Sunrise</p>
                      <p className="font-medium">{formatTime(currentWeather.sys.sunrise)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <div>
                      <p className="text-sm text-white/70">Sunset</p>
                      <p className="font-medium">{formatTime(currentWeather.sys.sunset)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <div>
                      <p className="text-sm text-white/70">High / Low</p>
                      <p className="font-medium">{Math.round(currentWeather.main.temp_max)}° / {Math.round(currentWeather.main.temp_min)}°</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <div>
                      <p className="text-sm text-white/70">Clouds</p>
                      <p className="font-medium">{currentWeather.clouds.all}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {!loading && forecast && forecast.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">5-Day Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800">{day.day}</h4>
                    <p className="text-sm text-gray-700">{day.date}</p>
                  </div>
                  <div className="p-4 flex flex-col items-center">
                    <div className="h-16 w-16 relative mb-2">
                      {weatherIcons[day.icon] ? (
                        <Image
                          src={getWeatherIcon(day.icon)}
                          alt={day.description}
                          width={64}
                          height={64}
                        />
                      ) : (
                        <img 
                          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt={day.description} 
                          className="w-16 h-16"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 capitalize mb-3">{day.description}</p>
                    <div className="flex justify-center items-center space-x-4">
                      <span className="text-xl font-bold text-gray-900">{Math.round(day.maxTemp)}°</span>
                      <span className="text-md text-gray-700">{Math.round(day.minTemp)}°</span>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-800">Humidity</p>
                      <p className="text-base font-semibold text-gray-900">{day.avgHumidity}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-800">Wind</p>
                      <p className="text-base font-semibold text-gray-900 group relative">
                        {day.avgWindSpeed} m/s
                        <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 w-36 bg-black text-white text-xs p-1 rounded opacity-80">
                          Wind speed in meters per second
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Hourly Forecast */}
        {!loading && forecast && forecast.length > 0 && forecast[0].hourlyData && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Hourly Forecast</h3>
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-4 sm:grid-cols-8 p-4 gap-6">
                      {forecast[0].hourlyData.slice(0, 8).map((hour, index) => (
                        <div key={index} className="flex flex-col items-center bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">{hour.time}</p>
                          <div className="h-10 w-10 my-1">
                            {weatherIcons[hour.icon] ? (
                              <Image
                                src={getWeatherIcon(hour.icon)}
                                alt={hour.description}
                                width={40}
                                height={40}
                              />
                            ) : (
                              <img 
                                src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
                                alt={hour.description} 
                                className="w-10 h-10"
                              />
                            )}
                          </div>
                          <p className="text-base font-bold text-gray-900">{Math.round(hour.temp)}°C</p>
                          <div className="mt-1 text-center">
                            <p className="text-xs font-medium text-gray-800">
                              <span className="inline-block mr-1">
                                <svg className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                              </span>
                              {hour.humidity}%
                            </p>
                            <p className="text-xs font-medium text-gray-800">
                              <span className="inline-block mr-1">
                                <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </span>
                              {hour.windSpeed} m/s
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Impact on Farming */}
        {!loading && currentWeather && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Weather Impact on Farming</h3>
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Water Management
                    </h4>
                    <p className="text-sm text-gray-800">
                      {currentWeather.main.humidity > 80 
                        ? "High humidity. Reduce irrigation to prevent waterlogging and diseases."
                        : currentWeather.main.humidity < 40
                        ? "Low humidity. Increase irrigation to prevent water stress."
                        : "Moderate humidity. Maintain regular irrigation schedule."}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Pest & Disease Risk
                    </h4>
                    <p className="text-sm text-gray-800">
                      {currentWeather.main.temp > 30 && currentWeather.main.humidity > 70
                        ? "High temperature and humidity increase risk of fungal diseases. Monitor crops closely."
                        : currentWeather.weather[0].main === "Rain"
                        ? "Rainy conditions favor disease development. Consider preventive fungicide application."
                        : "Moderate disease risk. Maintain regular monitoring practices."}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Recommended Activities
                    </h4>
                    <p className="text-sm text-gray-800">
                      {currentWeather.weather[0].main === "Clear" 
                        ? "Clear weather is ideal for harvesting, spraying pesticides, and field work."
                        : currentWeather.weather[0].main === "Rain"
                        ? "Rainy conditions: Postpone spraying and harvesting. Good time for planting."
                        : currentWeather.wind.speed > 5
                        ? "Windy conditions: Avoid spraying chemicals. Secure structures and young plants."
                        : "Moderate conditions good for general farm activities."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mb-8">
          <details className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <summary className="px-6 py-4 bg-gray-50 cursor-pointer text-gray-900 font-medium flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Weather Forecast Guide
            </summary>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Understanding the Forecast</h4>
                  <ul className="space-y-2 text-gray-800">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span><strong>Current Weather:</strong> Shows real-time conditions with temperature, feels like, humidity, wind speed, and more.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span><strong>5-Day Forecast:</strong> Provides a daily overview with high/low temperatures, conditions, humidity, and wind speed.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span><strong>Hourly Forecast:</strong> Shows hour-by-hour predictions for the current day to plan your activities with precision.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span><strong>Farming Impact:</strong> Offers specific agricultural advice based on weather conditions.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Measurements Explained</h4>
                  <ul className="space-y-2 text-gray-800">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span><strong>Temperature:</strong> Shown in Celsius (°C).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span><strong>Wind Speed:</strong> Measured in meters per second (m/s). A speed of 5 m/s or higher can affect spraying operations.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span><strong>Humidity:</strong> Percentage of moisture in the air. High humidity ({'>'}70%) increases disease risk.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span><strong>Pressure:</strong> Measured in hectopascals (hPa), helps predict weather changes.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
} 