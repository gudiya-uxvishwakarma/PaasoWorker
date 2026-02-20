import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

const LanguageSelectionScreen = ({ onComplete, onBack }) => {
  const { selectedLanguage, changeLanguage, languages } = useLanguage();

  const handleLanguageSelect = (languageName) => {
    changeLanguage(languageName);
    if (onComplete) {
      onComplete(languageName);
    }
  };

  // Language flag emojis
  const languageFlags = {
    'English': '🇬🇧',
    'Hindi': '🇮🇳',
    'Kannada': '🇮🇳',
    'Tamil': '🇮🇳',
    'Telugu': '🇮🇳',
    'Malayalam': '🇮🇳',
    'Marathi': '🇮🇳',
    'Gujarati': '🇮🇳',
    'Punjabi': '🇮🇳',
    'Bengali': '🇮🇳',
    'Odia': '🇮🇳',
    'Assamese': '🇮🇳',
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
          <View style={styles.languageIcon}>
            <MaterialIcon name="web" size={22} color={COLORS.white} />
          </View>
          <Text style={styles.headerTitle}>Select Language</Text>
        </View>
      </View>

      {/* Language Grid */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.languageGrid}>
          {languages.map((language) => {
            const isSelected = selectedLanguage === language.name;
            const flag = languageFlags[language.name] || '🇮🇳';
            
            return (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageCard,
                  isSelected && styles.languageCardSelected
                ]}
                onPress={() => handleLanguageSelect(language.name)}
                activeOpacity={0.8}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Icon name="checkmark-circle" size={24} color="#10b981" />
                  </View>
                )}

                {/* Flag */}
                <Text style={styles.flagEmoji}>{flag}</Text>
                
                {/* Language Native Name */}
                <Text style={[
                  styles.languageNative,
                  isSelected && styles.languageNativeSelected
                ]}>
                  {language.nativeName}
                </Text>
                
                {/* Language English Name */}
                <Text style={[
                  styles.languageName,
                  isSelected && styles.languageNameSelected
                ]}>
                  {language.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
  languageIcon: {
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingTop: 24,
    paddingBottom: 32,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageCard: {
    width: (width - 52) / 2, // 2 columns with proper spacing
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
  languageCardSelected: {
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
  flagEmoji: {
    fontSize: 38,
    marginBottom: 8,
  },
  languageNative: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  languageNativeSelected: {
    color: '#059669',
  },
  languageName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  languageNameSelected: {
    color: '#047857',
  },
});

export default LanguageSelectionScreen;
