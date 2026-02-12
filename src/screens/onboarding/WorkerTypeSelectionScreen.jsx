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
import COLORS from '../../constants/colors';

const WorkerTypeSelectionScreen = ({ onComplete, onBack }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  ];

  // Translations for all content
  const translations = {
    English: {
      header: 'Choose Your Profile',
      continueBtn: 'Continue',
      selectPrompt: 'Select a profile type',
      workerTypes: {
        individual: {
          title: 'Individual Worker',
          description: '',
          features: ['Personal profile', 'Direct bookings']
        },
        crew_leader: {
          title: 'Crew Leader',
          description: 'Manage and lead a team',
          features: ['Team management', 'Multiple workers']
        },
        contractor: {
          title: 'Contractor',
          description: '',
          features: ['Project contracts', 'Licensed work']
        },
        service_provider: {
          title: 'Service Provider',
          description: 'Shop/Agency',
          features: ['Business profile', 'Multiple services']
        }
      }
    },
    Hindi: {
      header: 'अपनी प्रोफ़ाइल चुनें',
      continueBtn: 'जारी रखें',
      selectPrompt: 'प्रोफ़ाइल प्रकार चुनें',
      workerTypes: {
        individual: {
          title: 'व्यक्तिगत कार्यकर्ता',
          description: '',
          features: ['व्यक्तिगत प्रोफ़ाइल', 'सीधी बुकिंग']
        },
        crew_leader: {
          title: 'क्रू/टीम लीडर',
          description: 'टीम का प्रबंधन और नेतृत्व',
          features: ['टीम प्रबंधन', 'कई कार्यकर्ता']
        },
        contractor: {
          title: 'ठेकेदार',
          description: '',
          features: ['परियोजना अनुबंध', 'लाइसेंस प्राप्त कार्य']
        },
        service_provider: {
          title: 'सेवा प्रदाता',
          description: 'दुकान/एजेंसी',
          features: ['व्यवसाय प्रोफ़ाइल', 'कई सेवाएं']
        }
      }
    },
    Tamil: {
      header: 'உங்கள் சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்',
      continueBtn: 'தொடரவும்',
      selectPrompt: 'சுயவிவர வகையைத் தேர்ந்தெடுக்கவும்',
      workerTypes: {
        individual: {
          title: 'தனிப்பட்ட தொழிலாளி',
          description: '',
          features: ['தனிப்பட்ட சுயவிவரம்', 'நேரடி முன்பதிவுகள்']
        },
        crew_leader: {
          title: 'குழு/டீம் தலைவர்',
          description: 'குழுவை நிர்வகித்து வழிநடத்துங்கள்',
          features: ['குழு மேலாண்மை', 'பல தொழிலாளர்கள்']
        },
        contractor: {
          title: 'ஒப்பந்ததாரர்',
          description: '',
          features: ['திட்ட ஒப்பந்தங்கள்', 'உரிமம் பெற்ற வேலை']
        },
        service_provider: {
          title: 'சேவை வழங்குநர்',
          description: 'கடை/ஏஜென்சி',
          features: ['வணிக சுயவிவரம்', 'பல சேவைகள்']
        }
      }
    },
    Kannada: {
      header: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ',
      continueBtn: 'ಮುಂದುವರಿಸಿ',
      selectPrompt: 'ಪ್ರೊಫೈಲ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      workerTypes: {
        individual: {
          title: 'ವೈಯಕ್ತಿಕ ಕೆಲಸಗಾರ',
          description: '',
          features: ['ವೈಯಕ್ತಿಕ ಪ್ರೊಫೈಲ್', 'ನೇರ ಬುಕಿಂಗ್‌ಗಳು']
        },
        crew_leader: {
          title: 'ಸಿಬ್ಬಂದಿ/ತಂಡ ನಾಯಕ',
          description: 'ತಂಡವನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಮುನ್ನಡೆಸಿ',
          features: ['ತಂಡ ನಿರ್ವಹಣೆ', 'ಅನೇಕ ಕೆಲಸಗಾರರು']
        },
        contractor: {
          title: 'ಗುತ್ತಿಗೆದಾರ',
          description: '',
          features: ['ಯೋಜನಾ ಒಪ್ಪಂದಗಳು', 'ಪರವಾನಗಿ ಪಡೆದ ಕೆಲಸ']
        },
        service_provider: {
          title: 'ಸೇವಾ ಪೂರೈಕೆದಾರ',
          description: 'ಅಂಗಡಿ/ಏಜೆನ್ಸಿ',
          features: ['ವ್ಯಾಪಾರ ಪ್ರೊಫೈಲ್', 'ಅನೇಕ ಸೇವೆಗಳು']
        }
      }
    },
    Telugu: {
      header: 'మీ ప్రొఫైల్‌ను ఎంచుకోండి',
      continueBtn: 'కొనసాగించు',
      selectPrompt: 'ప్రొఫైల్ రకాన్ని ఎంచుకోండి',
      workerTypes: {
        individual: {
          title: 'వ్యక్తిగత కార్మికుడు',
          description: '',
          features: ['వ్యక్తిగత ప్రొఫైల్', 'ప్రత్యక్ష బుకింగ్‌లు']
        },
        crew_leader: {
          title: 'క్రూ/టీమ్ లీడర్',
          description: 'బృందాన్ని నిర్వహించండి మరియు నడిపించండి',
          features: ['బృంద నిర్వహణ', 'అనేక కార్మికులు']
        },
        contractor: {
          title: 'కాంట్రాక్టర్',
          description: '',
          features: ['ప్రాజెక్ట్ ఒప్పందాలు', 'లైసెన్స్ పొందిన పని']
        },
        service_provider: {
          title: 'సేవా ప్రదాత',
          description: 'దుకాణం/ఏజెన్సీ',
          features: ['వ్యాపార ప్రొఫైల్', 'అనేక సేవలు']
        }
      }
    },
    Marathi: {
      header: 'तुमचे प्रोफाइल निवडा',
      continueBtn: 'सुरू ठेवा',
      selectPrompt: 'प्रोफाइल प्रकार निवडा',
      workerTypes: {
        individual: {
          title: 'वैयक्तिक कामगार',
          description: '',
          features: ['वैयक्तिक प्रोफाइल', 'थेट बुकिंग']
        },
        crew_leader: {
          title: 'क्रू/टीम लीडर',
          description: 'टीमचे व्यवस्थापन आणि नेतृत्व',
          features: ['टीम व्यवस्थापन', 'अनेक कामगार']
        },
        contractor: {
          title: 'कंत्राटदार',
          description: '',
          features: ['प्रकल्प करार', 'परवानाधारक काम']
        },
        service_provider: {
          title: 'सेवा प्रदाता',
          description: 'दुकान/एजन्सी',
          features: ['व्यवसाय प्रोफाइल', 'अनेक सेवा']
        }
      }
    },
    Gujarati: {
      header: 'તમારી પ્રોફાઇલ પસંદ કરો',
      continueBtn: 'ચાલુ રાખો',
      selectPrompt: 'પ્રોફાઇલ પ્રકાર પસંદ કરો',
      workerTypes: {
        individual: {
          title: 'વ્યક્તિગત કામદાર',
          description: '',
          features: ['વ્યક્તિગત પ્રોફાઇલ', 'સીધી બુકિંગ']
        },
        crew_leader: {
          title: 'ક્રૂ/ટીમ લીડર',
          description: 'ટીમનું સંચાલન અને નેતૃત્વ',
          features: ['ટીમ મેનેજમેન્ટ', 'અનેક કામદારો']
        },
        contractor: {
          title: 'કોન્ટ્રાક્ટર',
          description: '',
          features: ['પ્રોજેક્ટ કરાર', 'લાઇસન્સ પ્રાપ્ત કામ']
        },
        service_provider: {
          title: 'સેવા પ્રદાતા',
          description: 'દુકાન/એજન્સી',
          features: ['વ્યવસાય પ્રોફાઇલ', 'અનેક સેવાઓ']
        }
      }
    },
    Bengali: {
      header: 'আপনার প্রোফাইল নির্বাচন করুন',
      continueBtn: 'চালিয়ে যান',
      selectPrompt: 'প্রোফাইল প্রকার নির্বাচন করুন',
      workerTypes: {
        individual: {
          title: 'ব্যক্তিগত কর্মী',
          description: '',
          features: ['ব্যক্তিগত প্রোফাইল', 'সরাসরি বুকিং']
        },
        crew_leader: {
          title: 'ক্রু/টিম লিডার',
          description: 'দল পরিচালনা এবং নেতৃত্ব',
          features: ['দল ব্যবস্থাপনা', 'একাধিক কর্মী']
        },
        contractor: {
          title: 'ঠিকাদার',
          description: '',
          features: ['প্রকল্প চুক্তি', 'লাইসেন্সপ্রাপ্ত কাজ']
        },
        service_provider: {
          title: 'সেবা প্রদানকারী',
          description: 'দোকান/এজেন্সি',
          features: ['ব্যবসা প্রোফাইল', 'একাধিক সেবা']
        }
      }
    }
  };

  // Get current language translations
  const t = translations[selectedLanguage] || translations.English;

  const workerTypes = [
    {
      id: 'individual',
      icon: 'person',
      color: COLORS.accent,
      gradient: ['#299ed3', '#1e7ba8'],
    },
    {
      id: 'crew_leader',
      icon: 'people',
      color: COLORS.secondary,
      gradient: ['#a4c143', '#8aa835'],
    },
    {
      id: 'contractor',
      icon: 'construct',
      color: COLORS.primary,
      gradient: ['#2e2b6d', '#1f1b4d'],
    },
    {
      id: 'service_provider',
      icon: 'business',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
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
            <Text style={styles.title}>{t.header}</Text>
          </View>
          
          {/* Language Selector */}
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguageMenu(!showLanguageMenu)}
            activeOpacity={0.8}
          >
            <Text style={styles.languageButtonText}>Language</Text>
            <Icon 
              name={showLanguageMenu ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Language Dropdown Menu - Outside header for proper positioning */}
        {showLanguageMenu && (
          <View style={styles.languageMenuWrapper}>
            <View style={styles.languageMenu}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageMenuItem,
                    selectedLanguage === language.name && styles.languageMenuItemSelected
                  ]}
                  onPress={() => {
                    setSelectedLanguage(language.name);
                    setShowLanguageMenu(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageMenuItemContent}>
                    <Text style={styles.languageMenuItemText}>
                      {language.name}
                    </Text>
                    <Text style={styles.languageMenuItemNative}>
                      {language.nativeName}
                    </Text>
                  </View>
                  {selectedLanguage === language.name && (
                    <Icon name="checkmark-circle" size={22} color={COLORS.secondary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Overlay to close language menu when clicking outside */}
      {showLanguageMenu && (
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowLanguageMenu(false)}
        />
      )}

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
              <View
                key={type.id}
                style={styles.cardWrapper}
              >
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
                  
                  {/* Badge */}
                  {type.badge && (
                    <View style={[styles.typeBadge, { backgroundColor: `${type.color}20` }]}>
                      <Text style={[styles.typeBadgeText, { color: type.color }]}>
                        {type.badge}
                      </Text>
                    </View>
                  )}

                  {/* Icon Container */}
                  <View style={[styles.typeIconContainer, { backgroundColor: `${type.color}15` }]}>
                    <Icon name={type.icon} size={50} color={type.color} />
                  </View>

                  {/* Content */}
                  <View style={styles.typeContent}>
                    <Text style={styles.typeTitle}>{t.workerTypes[type.id].title}</Text>
                    {t.workerTypes[type.id].description && (
                      <Text style={styles.typeDescription}>{t.workerTypes[type.id].description}</Text>
                    )}

                    {/* Features */}
                    <View style={styles.featuresContainer}>
                      {t.workerTypes[type.id].features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          <View style={[styles.featureDot, { backgroundColor: `${type.color}30` }]}>
                            <Icon name="checkmark" size={8} color={type.color} />
                          </View>
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Bottom Info */}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          {/* {selectedType && (
            <View style={styles.selectedInfo}>
              <Icon name="checkmark-circle" size={20} color={COLORS.secondary} />
              <Text style={styles.selectedInfoText}>
                {workerTypes.find(t => t.id === selectedType)?.title} selected
              </Text>
            </View>
          )} */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedType && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedType}
            activeOpacity={0.6}
            underlayColor="#87CEEB"
          >
            <Text style={styles.continueButtonText}>
              {selectedType ? t.continueBtn : t.selectPrompt}
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  languageButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  languageMenuWrapper: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 2000,
  },
  languageMenu: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    minWidth: 220,
    maxHeight: 400,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  languageMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  languageMenuItemSelected: {
    backgroundColor: '#e0f2fe',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  languageMenuItemContent: {
    flex: 1,
  },
  languageMenuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  languageMenuItemNative: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
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
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
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
  typeDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 15,
    textAlign: 'center',
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
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: `${COLORS.secondary}15`,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: `${COLORS.secondary}40`,
  },
  selectedInfoText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
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
