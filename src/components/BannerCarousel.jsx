import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/colors';
import * as api from '../services/api';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;
const BANNER_HEIGHT = 160;

const BannerCarousel = ({ userData }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * (BANNER_WIDTH + 16),
            animated: true,
          });
          return nextIndex;
        });
      }, 5000); // Auto-scroll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await api.getActiveBanners();
      
      if (response.success && response.banners) {
        setBanners(response.banners);
      }
    } catch (error) {
      console.error('❌ Fetch Banners Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerPress = async (banner) => {
    try {
      // Mark as read
      const workerId = userData?._id || userData?.id;
      if (workerId && banner._id) {
        await api.markNotificationRead(banner._id, workerId);
      }

      // Open link if available
      if (banner.bannerLink) {
        const url = banner.bannerLink.startsWith('http') 
          ? banner.bannerLink 
          : `https://${banner.bannerLink}`;
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('❌ Banner Press Error:', error);
    }
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (BANNER_WIDTH + 16));
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (banners.length === 0) {
    return null; // Don't show anything if no banners
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={BANNER_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {banners.map((banner, index) => (
          <TouchableOpacity
            key={banner._id || index}
            style={styles.bannerCard}
            onPress={() => handleBannerPress(banner)}
            activeOpacity={0.9}
          >
            {banner.bannerImage ? (
              <Image
                source={{ uri: banner.bannerImage }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderBanner}>
                <Icon name="image-outline" size={40} color={COLORS.textSecondary} />
              </View>
            )}
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle} numberOfLines={2}>
                {banner.title}
              </Text>
              {banner.message && (
                <Text style={styles.bannerMessage} numberOfLines={2}>
                  {banner.message}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  loadingContainer: {
    height: BANNER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBanner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerMessage: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
});

export default BannerCarousel;
