import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants/colors';

const { width } = Dimensions.get('window');

const CitySelectionScreen = ({ onComplete, onBack, selectedCity: initialCity }) => {
  const [selectedCity, setSelectedCity] = useState(initialCity || null);
  const [searchQuery, setSearchQuery] = useState('');

  // Major Indian cities list with valid Ionicons
  const cities = [
    { name: 'Mumbai', state: 'Maharashtra', icon: 'business' },
    { name: 'Delhi', state: 'Delhi', icon: 'flag' },
    { name: 'Bangalore', state: 'Karnataka', icon: 'laptop' },
    { name: 'Hyderabad', state: 'Telangana', icon: 'business-outline' },
    { name: 'Chennai', state: 'Tamil Nadu', icon: 'boat' },
    { name: 'Kolkata', state: 'West Bengal', icon: 'train' },
    { name: 'Pune', state: 'Maharashtra', icon: 'school' },
    { name: 'Ahmedabad', state: 'Gujarat', icon: 'home' },
    { name: 'Jaipur', state: 'Rajasthan', icon: 'home-outline' },
    { name: 'Surat', state: 'Gujarat', icon: 'diamond-outline' },
    { name: 'Lucknow', state: 'Uttar Pradesh', icon: 'home-outline' },
    { name: 'Kanpur', state: 'Uttar Pradesh', icon: 'construct' },
    { name: 'Nagpur', state: 'Maharashtra', icon: 'fast-food' },
    { name: 'Indore', state: 'Madhya Pradesh', icon: 'business' },
    { name: 'Thane', state: 'Maharashtra', icon: 'home-outline' },
    { name: 'Bhopal', state: 'Madhya Pradesh', icon: 'water' },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', icon: 'boat-outline' },
    { name: 'Pimpri-Chinchwad', state: 'Maharashtra', icon: 'construct-outline' },
    { name: 'Patna', state: 'Bihar', icon: 'business-outline' },
    { name: 'Vadodara', state: 'Gujarat', icon: 'color-palette' },
    { name: 'Ghaziabad', state: 'Uttar Pradesh', icon: 'home' },
    { name: 'Ludhiana', state: 'Punjab', icon: 'shirt-outline' },
    { name: 'Agra', state: 'Uttar Pradesh', icon: 'home-outline' },
    { name: 'Nashik', state: 'Maharashtra', icon: 'wine' },
    { name: 'Faridabad', state: 'Haryana', icon: 'construct' },
    { name: 'Meerut', state: 'Uttar Pradesh', icon: 'home' },
    { name: 'Rajkot', state: 'Gujarat', icon: 'business' },
    { name: 'Varanasi', state: 'Uttar Pradesh', icon: 'flame' },
    { name: 'Srinagar', state: 'Jammu & Kashmir', icon: 'snow' },
    { name: 'Aurangabad', state: 'Maharashtra', icon: 'business-outline' },
    { name: 'Dhanbad', state: 'Jharkhand', icon: 'hammer' },
    { name: 'Amritsar', state: 'Punjab', icon: 'home' },
    { name: 'Navi Mumbai', state: 'Maharashtra', icon: 'business' },
    { name: 'Allahabad', state: 'Uttar Pradesh', icon: 'water-outline' },
    { name: 'Ranchi', state: 'Jharkhand', icon: 'leaf' },
    { name: 'Howrah', state: 'West Bengal', icon: 'train-outline' },
    { name: 'Coimbatore', state: 'Tamil Nadu', icon: 'construct' },
    { name: 'Jabalpur', state: 'Madhya Pradesh', icon: 'leaf-outline' },
    { name: 'Gwalior', state: 'Madhya Pradesh', icon: 'home-outline' },
    { name: 'Vijayawada', state: 'Andhra Pradesh', icon: 'water' },
    { name: 'Jodhpur', state: 'Rajasthan', icon: 'home-outline' },
    { name: 'Madurai', state: 'Tamil Nadu', icon: 'home' },
    { name: 'Raipur', state: 'Chhattisgarh', icon: 'business' },
    { name: 'Kota', state: 'Rajasthan', icon: 'school-outline' },
    { name: 'Chandigarh', state: 'Chandigarh', icon: 'business' },
    { name: 'Guwahati', state: 'Assam', icon: 'water-outline' },
    { name: 'Mysore', state: 'Karnataka', icon: 'home-outline' },
    { name: 'Bareilly', state: 'Uttar Pradesh', icon: 'home' },
    { name: 'Aligarh', state: 'Uttar Pradesh', icon: 'school' },
    { name: 'Moradabad', state: 'Uttar Pradesh', icon: 'home-outline' },
  ];

  // Filter cities based on search query
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    if (onComplete) {
      onComplete(cityName);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <View style={styles.headerTitleContainer}>
          <View style={styles.cityIcon}>
            <Icon name="location" size={22} color={COLORS.white} />
          </View>
          <Text style={styles.headerTitle}>Select City</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search city..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* City Grid */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cityGrid}>
          {filteredCities.map((city) => {
            const isSelected = selectedCity === city.name;
            
            return (
              <TouchableOpacity
                key={city.name}
                style={[
                  styles.cityCard,
                  isSelected && styles.cityCardSelected
                ]}
                onPress={() => handleCitySelect(city.name)}
                activeOpacity={0.8}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Icon name="checkmark-circle" size={24} color="#10b981" />
                  </View>
                )}

                {/* City Icon */}
                <View style={styles.cityIconContainer}>
                  <Icon name={city.icon} size={32} color={COLORS.primary} />
                </View>
                
                {/* City Name */}
                <Text style={[
                  styles.cityName,
                  isSelected && styles.cityNameSelected
                ]}>
                  {city.name}
                </Text>
                
                {/* State Name */}
                <Text style={[
                  styles.stateName,
                  isSelected && styles.stateNameSelected
                ]}>
                  {city.state}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredCities.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Icon name="location-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.noResultsText}>No cities found</Text>
            <Text style={styles.noResultsSubtext}>Try searching with a different name</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    padding: 0,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingTop: 16,
    paddingBottom: 32,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cityCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    paddingVertical: 18,
    marginBottom: 14,
    borderWidth: 2.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    minHeight: 120,
  },
  cityCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    elevation: 6,
    shadowOpacity: 0.15,
    shadowColor: '#10b981',
    borderWidth: 3,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
  },
  cityIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cityNameSelected: {
    color: '#059669',
  },
  stateName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  stateNameSelected: {
    color: '#047857',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
});

export default CitySelectionScreen;
