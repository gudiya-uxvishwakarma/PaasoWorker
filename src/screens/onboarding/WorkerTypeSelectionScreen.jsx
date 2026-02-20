import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';

const WorkerTypeSelectionScreen = ({ onComplete, onBack, onNavigateToLanguage }) => {
  const [selectedType, setSelectedType] = useState(null);
  
  // Use global language context
  const { selectedLanguage, languages, t } = useLanguage();

  // Get current language native name
  const currentLanguage = languages.find(lang => lang.name === selectedLanguage);
  const displayLanguage = currentLanguage?.nativeName || selectedLanguage;

  const workerTypes = [
    {
      id: 'individual',
      icon: 'person',
      color: COLORS.accent,
      titleKey: 'individualWorker',
      descriptionKey: '',
      featuresKeys: ['personalProfile', 'directBookings']
    },
    {
      id: 'crew_leader',
      icon: 'people',
      color: COLORS.secondary,
      titleKey: 'crewLeader',
      descriptionKey: 'manageTeam',
      featuresKeys: ['teamManagement', 'multipleWorkers']
    },
    {
      id: 'contractor',
      icon: 'construct',
      color: COLORS.primary,
      titleKey: 'contractor',
      descriptionKey: '',
      featuresKeys: ['projectContracts', 'licensedWork']
    },
    {
      id: 'service_provider',
      icon: 'business',
      color: '#f59e0b',
      titleKey: 'serviceProvider',
      descriptionKey: 'shopAgency',
      featuresKeys: ['businessProfile', 'multipleServices']
    },
  ];

  const handleCardPress = (typeId) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (!selectedType) {
      Alert.alert('Select Type', 'Please select your worker type to continue');
      return;
    }
    onComplete(selectedType, selectedLanguage);
  };

  const handleLanguageButtonPress = () => {
    if (onNavigateToLanguage) {
      onNavigateToLanguage();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <Icon name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.title}>{t('chooseProfile')}</Text>
          </View>
          
          {/* Language Selector */}
          <TouchableOpacity
            style={styles.languageButton}
            onPress={handleLanguageButtonPress}
            activeOpacity={0.8}
          >
             <MaterialIcon name="web" size={22} color={COLORS.white} />
            <Text style={styles.languageButtonText}>{displayLanguage}</Text>
            <Icon name="chevron-down" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Worker Type Cards */}
        <View style={styles.typesGrid}>
          {workerTypes.map((type) => {
            const isSelected = selectedType === type.id;
            
            return (
              <View key={type.id} style={styles.cardWrapper}>
                <TouchableOpacity
                  style={[
                    styles.typeCard,
                    isSelected && styles.typeCardSelected,
                    isSelected && { borderColor: type.color }
                  ]}
                  onPress={() => handleCardPress(type.id)}
                  activeOpacity={0.9}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <View style={[styles.selectedIndicator, { backgroundColor: type.color }]}>
                      <Icon name="checkmark" size={18} color={COLORS.white} />
                    </View>
                  )}

                  {/* Icon Container */}
                  <View style={[styles.typeIconContainer, { backgroundColor: `${type.color}15` }]}>
                    <Icon name={type.icon} size={50} color={type.color} />
                  </View>

                  {/* Content */}
                  <View style={styles.typeContent}>
                    <Text style={styles.typeTitle}>{t(type.titleKey)}</Text>
                    {type.descriptionKey && (
                      <View style={styles.descriptionContainer}>
                        <MaterialIcon name="translate" size={14} color={type.color} />
                        <Text style={styles.typeDescription}>{t(type.descriptionKey)}</Text>
                      </View>
                    )}

                    {/* Features */}
                    <View style={styles.featuresContainer}>
                      {type.featuresKeys.map((featureKey, index) => (
                        <View key={index} style={styles.featureItem}>
                          <View style={[styles.featureDot, { backgroundColor: `${type.color}30` }]}>
                            <Icon name="checkmark" size={8} color={type.color} />
                          </View>
                          <Text style={styles.featureText}>{t(featureKey)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedType && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedType}
            activeOpacity={0.6}
          >
            <Text style={styles.continueButtonText}>
              {selectedType ? t('continue') : t('selectProfileType')}
            </Text>
            {selectedType && (
              <Icon name="arrow-forward" size={20} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 1001,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    minWidth: 110,
  },
  languageButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 0,
  },
  typeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  typeCardSelected: {
    elevation: 10,
    shadowOpacity: 0.15,
    shadowRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 10,
  },
  typeIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },
  typeDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 6,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  featureDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    flex: 1,
    fontWeight: '500',
    lineHeight: 15,
  },
  footer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  footerContent: {
    padding: 20,
    paddingHorizontal: 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    width: '100%',
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.primary,
    elevation: 0,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default WorkerTypeSelectionScreen;
