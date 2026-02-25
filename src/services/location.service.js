/**
 * Location Service
 * Handles GPS location detection and reverse geocoding
 * Uses react-native-geolocation-service for high accuracy GPS
 * Uses OpenCage Geocoding API for address conversion
 */

import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

/**
 * Request location permission from user
 * @returns {Promise<boolean>} - Permission granted or not
 */
export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'PaasoWork needs access to your location to show your service area',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('✅ Location permission granted');
        return true;
      } else {
        console.log('❌ Location permission denied');
        return false;
      }
    }
    
    // iOS permissions are handled automatically
    return true;
  } catch (error) {
    console.error('❌ Location permission error:', error);
    return false;
  }
};

/**
 * Get current GPS location using react-native-geolocation-service
 * Provides high accuracy GPS coordinates on Android devices
 * @returns {Promise<object>} - Location coordinates {latitude, longitude, accuracy}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    console.log('🔍 Requesting high-accuracy GPS location...');
    
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ GPS location obtained successfully!');
        console.log('   Latitude:', position.coords.latitude);
        console.log('   Longitude:', position.coords.longitude);
        console.log('   Accuracy:', position.coords.accuracy, 'meters');
        console.log('   Altitude:', position.coords.altitude);
        console.log('   Speed:', position.coords.speed);
        
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.error('❌ GPS location error:');
        console.error('   Code:', error.code);
        console.error('   Message:', error.message);
        
        let errorMessage = 'Unable to get location';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location permission denied';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location unavailable - please enable GPS';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timeout - please try again';
            break;
          default:
            errorMessage = error.message || 'Unknown location error';
        }
        
        reject(new Error(errorMessage));
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 20000, // 20 seconds timeout
        maximumAge: 5000, // Use cached location if less than 5 seconds old
        distanceFilter: 0, // Get location regardless of distance moved
        forceRequestLocation: true, // Force location request even if cached
        forceLocationManager: false, // Use Google Play Services on Android
        showLocationDialog: true, // Show system location dialog if GPS is off
      }
    );
  });
};

/**
 * Reverse geocode coordinates to address
 * Uses OpenCage Geocoding API with high accuracy
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<object>} - Address details
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    console.log(`🌍 Reverse geocoding: ${latitude}, ${longitude}`);
    
    // OpenCage API Key
    const OPENCAGE_API_KEY = 'ccb51f39bd9c4287b130b5b97794c70a';
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}&language=en&pretty=1`,
      {
        signal: controller.signal,
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ OpenCage geocoding response received');
    
    if (data && data.results && data.results.length > 0) {
      const result = data.results[0];
      const components = result.components;
      
      console.log('   Formatted:', result.formatted);
      
      // Extract relevant address components with Indian address structure
      const city = components.city || 
                   components.town || 
                   components.village || 
                   components.county || 
                   components.state_district || 
                   components.suburb ||
                   'Unknown';
      
      const state = components.state || '';
      const country = components.country || 'India';
      const postcode = components.postcode || '';
      
      // Build formatted address for Indian context
      const suburb = components.suburb || components.neighbourhood || '';
      const road = components.road || '';
      const locality = components.locality || '';
      
      let formattedAddress = '';
      
      // Priority: suburb/locality, road, city
      if (suburb) formattedAddress += suburb;
      if (locality && !suburb) formattedAddress += locality;
      if (road && formattedAddress) formattedAddress += ', ' + road;
      else if (road) formattedAddress += road;
      if (city && formattedAddress) formattedAddress += ', ' + city;
      else if (city) formattedAddress += city;
      
      // Fallback to OpenCage formatted address if we couldn't build one
      if (!formattedAddress) {
        formattedAddress = result.formatted;
      }
      
      const addressResult = {
        success: true,
        city: city,
        state: state,
        country: country,
        postcode: postcode,
        suburb: suburb,
        road: road,
        locality: locality,
        formattedAddress: formattedAddress,
        fullAddress: result.formatted,
        confidence: result.confidence, // OpenCage confidence score (1-10)
        raw: result,
      };
      
      console.log('✅ Formatted address:', addressResult.formattedAddress);
      console.log('   City:', addressResult.city);
      console.log('   State:', addressResult.state);
      console.log('   Confidence:', addressResult.confidence);
      
      return addressResult;
    } else {
      throw new Error('No address found in response');
    }
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error.message);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout - please try again',
      };
    }
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get current location with address
 * Combines GPS location and reverse geocoding
 * @returns {Promise<object>} - Location with address
 */
export const getCurrentLocationWithAddress = async () => {
  try {
    console.log('🚀 Starting location fetch...');
    
    // Request permission
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }
    
    console.log('✅ Permission granted, getting GPS coordinates...');
    
    // Get GPS coordinates
    const coords = await getCurrentLocation();
    console.log(`✅ GPS coordinates obtained: ${coords.latitude}, ${coords.longitude}`);
    
    // Try reverse geocoding with fallback
    console.log('🌍 Starting reverse geocoding...');
    const address = await reverseGeocode(coords.latitude, coords.longitude);
    
    if (address.success) {
      console.log('✅ Reverse geocoding successful');
      return {
        success: true,
        coordinates: coords,
        address: address,
        city: address.city,
        state: address.state,
        formattedAddress: address.formattedAddress,
      };
    } else {
      // Fallback: Return coordinates as formatted string
      console.log('⚠️ Reverse geocoding failed, using coordinates as fallback');
      const coordsString = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      return {
        success: true,
        coordinates: coords,
        address: {
          success: false,
          formattedAddress: coordsString,
          city: 'Location',
          state: '',
        },
        city: 'Location',
        state: '',
        formattedAddress: coordsString,
        fallback: true,
        message: 'Using GPS coordinates (address lookup failed)',
      };
    }
  } catch (error) {
    console.error('❌ Get location with address error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Show location error alert
 * @param {string} errorMessage - Error message
 */
export const showLocationError = (errorMessage) => {
  let message = 'Unable to get your location. ';
  
  if (errorMessage.includes('permission')) {
    message += 'Please enable location permission in settings.';
  } else if (errorMessage.includes('timeout')) {
    message += 'Location request timed out. Please try again.';
  } else if (errorMessage.includes('unavailable')) {
    message += 'Location services are not available. Please enable GPS.';
  } else {
    message += 'Please check your GPS settings and try again.';
  }
  
  Alert.alert('Location Error', message, [
    { text: 'OK' },
  ]);
};

export default {
  requestLocationPermission,
  getCurrentLocation,
  reverseGeocode,
  getCurrentLocationWithAddress,
  showLocationError,
};
