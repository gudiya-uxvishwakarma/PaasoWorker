import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import COLORS from '../../constants/colors';
import PhoneInput from '../../components/PhoneInput';
import * as api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { getFCMToken } from '../../services/fcm.service';
import { getCurrentLocationWithAddress, showLocationError } from '../../services/location.service';

const ProfileDetailsScreen = ({ workerType, onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // ✅ Use global language context instead of prop
  const { selectedLanguage } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    businessName: '',
    skills: '',
    services: '',
    serviceAreas: '',
    teamSize: '',
    gstNumber: '',
    msmeNumber: '',
    availability: 'online',
    selectedLanguages: [],
    selectedCategories: [], // ✅ Store selected category IDs
    selectedCities: [], // ✅ Store selected cities
    documents: {
      profilePhoto: null,
      aadharCard: null,
      panCard: null,
    },
    payment: {
      transactionNumber: '',
      transactionScreenshot: null,
      qrScanned: false,
    },
  });

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [categories, setCategories] = useState([]); // ✅ Store categories from backend
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false); // ✅ Toggle category dropdown
  const [showCityMenu, setShowCityMenu] = useState(false); // ✅ Toggle city dropdown
  const [citySearchQuery, setCitySearchQuery] = useState(''); // ✅ City search

  // ✅ Indian Cities List (Static - from images)
  const indianCities = [
    'Bangalore',
    'Mysuru',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Lucknow'
  ];

  const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  ];

  // ✅ Fetch categories from backend on component mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        console.log('📂 Fetching categories from backend...');
        const response = await api.getCategories(true); // Get only active categories
        
        if (response.success && response.data) {
          // ✅ Map frontend workerType to backend format for filtering
          const workerTypeMapping = {
            'individual': 'Worker',
            'crew_team': 'Crew / Team',
            'contractor': 'Contractor',
            'service_provider': 'Service Provider'
          };
          
          const backendWorkerType = workerTypeMapping[workerType] || 'Worker';
          
          // ✅ Filter categories based on worker type
          const filteredCategories = response.data.filter(category => 
            category.workerTypes && category.workerTypes.includes(backendWorkerType)
          );
          
          console.log(`✅ Loaded ${filteredCategories.length} categories for ${backendWorkerType}`);
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error('❌ Failed to fetch categories:', error);
        // Set empty array on error so UI doesn't break
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [workerType]);

  // ✅ Toggle category selection
  const toggleCategory = (categoryId) => {
    setFormData(prev => {
      const isSelected = prev.selectedCategories.includes(categoryId);
      return {
        ...prev,
        selectedCategories: isSelected
          ? prev.selectedCategories.filter(id => id !== categoryId)
          : [...prev.selectedCategories, categoryId]
      };
    });
    // ✅ Auto-close menu after selection
    setShowCategoryMenu(false);
  };

  // ✅ Toggle city selection
  const toggleCity = (cityName) => {
    setFormData(prev => {
      const isSelected = prev.selectedCities.includes(cityName);
      const newSelectedCities = isSelected
        ? prev.selectedCities.filter(city => city !== cityName)
        : [...prev.selectedCities, cityName];
      
      return {
        ...prev,
        selectedCities: newSelectedCities,
        serviceAreas: newSelectedCities.join(', ') // Update serviceAreas text
      };
    });
    // ✅ Auto-close menu after selection
    setShowCityMenu(false);
  };

  // ✅ Filter cities based on search
  const filteredCities = indianCities.filter(city =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Translations
  const translations = {
    English: {
      header: 'Complete Your Profile',
      selectedType: 'Selected Type',
      basicDetails: 'Basic Details',
      fullName: 'Full Name',
      emailId: 'Email ID',
      mobileNumber: 'Mobile Number',
      password: 'Password',
      languages: 'Languages (Optional)',
      selectLanguages: 'Select languages you can speak',
      languagesSelected: 'language(s) selected',
      selectLanguagesPlaceholder: 'Select languages',
      documents: 'Documents',
      uploadDocuments: 'Upload your identity documents',
      profilePhoto: 'Profile Photo',
      uploadPhoto: 'Upload your photo',
      aadharCard: 'Aadhar Card',
      uploadAadhar: 'Upload Aadhar card',
      panCard: 'PAN Card',
      uploadPan: 'Upload PAN card',
      upload: 'Upload',
      registrationPayment: 'Registration Payment',
      completePayment: 'Complete payment to activate your profile',
      registrationFee: 'Registration Fee',
      oneTimeFee: 'One-time registration fee for profile verification',
      showQR: 'Show QR Code for Payment',
      hideQR: 'Hide QR Code',
      scanToPay: 'Scan to Pay ₹499',
      scanQR: 'Scan QR Code',
      qrScanned: 'QR Code Scanned',
      transactionNumber: 'Transaction Number',
      enterTransaction: 'Enter transaction/reference number',
      transactionHint: 'Enter the UPI transaction ID or reference number',
      paymentScreenshot: 'Payment Screenshot',
      uploadProof: 'Upload transaction proof',
      completeProfile: 'Complete Profile & Start',
      required: '*',
      enterName: 'Enter your full name',
      enterEmail: 'Enter your email',
      enterMobile: 'Enter 10-digit mobile number',
      createPassword: 'Create a password (min 6 characters)',
      services: 'Services',
      enterServices: 'e.g., Plumbing, Electrical, Carpentry',
      location: 'Service Area / City',
      enterLocation: 'e.g., Andheri, Bandra, Mumbai',
      useCurrentLocation: 'Use Current Location',
      detectingLocation: 'Detecting location...',
      gstNumber: 'GST Number (Optional)',
      enterGST: 'Enter GST number',
      msmeNumber: 'MSME Number (Optional)',
      enterMSME: 'Enter MSME registration number',
      availabilityStatus: 'Availability Status',
      setInitialStatus: 'Set your initial status',
      changeAnytime: 'You can change this anytime from home screen',
      online: 'Online',
      busy: 'Busy',
      offline: 'Offline',
      visibleToCustomers: '✓ You will be visible to customers',
      limitedAvailability: '⚠ Limited availability will be shown',
      hiddenFromSearch: '✗ You will be hidden from search',
    },
    Hindi: {
      header: 'अपनी प्रोफ़ाइल पूरी करें',
      selectedType: 'चयनित प्रकार',
      basicDetails: 'बुनियादी विवरण',
      fullName: 'पूरा नाम',
      emailId: 'ईमेल आईडी',
      mobileNumber: 'मोबाइल नंबर',
      password: 'पासवर्ड',
      languages: 'भाषाएं (वैकल्पिक)',
      selectLanguages: 'वे भाषाएं चुनें जो आप बोल सकते हैं',
      languagesSelected: 'भाषा(एं) चयनित',
      selectLanguagesPlaceholder: 'भाषाएं चुनें',
      documents: 'दस्तावेज़',
      uploadDocuments: 'अपने पहचान दस्तावेज़ अपलोड करें',
      profilePhoto: 'प्रोफ़ाइल फ़ोटो',
      uploadPhoto: 'अपनी फ़ोटो अपलोड करें',
      aadharCard: 'आधार कार्ड',
      uploadAadhar: 'आधार कार्ड अपलोड करें',
      panCard: 'पैन कार्ड',
      uploadPan: 'पैन कार्ड अपलोड करें',
      upload: 'अपलोड',
      registrationPayment: 'पंजीकरण भुगतान',
      completePayment: 'अपनी प्रोफ़ाइल सक्रिय करने के लिए भुगतान पूरा करें',
      registrationFee: 'पंजीकरण शुल्क',
      oneTimeFee: 'प्रोफ़ाइल सत्यापन के लिए एकमुश्त पंजीकरण शुल्क',
      showQR: 'भुगतान के लिए QR कोड दिखाएं',
      hideQR: 'QR कोड छुपाएं',
      scanToPay: '₹499 भुगतान के लिए स्कैन करें',
      scanQR: 'QR कोड स्कैन करें',
      qrScanned: 'QR कोड स्कैन किया गया',
      transactionNumber: 'लेनदेन संख्या',
      enterTransaction: 'लेनदेन/संदर्भ संख्या दर्ज करें',
      transactionHint: 'UPI लेनदेन आईडी या संदर्भ संख्या दर्ज करें',
      paymentScreenshot: 'भुगतान स्क्रीनशॉट',
      uploadProof: 'लेनदेन प्रमाण अपलोड करें',
      completeProfile: 'प्रोफ़ाइल पूरा करें और शुरू करें',
      required: '*',
      enterName: 'अपना पूरा नाम दर्ज करें',
      enterEmail: 'अपना ईमेल दर्ज करें',
      enterMobile: '10 अंकों का मोबाइल नंबर दर्ज करें',
      createPassword: 'पासवर्ड बनाएं (न्यूनतम 6 अक्षर)',
      services: 'सेवाएं',
      enterServices: 'जैसे, प्लंबिंग, इलेक्ट्रिकल, बढ़ईगीरी',
      location: 'स्थान/सेवा क्षेत्र',
      enterLocation: 'जैसे, अंधेरी, बांद्रा, मुंबई',
      gstNumber: 'GST नंबर (वैकल्पिक)',
      enterGST: 'GST नंबर दर्ज करें',
      msmeNumber: 'MSME नंबर (वैकल्पिक)',
      enterMSME: 'MSME पंजीकरण नंबर दर्ज करें',
      availabilityStatus: 'उपलब्धता स्थिति',
      setInitialStatus: 'अपनी प्रारंभिक स्थिति सेट करें',
      changeAnytime: 'आप इसे होम स्क्रीन से कभी भी बदल सकते हैं',
      online: 'ऑनलाइन',
      busy: 'व्यस्त',
      offline: 'ऑफलाइन',
      visibleToCustomers: '✓ आप ग्राहकों को दिखाई देंगे',
      limitedAvailability: '⚠ सीमित उपलब्धता दिखाई जाएगी',
      hiddenFromSearch: '✗ आप खोज से छिपे रहेंगे',
    },
    Tamil: {
      header: 'உங்கள் சுயவிவரத்தை முடிக்கவும்',
      selectedType: 'தேர்ந்தெடுக்கப்பட்ட வகை',
      basicDetails: 'அடிப்படை விவரங்கள்',
      fullName: 'முழு பெயர்',
      emailId: 'மின்னஞ்சல் ஐடி',
      mobileNumber: 'மொபைல் எண்',
      password: 'கடவுச்சொல்',
      languages: 'மொழிகள் (விருப்பமானது)',
      selectLanguages: 'நீங்கள் பேசக்கூடிய மொழிகளைத் தேர்ந்தெடுக்கவும்',
      languagesSelected: 'மொழி(கள்) தேர்ந்தெடுக்கப்பட்டது',
      selectLanguagesPlaceholder: 'மொழிகளைத் தேர்ந்தெடுக்கவும்',
      documents: 'ஆவணங்கள்',
      uploadDocuments: 'உங்கள் அடையாள ஆவணங்களைப் பதிவேற்றவும்',
      profilePhoto: 'சுயவிவர புகைப்படம்',
      uploadPhoto: 'உங்கள் புகைப்படத்தைப் பதிவேற்றவும்',
      aadharCard: 'ஆதார் அட்டை',
      uploadAadhar: 'ஆதார் அட்டையைப் பதிவேற்றவும்',
      panCard: 'பான் அட்டை',
      uploadPan: 'பான் அட்டையைப் பதிவேற்றவும்',
      upload: 'பதிவேற்று',
      registrationPayment: 'பதிவு கட்டணம்',
      completePayment: 'உங்கள் சுயவிவரத்தை செயல்படுத்த கட்டணத்தை முடிக்கவும்',
      registrationFee: 'பதிவு கட்டணம்',
      oneTimeFee: 'சுயவிவர சரிபார்ப்புக்கான ஒரு முறை பதிவு கட்டணம்',
      showQR: 'கட்டணத்திற்கான QR குறியீட்டைக் காட்டு',
      hideQR: 'QR குறியீட்டை மறை',
      scanToPay: '₹499 செலுத்த ஸ்கேன் செய்யவும்',
      scanQR: 'QR குறியீட்டை ஸ்கேன் செய்யவும்',
      qrScanned: 'QR குறியீடு ஸ்கேன் செய்யப்பட்டது',
      transactionNumber: 'பரிவர்த்தனை எண்',
      enterTransaction: 'பரிவர்த்தனை/குறிப்பு எண்ணை உள்ளிடவும்',
      transactionHint: 'UPI பரிவர்த்தனை ஐடி அல்லது குறிப்பு எண்ணை உள்ளிடவும்',
      paymentScreenshot: 'கட்டண ஸ்கிரீன்ஷாட்',
      uploadProof: 'பரிவர்த்தனை ஆதாரத்தைப் பதிவேற்றவும்',
      completeProfile: 'சுயவிவரத்தை முடித்து தொடங்கவும்',
      required: '*',
      enterName: 'உங்கள் முழு பெயரை உள்ளிடவும்',
      enterEmail: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
      enterMobile: '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்',
      createPassword: 'கடவுச்சொல்லை உருவாக்கவும் (குறைந்தது 6 எழுத்துக்கள்)',
      services: 'சேவைகள்',
      enterServices: 'எ.கா., குழாய் பழுது, மின்சாரம், தச்சு வேலை',
      location: 'இடம்/சேவை பகுதிகள்',
      enterLocation: 'எ.கா., அந்தேரி, பாந்த்ரா, மும்பை',
      gstNumber: 'GST எண் (விருப்பமானது)',
      enterGST: 'GST எண்ணை உள்ளிடவும்',
      msmeNumber: 'MSME எண் (விருப்பமானது)',
      enterMSME: 'MSME பதிவு எண்ணை உள்ளிடவும்',
      availabilityStatus: 'கிடைக்கும் நிலை',
      setInitialStatus: 'உங்கள் ஆரம்ப நிலையை அமைக்கவும்',
      changeAnytime: 'நீங்கள் இதை முகப்பு திரையில் இருந்து எப்போது வேண்டுமானாலும் மாற்றலாம்',
      online: 'ஆன்லைன்',
      busy: 'பிஸி',
      offline: 'ஆஃப்லைன்',
      visibleToCustomers: '✓ நீங்கள் வாடிக்கையாளர்களுக்கு தெரியும்',
      limitedAvailability: '⚠ வரம்புக்குட்பட்ட கிடைக்கும் தன்மை காட்டப்படும்',
      hiddenFromSearch: '✗ நீங்கள் தேடலில் இருந்து மறைக்கப்படுவீர்கள்',
    },
    Kannada: {
      header: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ',
      selectedType: 'ಆಯ್ಕೆಮಾಡಿದ ಪ್ರಕಾರ',
      basicDetails: 'ಮೂಲ ವಿವರಗಳು',
      fullName: 'ಪೂರ್ಣ ಹೆಸರು',
      emailId: 'ಇಮೇಲ್ ಐಡಿ',
      mobileNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      password: 'ಪಾಸ್ವರ್ಡ್',
      languages: 'ಭಾಷೆಗಳು (ಐಚ್ಛಿಕ)',
      selectLanguages: 'ನೀವು ಮಾತನಾಡಬಲ್ಲ ಭಾಷೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      languagesSelected: 'ಭಾಷೆ(ಗಳು) ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ',
      selectLanguagesPlaceholder: 'ಭಾಷೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      documents: 'ದಾಖಲೆಗಳು',
      uploadDocuments: 'ನಿಮ್ಮ ಗುರುತಿನ ದಾಖಲೆಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ',
      profilePhoto: 'ಪ್ರೊಫೈಲ್ ಫೋಟೋ',
      uploadPhoto: 'ನಿಮ್ಮ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ',
      aadharCard: 'ಆಧಾರ್ ಕಾರ್ಡ್',
      uploadAadhar: 'ಆಧಾರ್ ಕಾರ್ಡ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ',
      panCard: 'ಪ್ಯಾನ್ ಕಾರ್ಡ್',
      uploadPan: 'ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ',
      upload: 'ಅಪ್ಲೋಡ್',
      registrationPayment: 'ನೋಂದಣಿ ಪಾವತಿ',
      completePayment: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸಕ್ರಿಯಗೊಳಿಸಲು ಪಾವತಿ ಪೂರ್ಣಗೊಳಿಸಿ',
      registrationFee: 'ನೋಂದಣಿ ಶುಲ್ಕ',
      oneTimeFee: 'ಪ್ರೊಫೈಲ್ ಪರಿಶೀಲನೆಗಾಗಿ ಒಂದು ಬಾರಿ ನೋಂದಣಿ ಶುಲ್ಕ',
      showQR: 'ಪಾವತಿಗಾಗಿ QR ಕೋಡ್ ತೋರಿಸಿ',
      hideQR: 'QR ಕೋಡ್ ಮರೆಮಾಡಿ',
      scanToPay: '₹499 ಪಾವತಿಸಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
      scanQR: 'QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
      qrScanned: 'QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗಿದೆ',
      transactionNumber: 'ವಹಿವಾಟು ಸಂಖ್ಯೆ',
      enterTransaction: 'ವಹಿವಾಟು/ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
      transactionHint: 'UPI ವಹಿವಾಟು ಐಡಿ ಅಥವಾ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
      paymentScreenshot: 'ಪಾವತಿ ಸ್ಕ್ರೀನ್ಶಾಟ್',
      uploadProof: 'ವಹಿವಾಟು ಪುರಾವೆ ಅಪ್ಲೋಡ್ ಮಾಡಿ',
      completeProfile: 'ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ಪ್ರಾರಂಭಿಸಿ',
      required: '*',
      enterName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
      enterEmail: 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',
      enterMobile: '10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
      createPassword: 'ಪಾಸ್ವರ್ಡ್ ರಚಿಸಿ (ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು)',
      services: 'ಸೇವೆಗಳು',
      enterServices: 'ಉದಾ., ಪ್ಲಂಬಿಂಗ್, ಎಲೆಕ್ಟ್ರಿಕಲ್, ಬಡಗಿ',
      location: 'ಸ್ಥಳ/ಸೇವಾ ಪ್ರದೇಶಗಳು',
      enterLocation: 'ಉದಾ., ಅಂಧೇರಿ, ಬಾಂದ್ರಾ, ಮುಂಬೈ',
      gstNumber: 'GST ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)',
      enterGST: 'GST ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
      msmeNumber: 'MSME ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)',
      enterMSME: 'MSME ನೋಂದಣಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
      availabilityStatus: 'ಲಭ್ಯತೆ ಸ್ಥಿತಿ',
      setInitialStatus: 'ನಿಮ್ಮ ಆರಂಭಿಕ ಸ್ಥಿತಿಯನ್ನು ಹೊಂದಿಸಿ',
      changeAnytime: 'ನೀವು ಇದನ್ನು ಮುಖಪುಟ ಪರದೆಯಿಂದ ಯಾವಾಗ ಬೇಕಾದರೂ ಬದಲಾಯಿಸಬಹುದು',
      online: 'ಆನ್‌ಲೈನ್',
      busy: 'ಬ್ಯುಸಿ',
      offline: 'ಆಫ್‌ಲೈನ್',
      visibleToCustomers: '✓ ನೀವು ಗ್ರಾಹಕರಿಗೆ ಗೋಚರಿಸುತ್ತೀರಿ',
      limitedAvailability: '⚠ ಸೀಮಿತ ಲಭ್ಯತೆ ತೋರಿಸಲಾಗುತ್ತದೆ',
      hiddenFromSearch: '✗ ನೀವು ಹುಡುಕಾಟದಿಂದ ಮರೆಮಾಡಲ್ಪಡುತ್ತೀರಿ',
    },
    Telugu: {
      header: 'మీ ప్రొఫైల్‌ను పూర్తి చేయండి',
      selectedType: 'ఎంచుకున్న రకం',
      basicDetails: 'ప్రాథమిక వివరాలు',
      fullName: 'పూర్తి పేరు',
      emailId: 'ఇమెయిల్ ఐడి',
      mobileNumber: 'మొబైల్ నంబర్',
      password: 'పాస్‌వర్డ్',
      languages: 'భాషలు (ఐచ్ఛికం)',
      selectLanguages: 'మీరు మాట్లాడగల భాషలను ఎంచుకోండి',
      languagesSelected: 'భాష(లు) ఎంచుకోబడింది',
      selectLanguagesPlaceholder: 'భాషలను ఎంచుకోండి',
      documents: 'పత్రాలు',
      uploadDocuments: 'మీ గుర్తింపు పత్రాలను అప్‌లోడ్ చేయండి',
      profilePhoto: 'ప్రొఫైల్ ఫోటో',
      uploadPhoto: 'మీ ఫోటోను అప్‌లోడ్ చేయండి',
      aadharCard: 'ఆధార్ కార్డ్',
      uploadAadhar: 'ఆధార్ కార్డ్ అప్‌లోడ్ చేయండి',
      panCard: 'పాన్ కార్డ్',
      uploadPan: 'పాన్ కార్డ్ అప్‌లోడ్ చేయండి',
      upload: 'అప్‌లోడ్',
      registrationPayment: 'నమోదు చెల్లింపు',
      completePayment: 'మీ ప్రొఫైల్‌ను సక్రియం చేయడానికి చెల్లింపును పూర్తి చేయండి',
      registrationFee: 'నమోదు రుసుము',
      oneTimeFee: 'ప్రొఫైల్ ధృవీకరణ కోసం ఒకసారి నమోదు రుసుము',
      showQR: 'చెల్లింపు కోసం QR కోడ్ చూపించు',
      hideQR: 'QR కోడ్ దాచు',
      scanToPay: '₹499 చెల్లించడానికి స్కాన్ చేయండి',
      scanQR: 'QR కోడ్ స్కాన్ చేయండి',
      qrScanned: 'QR కోడ్ స్కాన్ చేయబడింది',
      transactionNumber: 'లావాదేవీ సంఖ్య',
      enterTransaction: 'లావాదేవీ/సూచన సంఖ్యను నమోదు చేయండి',
      transactionHint: 'UPI లావాదేవీ ఐడి లేదా సూచన సంఖ్యను నమోదు చేయండి',
      paymentScreenshot: 'చెల్లింపు స్క్రీన్‌షాట్',
      uploadProof: 'లావాదేవీ రుజువును అప్‌లోడ్ చేయండి',
      completeProfile: 'ప్రొఫైల్ పూర్తి చేసి ప్రారంభించండి',
      required: '*',
      enterName: 'మీ పూర్తి పేరును నమోదు చేయండి',
      enterEmail: 'మీ ఇమెయిల్‌ను నమోదు చేయండి',
      enterMobile: '10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి',
      createPassword: 'పాస్‌వర్డ్ సృష్టించండి (కనీసం 6 అక్షరాలు)',
      services: 'సేవలు',
      enterServices: 'ఉదా., ప్లంబింగ్, ఎలక్ట్రికల్, వడ్రంగి',
      location: 'స్థానం/సేవా ప్రాంతాలు',
      enterLocation: 'ఉదా., అంధేరి, బాంద్రా, ముంబై',
      gstNumber: 'GST నంబర్ (ఐచ్ఛికం)',
      enterGST: 'GST నంబర్‌ను నమోదు చేయండి',
      msmeNumber: 'MSME నంబర్ (ఐచ్ఛికం)',
      enterMSME: 'MSME నమోదు నంబర్‌ను నమోదు చేయండి',
      availabilityStatus: 'లభ్యత స్థితి',
      setInitialStatus: 'మీ ప్రారంభ స్థితిని సెట్ చేయండి',
      changeAnytime: 'మీరు దీన్ని హోమ్ స్క్రీన్ నుండి ఎప్పుడైనా మార్చవచ్చు',
      online: 'ఆన్‌లైన్',
      busy: 'బిజీ',
      offline: 'ఆఫ్‌లైన్',
      visibleToCustomers: '✓ మీరు కస్టమర్‌లకు కనిపిస్తారు',
      limitedAvailability: '⚠ పరిమిత లభ్యత చూపబడుతుంది',
      hiddenFromSearch: '✗ మీరు శోధన నుండి దాచబడతారు',
    },
    Marathi: {
      header: 'तुमचे प्रोफाइल पूर्ण करा',
      selectedType: 'निवडलेला प्रकार',
      basicDetails: 'मूलभूत तपशील',
      fullName: 'पूर्ण नाव',
      emailId: 'ईमेल आयडी',
      mobileNumber: 'मोबाइल नंबर',
      password: 'पासवर्ड',
      languages: 'भाषा (पर्यायी)',
      selectLanguages: 'तुम्ही बोलू शकता त्या भाषा निवडा',
      languagesSelected: 'भाषा निवडल्या',
      selectLanguagesPlaceholder: 'भाषा निवडा',
      documents: 'कागदपत्रे',
      uploadDocuments: 'तुमची ओळख कागदपत्रे अपलोड करा',
      profilePhoto: 'प्रोफाइल फोटो',
      uploadPhoto: 'तुमचा फोटो अपलोड करा',
      aadharCard: 'आधार कार्ड',
      uploadAadhar: 'आधार कार्ड अपलोड करा',
      panCard: 'पॅन कार्ड',
      uploadPan: 'पॅन कार्ड अपलोड करा',
      upload: 'अपलोड',
      registrationPayment: 'नोंदणी पेमेंट',
      completePayment: 'तुमचे प्रोफाइल सक्रिय करण्यासाठी पेमेंट पूर्ण करा',
      registrationFee: 'नोंदणी शुल्क',
      oneTimeFee: 'प्रोफाइल पडताळणीसाठी एकवेळ नोंदणी शुल्क',
      showQR: 'पेमेंटसाठी QR कोड दाखवा',
      hideQR: 'QR कोड लपवा',
      scanToPay: '₹499 भरण्यासाठी स्कॅन करा',
      scanQR: 'QR कोड स्कॅन करा',
      qrScanned: 'QR कोड स्कॅन केला',
      transactionNumber: 'व्यवहार क्रमांक',
      enterTransaction: 'व्यवहार/संदर्भ क्रमांक प्रविष्ट करा',
      transactionHint: 'UPI व्यवहार आयडी किंवा संदर्भ क्रमांक प्रविष्ट करा',
      paymentScreenshot: 'पेमेंट स्क्रीनशॉट',
      uploadProof: 'व्यवहार पुरावा अपलोड करा',
      completeProfile: 'प्रोफाइल पूर्ण करा आणि सुरू करा',
      required: '*',
      enterName: 'तुमचे पूर्ण नाव प्रविष्ट करा',
      enterEmail: 'तुमचा ईमेल प्रविष्ट करा',
      enterMobile: '10 अंकी मोबाइल नंबर प्रविष्ट करा',
      createPassword: 'पासवर्ड तयार करा (किमान 6 वर्ण)',
      services: 'सेवा',
      enterServices: 'उदा., प्लंबिंग, इलेक्ट्रिकल, सुतारकाम',
      location: 'स्थान/सेवा क्षेत्र',
      enterLocation: 'उदा., अंधेरी, बांद्रा, मुंबई',
      gstNumber: 'GST नंबर (पर्यायी)',
      enterGST: 'GST नंबर प्रविष्ट करा',
      msmeNumber: 'MSME नंबर (पर्यायी)',
      enterMSME: 'MSME नोंदणी नंबर प्रविष्ट करा',
      availabilityStatus: 'उपलब्धता स्थिती',
      setInitialStatus: 'तुमची प्रारंभिक स्थिती सेट करा',
      changeAnytime: 'तुम्ही हे होम स्क्रीनवरून कधीही बदलू शकता',
      online: 'ऑनलाइन',
      busy: 'व्यस्त',
      offline: 'ऑफलाइन',
      visibleToCustomers: '✓ तुम्ही ग्राहकांना दिसाल',
      limitedAvailability: '⚠ मर्यादित उपलब्धता दर्शविली जाईल',
      hiddenFromSearch: '✗ तुम्ही शोधापासून लपवले जाल',
    },
    Gujarati: {
      header: 'તમારી પ્રોફાઇલ પૂર્ણ કરો',
      selectedType: 'પસંદ કરેલ પ્રકાર',
      basicDetails: 'મૂળભૂત વિગતો',
      fullName: 'પૂરું નામ',
      emailId: 'ઇમેઇલ આઇડી',
      mobileNumber: 'મોબાઇલ નંબર',
      password: 'પાસવર્ડ',
      languages: 'ભાષાઓ (વૈકલ્પિક)',
      selectLanguages: 'તમે બોલી શકો તે ભાષાઓ પસંદ કરો',
      languagesSelected: 'ભાષા(ઓ) પસંદ કરી',
      selectLanguagesPlaceholder: 'ભાષાઓ પસંદ કરો',
      documents: 'દસ્તાવેજો',
      uploadDocuments: 'તમારા ઓળખ દસ્તાવેજો અપલોડ કરો',
      profilePhoto: 'પ્રોફાઇલ ફોટો',
      uploadPhoto: 'તમારો ફોટો અપલોડ કરો',
      aadharCard: 'આધાર કાર્ડ',
      uploadAadhar: 'આધાર કાર્ડ અપલોડ કરો',
      panCard: 'પાન કાર્ડ',
      uploadPan: 'પાન કાર્ડ અપલોડ કરો',
      upload: 'અપલોડ',
      registrationPayment: 'નોંધણી ચુકવણી',
      completePayment: 'તમારી પ્રોફાઇલ સક્રિય કરવા માટે ચુકવણી પૂર્ણ કરો',
      registrationFee: 'નોંધણી ફી',
      oneTimeFee: 'પ્રોફાઇલ ચકાસણી માટે એક વખતની નોંધણી ફી',
      showQR: 'ચુકવણી માટે QR કોડ બતાવો',
      hideQR: 'QR કોડ છુપાવો',
      scanToPay: '₹499 ચૂકવવા માટે સ્કેન કરો',
      scanQR: 'QR કોડ સ્કેન કરો',
      qrScanned: 'QR કોડ સ્કેન થયો',
      transactionNumber: 'વ્યવહાર નંબર',
      enterTransaction: 'વ્યવહાર/સંદર્ભ નંબર દાખલ કરો',
      transactionHint: 'UPI વ્યવહાર આઇડી અથવા સંદર્ભ નંબર દાખલ કરો',
      paymentScreenshot: 'ચુકવણી સ્ક્રીનશોટ',
      uploadProof: 'વ્યવહાર પુરાવો અપલોડ કરો',
      completeProfile: 'પ્રોફાઇલ પૂર્ણ કરો અને શરૂ કરો',
      required: '*',
      enterName: 'તમારું પૂરું નામ દાખલ કરો',
      enterEmail: 'તમારો ઇમેઇલ દાખલ કરો',
      enterMobile: '10 અંકનો મોબાઇલ નંબર દાખલ કરો',
      createPassword: 'પાસવર્ડ બનાવો (ઓછામાં ઓછા 6 અક્ષરો)',
      services: 'સેવાઓ',
      enterServices: 'દા.ત., પ્લમ્બિંગ, ઇલેક્ટ્રિકલ, સુથારકામ',
      location: 'સ્થાન/સેવા વિસ્તારો',
      enterLocation: 'દા.ત., અંધેરી, બાંદ્રા, મુંબઈ',
      gstNumber: 'GST નંબર (વૈકલ્પિક)',
      enterGST: 'GST નંબર દાખલ કરો',
      msmeNumber: 'MSME નંબર (વૈકલ્પિક)',
      enterMSME: 'MSME નોંધણી નંબર દાખલ કરો',
      availabilityStatus: 'ઉપલબ્ધતા સ્થિતિ',
      setInitialStatus: 'તમારી પ્રારંભિક સ્થિતિ સેટ કરો',
      changeAnytime: 'તમે આને હોમ સ્ક્રીનથી ગમે ત્યારે બદલી શકો છો',
      online: 'ઓનલાઇન',
      busy: 'વ્યસ્ત',
      offline: 'ઓફલાઇન',
      visibleToCustomers: '✓ તમે ગ્રાહકોને દેખાશો',
      limitedAvailability: '⚠ મર્યાદિત ઉપલબ્ધતા બતાવવામાં આવશે',
      hiddenFromSearch: '✗ તમે શોધમાંથી છુપાવવામાં આવશો',
    },
    Bengali: {
      header: 'আপনার প্রোফাইল সম্পূর্ণ করুন',
      selectedType: 'নির্বাচিত প্রকার',
      basicDetails: 'মৌলিক বিবরণ',
      fullName: 'পূর্ণ নাম',
      emailId: 'ইমেল আইডি',
      mobileNumber: 'মোবাইল নম্বর',
      password: 'পাসওয়ার্ড',
      languages: 'ভাষা (ঐচ্ছিক)',
      selectLanguages: 'আপনি যে ভাষা বলতে পারেন তা নির্বাচন করুন',
      languagesSelected: 'ভাষা নির্বাচিত',
      selectLanguagesPlaceholder: 'ভাষা নির্বাচন করুন',
      documents: 'নথি',
      uploadDocuments: 'আপনার পরিচয় নথি আপলোড করুন',
      profilePhoto: 'প্রোফাইল ফটো',
      uploadPhoto: 'আপনার ফটো আপলোড করুন',
      aadharCard: 'আধার কার্ড',
      uploadAadhar: 'আধার কার্ড আপলোড করুন',
      panCard: 'প্যান কার্ড',
      uploadPan: 'প্যান কার্ড আপলোড করুন',
      upload: 'আপলোড',
      registrationPayment: 'নিবন্ধন পেমেন্ট',
      completePayment: 'আপনার প্রোফাইল সক্রিয় করতে পেমেন্ট সম্পূর্ণ করুন',
      registrationFee: 'নিবন্ধন ফি',
      oneTimeFee: 'প্রোফাইল যাচাইকরণের জন্য এককালীন নিবন্ধন ফি',
      showQR: 'পেমেন্টের জন্য QR কোড দেখান',
      hideQR: 'QR কোড লুকান',
      scanToPay: '₹499 প্রদান করতে স্ক্যান করুন',
      scanQR: 'QR কোড স্ক্যান করুন',
      qrScanned: 'QR কোড স্ক্যান করা হয়েছে',
      transactionNumber: 'লেনদেন নম্বর',
      enterTransaction: 'লেনদেন/রেফারেন্স নম্বর লিখুন',
      transactionHint: 'UPI লেনদেন আইডি বা রেফারেন্স নম্বর লিখুন',
      paymentScreenshot: 'পেমেন্ট স্ক্রিনশট',
      uploadProof: 'লেনদেন প্রমাণ আপলোড করুন',
      completeProfile: 'প্রোফাইল সম্পূর্ণ করুন এবং শুরু করুন',
      required: '*',
      enterName: 'আপনার পূর্ণ নাম লিখুন',
      enterEmail: 'আপনার ইমেল লিখুন',
      enterMobile: '10 সংখ্যার মোবাইল নম্বর লিখুন',
      createPassword: 'পাসওয়ার্ড তৈরি করুন (কমপক্ষে 6 অক্ষর)',
      services: 'সেবা',
      enterServices: 'যেমন, প্লাম্বিং, ইলেকট্রিক্যাল, ছুতার',
      location: 'অবস্থান/সেবা এলাকা',
      enterLocation: 'যেমন, আন্ধেরি, বান্দ্রা, মুম্বাই',
      gstNumber: 'GST নম্বর (ঐচ্ছিক)',
      enterGST: 'GST নম্বর লিখুন',
      msmeNumber: 'MSME নম্বর (ঐচ্ছিক)',
      enterMSME: 'MSME নিবন্ধন নম্বর লিখুন',
      availabilityStatus: 'উপলব্ধতার অবস্থা',
      setInitialStatus: 'আপনার প্রাথমিক অবস্থা সেট করুন',
      changeAnytime: 'আপনি এটি হোম স্ক্রিন থেকে যেকোনো সময় পরিবর্তন করতে পারেন',
      online: 'অনলাইন',
      busy: 'ব্যস্ত',
      offline: 'অফলাইন',
      visibleToCustomers: '✓ আপনি গ্রাহকদের কাছে দৃশ্যমান হবেন',
      limitedAvailability: '⚠ সীমিত উপলব্ধতা দেখানো হবে',
      hiddenFromSearch: '✗ আপনি অনুসন্ধান থেকে লুকানো থাকবেন',
    },
  };

  const t = translations[selectedLanguage] || translations.English;

  const workerTypeInfo = {
    individual: { iconName: 'person', title: 'Individual Worker' },
    crew_Team: { iconName: 'people', title: 'Crew Team' },
    contractor: { iconName: 'construct', title: 'Contractor' },
    service_provider: { iconName: 'briefcase', title: 'Service Provider' },
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Handle transaction number - only numbers
  const handleTransactionNumberChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      payment: { ...prev.payment, transactionNumber: numericValue }
    }));
  };

  // ✅ Get Current GPS Location
  const handleGetCurrentLocation = async () => {
    try {
      setFetchingLocation(true);
      console.log('📍 Fetching current location...');
      
      const result = await getCurrentLocationWithAddress();
      
      if (result.success) {
        const locationText = result.formattedAddress || `${result.city}, ${result.state}`;
        
        setFormData(prev => ({
          ...prev,
          serviceAreas: locationText,
          selectedCities: [result.city],
        }));
        
        // Show different message for fallback (coordinates only)
        if (result.fallback) {
          Alert.alert(
            '⚠️ Location Detected',
            `GPS coordinates: ${locationText}\n\nAddress lookup failed. You can edit this manually or try again.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            '✅ Location Detected',
            `Your current location: ${locationText}`,
            [{ text: 'OK' }]
          );
        }
        
        console.log('✅ Location set:', locationText);
      } else {
        console.error('❌ Location fetch failed:', result.error);
        showLocationError(result.error);
      }
    } catch (error) {
      console.error('❌ Get location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your location. Please check:\n\n• GPS is enabled\n• Internet connection is active\n• Location permission is granted\n\nOr enter your location manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setFetchingLocation(false);
    }
  };

  const toggleLanguage = (languageName) => {
    setFormData(prev => {
      const isSelected = prev.selectedLanguages.includes(languageName);
      return {
        ...prev,
        selectedLanguages: isSelected
          ? prev.selectedLanguages.filter(lang => lang !== languageName)
          : [...prev.selectedLanguages, languageName]
      };
    });
    // ✅ Auto-close menu after selection
    setShowLanguageMenu(false);
  };

  const handleDocumentUpload = (docType) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: true, // Include base64 for backend upload
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        console.log('✅ Image selected:', asset.fileName);
        
        // Create document data with base64
        const documentData = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `${docType.replace(/\s/g, '_')}_${Date.now()}.jpg`,
          base64: asset.base64 ? `data:${asset.type || 'image/jpeg'};base64,${asset.base64}` : null,
        };
        
        // Update document in state
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docType === 'Profile Photo' ? 'profilePhoto' : 
             docType === 'Aadhar Card' ? 'aadharCard' : 
             'panCard']: documentData
          }
        }));
        
        Alert.alert('Success', `${docType} uploaded successfully!`);
      }
    });
  };

  const handleQRScan = () => {
    // Mark QR as scanned
    setFormData(prev => ({
      ...prev,
      payment: { ...prev.payment, qrScanned: true }
    }));
    
    Alert.alert(
      'QR Code Scanned ✅',
      'Please complete the payment and enter the transaction details below.',
      [{ text: 'OK' }]
    );
  };

  // ✅ Real Google Pay Scanner Function
  const openGooglePayScanner = () => {
    const upiLink = 'upi://pay?pa=paasowork@paytm&pn=PaasoWork&am=499&cu=INR&tn=Registration%20Fee';
    
    Linking.canOpenURL(upiLink)
      .then((supported) => {
        if (supported) {
          Linking.openURL(upiLink);
          // Mark as scanned after opening
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              payment: { ...prev.payment, qrScanned: true }
            }));
          }, 1000);
        } else {
          Alert.alert(
            'UPI App Not Found',
            'Please install a UPI app to make payment',
            [{ text: 'OK' }]
          );
        }
      })
      .catch((err) => {
        console.error('Error opening UPI app:', err);
        Alert.alert('Error', 'Could not open payment app');
      });
  };

  const handleTransactionScreenshot = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: true, // Include base64 for backend upload
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        console.log('✅ Transaction screenshot selected:', asset.fileName);
        
        // Create screenshot data with base64
        const screenshotData = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `payment_screenshot_${Date.now()}.jpg`,
          base64: asset.base64 ? `data:${asset.type || 'image/jpeg'};base64,${asset.base64}` : null,
        };
        
        setFormData(prev => ({
          ...prev,
          payment: {
            ...prev.payment,
            transactionScreenshot: screenshotData
          }
        }));
        
        Alert.alert('Success', 'Payment screenshot uploaded successfully! ✅');
      }
    });
  };

  const handleSubmit = async () => {
    // Common validation for all worker types
    if (!formData.name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Required', 'Please enter your email');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    if (!formData.mobile.trim() || formData.mobile.length !== 10) {
      Alert.alert('Required', 'Please enter a valid 10-digit mobile number');
      return;
    }
    
    if (!formData.password.trim() || formData.password.length < 6) {
      Alert.alert('Required', 'Password must be at least 6 characters');
      return;
    }

    if (!formData.selectedCategories || formData.selectedCategories.length === 0) {
      Alert.alert('Required', 'Please select at least one service category');
      return;
    }

    if (!formData.serviceAreas || formData.serviceAreas.trim() === '') {
      Alert.alert('Required', 'Please enter your location/service area or use GPS');
      return;
    }
    
    // ✅ Validate password
    if (!formData.password || formData.password.length !== 6) {
      Alert.alert('Required', 'Please enter a 6-digit password');
      return;
    }
    
    if (!formData.payment.transactionNumber.trim()) {
      Alert.alert('Required', 'Please enter transaction number');
      return;
    }

    // Register worker with backend
    setLoading(true);
    
    try {
      console.log('🚀 Starting worker registration...');
      
      // Get FCM token for push notifications (non-blocking)
      let fcmToken = null;
      try {
        console.log('📱 Getting FCM token...');
        fcmToken = await getFCMToken();
        if (fcmToken) {
          console.log('✅ FCM Token obtained');
        } else {
          console.log('⚠️ FCM token not available, continuing without it');
        }
      } catch (error) {
        console.log('⚠️ Failed to get FCM token, continuing registration:', error.message);
        // Continue registration even if FCM fails
      }
      
      // Prepare category - use selected categories from backend
      let categoryArray = [];
      if (formData.selectedCategories && formData.selectedCategories.length > 0) {
        // ✅ Get category names from selected IDs
        categoryArray = categories
          .filter(cat => formData.selectedCategories.includes(cat._id))
          .map(cat => cat.name);
      } else if (formData.services && formData.services.trim()) {
        // Fallback: Split by comma if manual entry
        categoryArray = formData.services
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      } else if (formData.skills && formData.skills.trim()) {
        categoryArray = formData.skills
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      }
      
      // If no categories, use General
      if (categoryArray.length === 0) {
        categoryArray = ['General'];
      }

      // ✅ Map frontend workerType to backend format
      const workerTypeMapping = {
        'individual': 'Worker',
        'crew_Team': 'Crew / Team',
        'contractor': 'Contractor',
        'service_provider': 'Service Provider'
      };
      
      const backendWorkerType = workerTypeMapping[workerType] || 'Worker';

      const workerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        languages: formData.selectedLanguages.length > 0 
          ? formData.selectedLanguages 
          : [selectedLanguage],
        workerType: backendWorkerType, // ✅ Use mapped backend format
        category: categoryArray,
        serviceArea: formData.serviceAreas.trim(),
        city: formData.serviceAreas.split(',')[0]?.trim() || 'Unknown',
        teamSize: formData.teamSize ? parseInt(formData.teamSize) : 1,
        gstNumber: formData.gstNumber?.trim() || '',
        msmeNumber: formData.msmeNumber?.trim() || '',
        onboardingFee: formData.payment.transactionNumber.trim(),
        businessName: formData.businessName?.trim() || '',
        availability: formData.availability || 'online', // Send exact availability status: 'online', 'busy', or 'offline'
        online: formData.availability === 'online', // Set online to true only for 'online', false for 'busy' and 'offline'
        fcmToken: fcmToken, // ✅ Add FCM token for push notifications
        // Add documents with base64 data
        profilePhoto: formData.documents.profilePhoto?.base64 || formData.documents.profilePhoto?.uri || null,
        aadhaarDoc: formData.documents.aadharCard?.base64 || formData.documents.aadharCard?.uri || null,
        panCard: formData.documents.panCard?.base64 || formData.documents.panCard?.uri || null,
        // Add payment screenshot
        paymentScreenshot: formData.payment.transactionScreenshot?.base64 || formData.payment.transactionScreenshot?.uri || null,
      };

      console.log('📦 Worker Data to be sent:');
      console.log('   Name:', workerData.name);
      console.log('   Mobile:', workerData.mobile);
      console.log('   Email:', workerData.email);
      console.log('   Worker Type:', workerData.workerType);
      console.log('   Category:', workerData.category);
      console.log('   Service Area:', workerData.serviceArea);
      console.log('   City:', workerData.city);
      console.log('   FCM Token:', workerData.fcmToken ? 'Present' : 'Not available');
      console.log('   Availability:', workerData.availability);
      console.log('   Online:', workerData.online);
      console.log('\n📡 Sending to backend...');

      const response = await api.registerWorker(workerData);
      
      console.log('✅ Registration Response:', response);
      
      if (response.success) {
        // Prepare complete worker data for navigation
        const completeWorkerData = {
          // Use data from backend response
          _id: response.worker?._id,
          name: response.worker?.name || formData.name,
          email: response.worker?.email || formData.email,
          mobile: response.worker?.mobile || formData.mobile,
          workerType: workerType, // ✅ Keep frontend format (individual, crew_Team, etc.)
          workerTypeBackend: response.worker?.workerType || backendWorkerType, // Backend format for reference
          category: response.worker?.category || categoryArray,
          serviceArea: response.worker?.serviceArea || formData.serviceAreas,
          city: response.worker?.city || formData.serviceAreas.split(',')[0]?.trim() || 'Unknown',
          languages: response.worker?.languages || (formData.selectedLanguages.length > 0 
            ? formData.selectedLanguages 
            : [selectedLanguage]),
          selectedLanguages: response.worker?.languages || (formData.selectedLanguages.length > 0 
            ? formData.selectedLanguages 
            : [selectedLanguage]), // ✅ Also save as selectedLanguages for compatibility
          status: response.worker?.status || 'Pending',
          verified: response.worker?.verified || false,
          kycVerified: response.worker?.kycVerified || false,
          badges: response.worker?.badges || [],
          registered: true,
          // Use availability from response (backend saved value)
          availability: response.worker?.availability || formData.availability || 'online',
          online: response.worker?.online !== undefined ? response.worker.online : (formData.availability === 'online'),
          // ✅ Add services for profile display
          services: formData.services || categoryArray.join(', '),
          serviceAreas: formData.serviceAreas,
        };

        console.log('📦 Complete Worker Data for Navigation:', completeWorkerData);

        // Show success message with admin approval notice and FCM token info
        const successMessage = fcmToken 
          ? `Your registration ID is pending admin approval.\n\n✅ Push notifications enabled!\n\nYou will be notified once approved.`
          : `Your registration ID is pending admin approval.\n\nPlease wait while we verify your details. You will be notified once approved.`;
        
        Alert.alert(
          'Registration Successful! ✅',
          successMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('✅ Navigating to dashboard...');
                if (fcmToken) {
                  console.log('📱 FCM Token registered with backend');
                }
                onComplete(completeWorkerData);
              },
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', response.message || 'Please try again');
      }
    } catch (error) {
      console.error('❌ Registration Error:', error);
      
      // Extract detailed error message
      let errorMessage = 'Failed to register. Please try again.';
      let isAlreadyRegistered = false;
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check if user is already registered
        if (errorData.alreadyRegistered) {
          isAlreadyRegistered = true;
          errorMessage = errorData.message;
          
          // Show appropriate action based on status
          if (errorData.status === 'Approved') {
            Alert.alert(
              'Already Registered',
              errorMessage,
              [
                {
                  text: 'Go to Login',
                  onPress: () => onBack(), // Go back to login screen
                },
              ]
            );
            return;
          } else if (errorData.status === 'Pending') {
            // User already registered with pending status - take them to dashboard
            Alert.alert(
              'Registration Pending',
              'Your registration is already submitted and pending approval. Taking you to dashboard...',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Create worker data from existing registration
                    const existingWorkerData = {
                      name: formData.name.trim(),
                      email: formData.email.trim(),
                      mobile: formData.mobile.trim(),
                      workerType: workerType,
                      category: formData.services.split(',').map(s => s.trim()).filter(s => s.length > 0),
                      serviceArea: formData.serviceAreas.trim(),
                      city: formData.serviceAreas.split(',')[0]?.trim() || 'Unknown',
                      languages: formData.selectedLanguages.length > 0 
                        ? formData.selectedLanguages 
                        : [selectedLanguage],
                      status: 'Pending',
                      verified: false,
                      kycVerified: false,
                      registered: true,
                    };
                    onComplete(existingWorkerData);
                  },
                },
              ]
            );
            return;
          }
        }
        
        // Handle validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(e => `• ${e.message || e.msg}`).join('\n');
          errorMessage = `Validation Errors:\n${errorMessages}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('📋 Error Details:', errorMessage);
      
      if (!isAlreadyRegistered) {
        Alert.alert('Registration Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = () => {
    switch (formData.availability) {
      case 'online': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
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
            <Text style={styles.title}>{t.header}</Text>
            
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Worker Type Display */}
        <View style={styles.typeDisplayCard}>
          <View style={styles.typeDisplayIconContainer}>
            <Icon 
              name={workerTypeInfo[workerType]?.iconName} 
              size={32} 
              color={COLORS.primary} 
            />
          </View>
          <View style={styles.typeDisplayInfo}>
            <Text style={styles.typeDisplayLabel}>{t.selectedType}</Text>
            <Text style={styles.typeDisplayTitle}>
              {workerTypeInfo[workerType]?.title}
            </Text>
          </View>
        </View>

        {/* Individual Worker Form */}
        {workerType === 'individual' && (
          <>
            {/* 1️⃣ Basic Details Card - Simplified */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.stepBadge}>
                  <Icon name="person-outline" size={18} color={COLORS.white} />
                </View>
                <Text style={styles.cardTitle}>Basic Details</Text>
              </View>
              <Text style={styles.cardSubtitle}>Enter your basic information</Text>

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.fullName} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterName}
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.emailId} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterEmail}
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* Mobile Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.mobileNumber} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChangeText={(value) => {
                      const numericValue = value.replace(/[^0-9]/g, '');
                      if (numericValue.length <= 10) {
                        updateField('mobile', numericValue);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={10}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.password} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={[styles.input, passwordError && styles.inputError]}
                  placeholder="Enter 6-digit password"
                  value={formData.password}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, '');
                    if (numericValue.length <= 6) {
                      updateField('password', numericValue);
                      if (numericValue.length === 6) {
                        setPasswordError('');
                      } else if (numericValue.length > 0) {
                        setPasswordError('Password must be exactly 6 digits');
                      } else {
                        setPasswordError('');
                      }
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                />
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Languages */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.languages}</Text>
                <TouchableOpacity
                  style={styles.languageToggleButton}
                  onPress={() => setShowLanguageMenu(!showLanguageMenu)}
                  activeOpacity={0.7}
                >
                 
                  <Text style={styles.languageToggleText}>
                    {formData.selectedLanguages.length > 0
                      ? `${formData.selectedLanguages.length} ${t.languagesSelected}`
                      : t.selectLanguagesPlaceholder}
                  </Text>
                  <Icon 
                    name={showLanguageMenu ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.textSecondary} 
                  />
                </TouchableOpacity>

                {showLanguageMenu && (
                  <View style={styles.languageGridContainer}>
                    {availableLanguages.map((language) => {
                      const isSelected = formData.selectedLanguages.includes(language.name);
                      return (
                        <TouchableOpacity
                          key={language.code}
                          style={[
                            styles.languageCard,
                            isSelected && styles.languageCardSelected
                          ]}
                          onPress={() => toggleLanguage(language.name)}
                          activeOpacity={0.7}
                        >
                          {isSelected && (
                            <View style={styles.languageCheckmark}>
                              <Icon name="checkmark-circle" size={20} color={COLORS.secondary} />
                            </View>
                          )}
                          <View style={styles.languageFlagContainer}>
                            <Text style={styles.languageFlag}>{language.flag}</Text>
                          </View>
                          <Text style={styles.languageCardName}>{language.name}</Text>
                          <Text style={styles.languageCardNative}>{language.nativeName}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {formData.selectedLanguages.length > 0 && (
                  <View style={styles.selectedLanguagesInfo}>
                    <Icon name="checkmark-circle" size={18} color={COLORS.secondary} />
                    <Text style={styles.selectedLanguagesInfoText}>
                      {formData.selectedLanguages.length} {t.languagesSelected}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* 2️⃣ Service Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.stepBadge, { backgroundColor: COLORS.secondary }]}>
                  <Icon name="briefcase-outline" size={18} color={COLORS.white} />
                </View>
                <Text style={styles.cardTitle}>Service Information</Text>
              </View>
              <Text style={styles.cardSubtitle}>Tell us about your services and location</Text>

              {/* Services - Dynamic Category Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.services} <Text style={styles.required}>{t.required}</Text>
                </Text>
                
                {loadingCategories ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading services...</Text>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.categoryToggleButton}
                      onPress={() => setShowCategoryMenu(!showCategoryMenu)}
                      activeOpacity={0.7}
                    >
                      <Icon name="briefcase" size={20} color={COLORS.primary} />
                      <Text style={styles.categoryToggleText}>
                        {formData.selectedCategories.length > 0
                          ? `${formData.selectedCategories.length} service(s) selected`
                          : 'Select services'}
                      </Text>
                      <Icon 
                        name={showCategoryMenu ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={COLORS.textSecondary} 
                      />
                    </TouchableOpacity>

                    {showCategoryMenu && (
                      <View style={styles.categoryGridContainer}>
                        {categories.length === 0 ? (
                          <Text style={styles.noCategoriesText}>
                            No services available for this worker type
                          </Text>
                        ) : (
                          categories.map((category) => {
                            const isSelected = formData.selectedCategories.includes(category._id);
                            return (
                              <TouchableOpacity
                                key={category._id}
                                style={[
                                  styles.categoryCard,
                                  isSelected && styles.categoryCardSelected
                                ]}
                                onPress={() => toggleCategory(category._id)}
                                activeOpacity={0.7}
                              >
                                {isSelected && (
                                  <View style={styles.categoryCheckmark}>
                                    <Icon name="checkmark-circle" size={20} color={COLORS.secondary} />
                                  </View>
                                )}
                                <Text style={styles.categoryCardName}>{category.name}</Text>
                                </TouchableOpacity>
                            );
                          })
                        )}
                      </View>
                    )}

                    {formData.selectedCategories.length > 0 && (
                      <View style={styles.selectedCategoriesInfo}>
                        <Icon name="checkmark-circle" size={18} color={COLORS.secondary} />
                        <Text style={styles.selectedCategoriesInfoText}>
                          {formData.selectedCategories.length} service(s) selected
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </View>

              {/* Location - Text Input with Current Location Button */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>
                    {t.location} <Text style={styles.required}>{t.required}</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.currentLocationButton}
                    onPress={handleGetCurrentLocation}
                    disabled={fetchingLocation}
                    activeOpacity={0.7}
                  >
                    {fetchingLocation ? (
                      <>
                        <ActivityIndicator size="small" color={COLORS.white} />
                        <Text style={styles.currentLocationButtonText}>Detecting...</Text>
                      </>
                    ) : (
                      <>
                        <Icon name="navigate" size={16} color={COLORS.white} />
                        <Text style={styles.currentLocationButtonText}>Use Current Location</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  style={styles.input}
                  placeholder={t.enterLocation}
                  value={formData.serviceAreas}
                  onChangeText={(value) => updateField('serviceAreas', value)}
                  placeholderTextColor="#94a3b8"
                  multiline
                />
              </View>
            </View>

            {/* 3️⃣ Documents Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.stepBadge, { backgroundColor: '#8b5cf6' }]}>
                  <Icon name="document-text-outline" size={18} color={COLORS.white} />
                </View>
                <Text style={styles.cardTitle}>Documents</Text>
              </View>
              <Text style={styles.cardSubtitle}>{t.uploadDocuments}</Text>

              {/* Profile Photo */}
              <View style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Icon name="person-circle" size={32} color={COLORS.primary} />
                  <View style={styles.documentTextContainer}>
                    <Text style={styles.documentTitle}>{t.profilePhoto}</Text>
                    <Text style={styles.documentSubtitle}>{t.uploadPhoto}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleDocumentUpload('Profile Photo')}
                  activeOpacity={0.7}
                >
                  <Icon name="cloud-upload" size={20} color={COLORS.white} />
                  <Text style={styles.uploadButtonText}>{t.upload}</Text>
                </TouchableOpacity>
              </View>

              {/* Aadhar Card */}
              <View style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Icon name="card" size={32} color={COLORS.primary} />
                  <View style={styles.documentTextContainer}>
                    <Text style={styles.documentTitle}>{t.aadharCard}</Text>
                    <Text style={styles.documentSubtitle}>{t.uploadAadhar}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleDocumentUpload('Aadhar Card')}
                  activeOpacity={0.7}
                >
                  <Icon name="cloud-upload" size={20} color={COLORS.white} />
                  <Text style={styles.uploadButtonText}>{t.upload}</Text>
                </TouchableOpacity>
              </View>

              {/* PAN Card */}
              <View style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Icon name="document-text" size={32} color={COLORS.primary} />
                  <View style={styles.documentTextContainer}>
                    <Text style={styles.documentTitle}>{t.panCard}</Text>
                    <Text style={styles.documentSubtitle}>{t.uploadPan}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleDocumentUpload('PAN Card')}
                  activeOpacity={0.7}
                >
                  <Icon name="cloud-upload" size={20} color={COLORS.white} />
                  <Text style={styles.uploadButtonText}>{t.upload}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 4️⃣ Payment Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.stepBadge, { backgroundColor: '#f59e0b' }]}>
                  <Icon name="card-outline" size={18} color={COLORS.white} />
                </View>
                <Text style={styles.cardTitle}>Registration Payment</Text>
              </View>
              <Text style={styles.cardSubtitle}>Complete payment to activate your profile</Text>

              {/* Registration Fee Display */}
              <View style={styles.registrationFeeBox}>
                <Text style={styles.registrationFeeLabel}>Registration Fee</Text>
                <Text style={styles.registrationFeeAmount}>₹1</Text>
                <Text style={styles.registrationFeeNote}>One-time registration fee</Text>
              </View>

              {/* QR Code Toggle Button */}
              <TouchableOpacity
                style={styles.qrToggleButton}
                onPress={() => setShowQRCode(!showQRCode)}
                activeOpacity={0.7}
              >
                <Icon name="qr-code" size={24} color={COLORS.primary} />
                <Text style={styles.qrToggleText}>
                  {showQRCode ? 'Hide QR Code' : 'Show QR Code for Payment'}
                </Text>
                <Icon 
                  name={showQRCode ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>

              {/* QR Code Section - Only show when toggled */}
              {showQRCode && (
                <View style={styles.qrPaymentSection}>
                  <View style={styles.qrPaymentHeader}>
                    <Icon name="qr-code-outline" size={24} color={COLORS.primary} />
                    <Text style={styles.qrPaymentTitle}>Scan QR Code to Pay</Text>
                  </View>

                  {/* QR Code Display */}
                  <View style={styles.qrCodeDisplayBox}>
                    <Image 
                      source={{ 
                        uri: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=psipl1@kbl&pn=Parnets Software India Pvt Ltd&am=1&cu=INR&tn=Registration Fee')}`
                      }} 
                      style={styles.qrCodeDisplayImage} 
                      resizeMode="contain" 
                    />
                  </View>

                  {/* Company Details Box */}
                  <View style={styles.companyDetailsBox}>
                    <Text style={styles.companyName}>Parnets Software India Pvt Ltd</Text>
                    <View style={styles.upiDetailRow}>
                      <Text style={styles.upiDetailLabel}>UPI ID:</Text>
                      <Text style={styles.upiDetailValue}>psipl1@kbl</Text>
                    </View>
                    <View style={styles.upiDetailRow}>
                      <Text style={styles.upiDetailLabel}>Amount:</Text>
                      <Text style={styles.upiDetailValue}>₹1</Text>
                    </View>
                  </View>

                  {/* Payment Note */}
                  <View style={styles.paymentNoteBox}>
                    <Icon name="information-circle" size={20} color="#f59e0b" />
                    <Text style={styles.paymentNoteText}>
                      After payment, enter your transaction number below
                    </Text>
                  </View>
                </View>
              )}

              {/* Spacing after toggle button - always visible for consistent layout */}
              <View style={{ height: 24 }} />

              {/* Transaction Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Transaction Number / UTR <Text style={styles.optionalText}>(Optional)</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="ENTER TRANSACTION ID IF AVAILABLE (E.G., 123456789012)"
                  value={formData.payment.transactionNumber}
                  onChangeText={handleTransactionNumberChange}
                  keyboardType="default"
                  maxLength={50}
                  placeholderTextColor="#94a3b8"
                />
                <View style={styles.transactionHints}>
                
                  <Text style={styles.transactionHint}>• If provided, must be at least 12 characters (letters and numbers only)</Text>
                  <Text style={[styles.transactionHint, { color: '#3b82f6' }]}>
                    • You can submit without transaction number - admin will verify from screenshot
                  </Text>
                </View>
              </View>

              {/* Payment Screenshot Upload */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Payment Screenshot <Text style={styles.required}>*</Text>
                </Text>
                
                <TouchableOpacity
                  style={styles.screenshotUploadBox}
                  onPress={handleTransactionScreenshot}
                  activeOpacity={0.7}
                >
                  {formData.payment.transactionScreenshot ? (
                    <View style={styles.screenshotPreview}>
                      <Image 
                        source={{ uri: formData.payment.transactionScreenshot.uri }} 
                        style={styles.screenshotPreviewImage}
                        resizeMode="cover"
                      />
                      <View style={styles.screenshotOverlay}>
                        <Icon name="checkmark-circle" size={40} color="#10b981" />
                        <Text style={styles.screenshotUploadedText}>Screenshot Uploaded</Text>
                        <Text style={styles.screenshotChangeText}>Tap to change</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.screenshotUploadPlaceholder}>
                      <Icon name="cloud-upload-outline" size={48} color="#94a3b8" />
                      <Text style={styles.screenshotUploadTitle}>Upload Payment Screenshot</Text>
                      <Text style={styles.screenshotUploadSubtitle}>
                        Click to select image from your device
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Other Worker Types Form - Simplified to match Individual Worker */}
        {workerType !== 'individual' && (
          <>
            {/* 1️⃣ Basic Details Card - Simplified */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.stepBadge}>
                  <Icon name="person-outline" size={18} color={COLORS.white} />
                </View>
                <Text style={styles.cardTitle}>Basic Details</Text>
              </View>
              <Text style={styles.cardSubtitle}>Enter your basic information</Text>

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.fullName} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterName}
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.emailId} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterEmail}
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* Mobile Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.mobileNumber} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChangeText={(value) => {
                      const numericValue = value.replace(/[^0-9]/g, '');
                      if (numericValue.length <= 10) {
                        updateField('mobile', numericValue);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={10}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.password} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={[styles.input, passwordError && styles.inputError]}
                  placeholder="Enter 6-digit password"
                  value={formData.password}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, '');
                    if (numericValue.length <= 6) {
                      updateField('password', numericValue);
                      if (numericValue.length === 6) {
                        setPasswordError('');
                      } else if (numericValue.length > 0) {
                        setPasswordError('Password must be exactly 6 digits');
                      } else {
                        setPasswordError('');
                      }
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                />
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Languages */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.languages}</Text>
                <TouchableOpacity
                  style={styles.languageToggleButton}
                  onPress={() => setShowLanguageMenu(!showLanguageMenu)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageToggleText}>
                    {formData.selectedLanguages.length > 0
                      ? `${formData.selectedLanguages.length} ${t.languagesSelected}`
                      : t.selectLanguagesPlaceholder}
                  </Text>
                  <Icon 
                    name={showLanguageMenu ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.textSecondary} 
                  />
                </TouchableOpacity>

                {showLanguageMenu && (
                  <View style={styles.languageGridContainer}>
                    {availableLanguages.map((language) => {
                      const isSelected = formData.selectedLanguages.includes(language.name);
                      return (
                        <TouchableOpacity
                          key={language.code}
                          style={[
                            styles.languageCard,
                            isSelected && styles.languageCardSelected
                          ]}
                          onPress={() => toggleLanguage(language.name)}
                          activeOpacity={0.7}
                        >
                          {isSelected && (
                            <View style={styles.languageCheckmark}>
                              <Icon name="checkmark-circle" size={20} color={COLORS.secondary} />
                            </View>
                          )}
                          <View style={styles.languageFlagContainer}>
                            <Text style={styles.languageFlag}>{language.flag}</Text>
                          </View>
                          <Text style={styles.languageCardName}>{language.name}</Text>
                          <Text style={styles.languageCardNative}>{language.nativeName}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {formData.selectedLanguages.length > 0 && (
                  <View style={styles.selectedLanguagesInfo}>
                    <Icon name="checkmark-circle" size={18} color={COLORS.secondary} />
                    <Text style={styles.selectedLanguagesInfoText}>
                      {formData.selectedLanguages.length} {t.languagesSelected}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* 2️⃣ Service Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.stepBadge, { backgroundColor: COLORS.secondary }]}>
                  <Icon name="briefcase-outline" size={18} color={COLORS.white} />
                </View>
                <Text style={styles.cardTitle}>Service Information</Text>
              </View>
              <Text style={styles.cardSubtitle}>Tell us about your services and location</Text>

              {/* Services - Dynamic Category Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.services} <Text style={styles.required}>{t.required}</Text>
                </Text>
                
                {loadingCategories ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading services...</Text>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.categoryToggleButton}
                      onPress={() => setShowCategoryMenu(!showCategoryMenu)}
                      activeOpacity={0.7}
                    >
                      <Icon name="briefcase" size={20} color={COLORS.primary} />
                      <Text style={styles.categoryToggleText}>
                        {formData.selectedCategories.length > 0
                          ? `${formData.selectedCategories.length} service(s) selected`
                          : 'Select services'}
                      </Text>
                      <Icon 
                        name={showCategoryMenu ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={COLORS.textSecondary} 
                      />
                    </TouchableOpacity>

                    {showCategoryMenu && (
                      <View style={styles.categoryGridContainer}>
                        {categories.length === 0 ? (
                          <Text style={styles.noCategoriesText}>
                            No services available for this worker type
                          </Text>
                        ) : (
                          categories.map((category) => {
                            const isSelected = formData.selectedCategories.includes(category._id);
                            return (
                              <TouchableOpacity
                                key={category._id}
                                style={[
                                  styles.categoryCard,
                                  isSelected && styles.categoryCardSelected
                                ]}
                                onPress={() => toggleCategory(category._id)}
                                activeOpacity={0.7}
                              >
                                {isSelected && (
                                  <View style={styles.categoryCheckmark}>
                                    <Icon name="checkmark-circle" size={20} color={COLORS.secondary} />
                                  </View>
                                )}
                                <Text style={styles.categoryCardName}>{category.name}</Text>
                                </TouchableOpacity>
                            );
                          })
                        )}
                      </View>
                    )}

                    {formData.selectedCategories.length > 0 && (
                      <View style={styles.selectedCategoriesInfo}>
                        <Icon name="checkmark-circle" size={18} color={COLORS.secondary} />
                        <Text style={styles.selectedCategoriesInfoText}>
                          {formData.selectedCategories.length} service(s) selected
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </View>

              {/* Location - Text Input with Current Location Button */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>
                    {t.location} <Text style={styles.required}>{t.required}</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.currentLocationButton}
                    onPress={handleGetCurrentLocation}
                    disabled={fetchingLocation}
                    activeOpacity={0.7}
                  >
                    {fetchingLocation ? (
                      <>
                        <ActivityIndicator size="small" color={COLORS.white} />
                        <Text style={styles.currentLocationButtonText}>Detecting...</Text>
                      </>
                    ) : (
                      <>
                        <Icon name="navigate" size={16} color={COLORS.white} />
                        <Text style={styles.currentLocationButtonText}>Use Current Location</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  style={styles.input}
                  placeholder={t.enterLocation}
                  value={formData.serviceAreas}
                  onChangeText={(value) => updateField('serviceAreas', value)}
                  placeholderTextColor="#94a3b8"
                  multiline
                />
              </View>

              {/* Number of Team Members - Only for crew_Team */}
              {workerType === 'crew_Team' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Number of Team Members <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.teamMemberInputContainer}>
                    <TextInput
                      style={styles.teamMemberInput}
                      value={formData.teamSize}
                      onChangeText={(value) => {
                        const numValue = value.replace(/[^0-9]/g, '');
                        updateField('teamSize', numValue);
                      }}
                      keyboardType="numeric"
                      placeholderTextColor="#94a3b8"
                      placeholder="Enter number of people in your team"
                    />
                    <View style={styles.teamMemberArrows}>
                      <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={() => {
                          const currentSize = parseInt(formData.teamSize) || 0;
                          updateField('teamSize', String(currentSize + 1));
                        }}
                        activeOpacity={0.7}
                      >
                        <Icon name="chevron-up" size={16} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                      <View style={styles.arrowDivider} />
                      <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={() => {
                          const currentSize = parseInt(formData.teamSize) || 0;
                          if (currentSize > 0) {
                            updateField('teamSize', String(currentSize - 1));
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Icon name="chevron-down" size={16} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.hint}>
                    {formData.teamSize && parseInt(formData.teamSize) > 0
                      ? `${formData.teamSize} member${parseInt(formData.teamSize) > 1 ? 's' : ''} selected for team registration`
                      : 'Minimum 2 members required for team registration'}
                  </Text>
                </View>
              )}
            </View>

            {/* 3️⃣ Documents Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.stepBadge, { backgroundColor: '#8b5cf6' }]}>
                  <Icon name="document-text-outline" size={18} color={COLORS.white} />
                </View>
                <Text style={styles.cardTitle}>Documents</Text>
              </View>
              <Text style={styles.cardSubtitle}>Upload your identity documents</Text>

              {/* Profile Photo */}
              <View style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Icon name="person-circle" size={32} color={COLORS.primary} />
                  <View style={styles.documentTextContainer}>
                    <Text style={styles.documentTitle}>{t.profilePhoto}</Text>
                    <Text style={styles.documentSubtitle}>{t.uploadPhoto}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleDocumentUpload('Profile Photo')}
                  activeOpacity={0.7}
                >
                  <Icon name="cloud-upload" size={20} color={COLORS.white} />
                  <Text style={styles.uploadButtonText}>{t.upload}</Text>
                </TouchableOpacity>
              </View>

              {/* Aadhar Card */}
              <View style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Icon name="card" size={32} color={COLORS.primary} />
                  <View style={styles.documentTextContainer}>
                    <Text style={styles.documentTitle}>
                      {t.aadharCard} <Text style={styles.required}>*</Text>
                    </Text>
                    <Text style={styles.documentSubtitle}>{t.uploadAadhar}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleDocumentUpload('Aadhar Card')}
                  activeOpacity={0.7}
                >
                  <Icon name="cloud-upload" size={20} color={COLORS.white} />
                  <Text style={styles.uploadButtonText}>{t.upload}</Text>
                </TouchableOpacity>
              </View>

              {/* PAN Card */}
              <View style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Icon name="document-text" size={32} color={COLORS.primary} />
                  <View style={styles.documentTextContainer}>
                    <Text style={styles.documentTitle}>
                      {t.panCard} <Text style={styles.required}>*</Text>
                    </Text>
                    <Text style={styles.documentSubtitle}>{t.uploadPan}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleDocumentUpload('PAN Card')}
                  activeOpacity={0.7}
                >
                  <Icon name="cloud-upload" size={20} color={COLORS.white} />
                  <Text style={styles.uploadButtonText}>{t.upload}</Text>
                </TouchableOpacity>
              </View>

              {/* GST Certificate - For crew_Team, contractor, and service_provider */}
              {(workerType === 'crew_Team' || workerType === 'contractor' || workerType === 'service_provider') && (
                <>
                  <View style={styles.documentItem}>
                    <View style={styles.documentInfo}>
                      <Icon name="document" size={32} color={COLORS.primary} />
                      <View style={styles.documentTextContainer}>
                        <Text style={styles.documentTitle}>GST Certificate (Optional)</Text>
                        <Text style={styles.documentSubtitle}>Upload GST registration certificate</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => handleDocumentUpload('GST Certificate')}
                      activeOpacity={0.7}
                    >
                      <Icon name="cloud-upload" size={20} color={COLORS.white} />
                      <Text style={styles.uploadButtonText}>{t.upload}</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* GST Number Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>GST Number (Optional)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
                      value={formData.gstNumber}
                      onChangeText={(value) => updateField('gstNumber', value.toUpperCase())}
                      autoCapitalize="characters"
                      placeholderTextColor="#94a3b8"
                      maxLength={15}
                    />
                  </View>
                </>
              )}

              {/* MSME Certificate - For crew_Team, contractor, and service_provider */}
              {(workerType === 'crew_Team' || workerType === 'contractor' || workerType === 'service_provider') && (
                <>
                  <View style={styles.documentItem}>
                    <View style={styles.documentInfo}>
                      <Icon name="ribbon" size={32} color={COLORS.primary} />
                      <View style={styles.documentTextContainer}>
                        <Text style={styles.documentTitle}>MSME Certificate (Optional)</Text>
                        <Text style={styles.documentSubtitle}>Upload MSME registration certificate</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => handleDocumentUpload('MSME Certificate')}
                      activeOpacity={0.7}
                    >
                      <Icon name="cloud-upload" size={20} color={COLORS.white} />
                      <Text style={styles.uploadButtonText}>{t.upload}</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* MSME Number Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>MSME Number (Optional)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter MSME registration number"
                      value={formData.msmeNumber}
                      onChangeText={(value) => updateField('msmeNumber', value.toUpperCase())}
                      autoCapitalize="characters"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </>
              )}
            </View>

            {/* 4️⃣ Payment Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.stepBadge, { backgroundColor: '#10b981' }]}>
                  <Icon name="card-outline" size={18} color={COLORS.white} />
                </View>
                <Text style={styles.cardTitle}>Registration Payment</Text>
              </View>
              <Text style={styles.cardSubtitle}>Complete payment to activate your profile</Text>

              {/* Payment Amount Info */}
              <View style={styles.paymentInfoBox}>
                <View style={styles.paymentInfoHeader}>
                  <Icon name="cash" size={28} color={COLORS.secondary} />
                  <View style={styles.paymentInfoTextContainer}>
                    <Text style={styles.paymentInfoLabel}>{t.registrationFee}</Text>
                    <Text style={styles.paymentInfoAmount}>₹1</Text>
                  </View>
                </View>
                <Text style={styles.paymentInfoNote}>
                  {t.oneTimeFee}
                </Text>
              </View>

              {/* QR Code Toggle Button */}
              <TouchableOpacity
                style={[
                  styles.qrToggleButton,
                  showQRCode && styles.qrToggleButtonActive
                ]}
                onPress={() => setShowQRCode(!showQRCode)}
                activeOpacity={0.7}
              >
                <Icon 
                  name={showQRCode ? "qr-code" : "qr-code-outline"} 
                  size={24} 
                  color={showQRCode ? COLORS.white : COLORS.primary} 
                />
                <Text style={[
                  styles.qrToggleText,
                  showQRCode && styles.qrToggleTextActive
                ]}>
                  {showQRCode ? t.hideQR : t.showQR}
                </Text>
                <Icon 
                  name={showQRCode ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={showQRCode ? COLORS.white : COLORS.textSecondary} 
                />
              </TouchableOpacity>

              {/* QR Code Section - Only show when toggled */}
              {showQRCode && (
                <View style={styles.qrPaymentSection}>
                  <View style={styles.qrPaymentHeader}>
                    <Icon name="qr-code-outline" size={24} color={COLORS.primary} />
                    <Text style={styles.qrPaymentTitle}>Scan QR Code to Pay</Text>
                  </View>

                  {/* QR Code Display */}
                  <View style={styles.qrCodeDisplayBox}>
                    <Image 
                      source={{ 
                        uri: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=psipl1@kbl&pn=Parnets Software India Pvt Ltd&am=1&cu=INR&tn=Registration Fee')}`
                      }} 
                      style={styles.qrCodeDisplayImage} 
                      resizeMode="contain" 
                    />
                  </View>

                  {/* Company Details Box */}
                  <View style={styles.companyDetailsBox}>
                    <Text style={styles.companyName}>Parnets Software India Pvt Ltd</Text>
                    <View style={styles.upiDetailRow}>
                      <Text style={styles.upiDetailLabel}>UPI ID:</Text>
                      <Text style={styles.upiDetailValue}>psipl1@kbl</Text>
                    </View>
                    <View style={styles.upiDetailRow}>
                      <Text style={styles.upiDetailLabel}>Amount:</Text>
                      <Text style={styles.upiDetailValue}>₹1</Text>
                    </View>
                  </View>

                  {/* Payment Note */}
                  <View style={styles.paymentNoteBox}>
                    <Icon name="information-circle" size={20} color="#f59e0b" />
                    <Text style={styles.paymentNoteText}>
                      After payment, enter your transaction number below
                    </Text>
                  </View>
                </View>
              )}

              {/* Spacing after toggle button - always visible for consistent layout */}
              <View style={{ height: 24 }} />

              {/* Transaction Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Transaction Number / UTR <Text style={styles.optionalText}>(Optional)</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="ENTER TRANSACTION ID IF AVAILABLE (E.G., 123456789012)"
                  value={formData.payment.transactionNumber}
                  onChangeText={handleTransactionNumberChange}
                  keyboardType="default"
                  maxLength={50}
                  placeholderTextColor="#94a3b8"
                />
                <View style={styles.transactionHints}>
                
                  <Text style={styles.transactionHint}>• If provided, must be at least 12 characters (letters and numbers only)</Text>
                  <Text style={[styles.transactionHint, { color: '#3b82f6' }]}>
                    • You can submit without transaction number - admin will verify from screenshot
                  </Text>
                </View>
              </View>

              {/* Payment Screenshot Upload */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Payment Screenshot <Text style={styles.required}>*</Text>
                </Text>
                
                <TouchableOpacity
                  style={styles.screenshotUploadBox}
                  onPress={handleTransactionScreenshot}
                  activeOpacity={0.7}
                >
                  {formData.payment.transactionScreenshot ? (
                    <View style={styles.screenshotPreview}>
                      <Image 
                        source={{ uri: formData.payment.transactionScreenshot.uri }} 
                        style={styles.screenshotPreviewImage}
                        resizeMode="cover"
                      />
                      <View style={styles.screenshotOverlay}>
                        <Icon name="checkmark-circle" size={40} color="#10b981" />
                        <Text style={styles.screenshotUploadedText}>Screenshot Uploaded</Text>
                        <Text style={styles.screenshotChangeText}>Tap to change</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.screenshotUploadPlaceholder}>
                      <Icon name="cloud-upload-outline" size={48} color="#94a3b8" />
                      <Text style={styles.screenshotUploadTitle}>Upload Payment Screenshot</Text>
                      <Text style={styles.screenshotUploadSubtitle}>
                        Click to select image from your device
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Availability Card - For ALL Worker Types */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🟢 {t.availabilityStatus}</Text>
          
          <View style={styles.availabilityInfo}>
            <Text style={styles.availabilityLabel}>{t.setInitialStatus}</Text>
            <Text style={styles.availabilitySubtext}>
              {t.changeAnytime}
            </Text>
          </View>

          <View style={styles.availabilityButtons}>
            {['online', 'busy', 'offline'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.availabilityButton,
                  formData.availability === status && {
                    backgroundColor: getAvailabilityColor(),
                    borderColor: getAvailabilityColor(),
                  },
                ]}
                onPress={() => updateField('availability', status)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.availabilityButtonText,
                    formData.availability === status && styles.availabilityButtonTextActive,
                  ]}
                >
                  {status === 'online' && '🟢'}
                  {status === 'busy' && '🟡'}
                  {status === 'offline' && '🔴'}
                  {' '}
                  {status === 'online' ? t.online : status === 'busy' ? t.busy : t.offline}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.statusHintBox}>
            <Text style={styles.statusHint}>
              {formData.availability === 'online' && t.visibleToCustomers}
              {formData.availability === 'busy' && t.limitedAvailability}
              {formData.availability === 'offline' && t.hiddenFromSearch}
            </Text>
          </View>
        </View>

        {/* Info Box */}
       
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color={COLORS.white} />
              <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>Registering...</Text>
            </>
          ) : (
            <Text style={styles.submitButtonText}>{t.completeProfile}</Text>
          )}
        </TouchableOpacity>
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
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
  },
  typeDisplayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#86efac',
  },
  typeDisplayIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  typeDisplayIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  typeDisplayInfo: {
    flex: 1,
  },
  typeDisplayLabel: {
    fontSize: 12,
    color: COLORS.accent,
    marginBottom: 4,
    fontWeight: '600',
  },
  typeDisplayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    backgroundColor: '#fef3e2',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fed7aa',
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 48,
    textAlignVertical: 'center',
    paddingTop: 12,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  teamMemberInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamMemberInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  teamMemberArrows: {
    position: 'absolute',
    right: 2,
    top: 2,
    bottom: 2,
    width: 40,
    backgroundColor: COLORS.background,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  arrowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  arrowDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  currentLocationButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    minHeight: 50,
    maxHeight: 100,
  },
  gpsButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  availabilityInfo: {
    marginBottom: 16,
  },
  availabilityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  availabilitySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  availabilityButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  availabilityButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  availabilityButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  availabilityButtonTextActive: {
    color: COLORS.white,
  },
  statusHintBox: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
  },
  statusHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textLight,
    elevation: 0,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  languageToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: COLORS.white,
  },
  languageToggleText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: COLORS.white,
  },
  languageSelectorText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  languageGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  languageCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    minHeight: 110,
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  languageCardSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: COLORS.primary,
    borderWidth: 2.5,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  languageCheckmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1,
  },
  languageFlagContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  languageFlag: {
    fontSize: 32,
  },
  languageCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
    textAlign: 'center',
  },
  languageCardNative: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedLanguagesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  selectedLanguagesInfoText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  languageList: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  languageItemSelected: {
    backgroundColor: '#f0f9ff',
  },
  languageItemContent: {
    flex: 1,
  },
  languageName: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageNativeName: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  selectedLanguagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  selectedLanguageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef3e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  selectedLanguageText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  documentTextContainer: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  documentSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  paymentInfoBox: {
    backgroundColor: '#fef3e2',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fed7aa',
  },
  paymentInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  paymentInfoTextContainer: {
    flex: 1,
  },
  paymentInfoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  paymentInfoAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  paymentInfoNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  qrSection: {
    marginBottom: 20,
  },
  qrToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: COLORS.white,
  },
  qrToggleText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  qrCodeContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  scanToPayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  qrCodePlaceholder: {
    width: 280,
    height: 280,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
    marginBottom: 16,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    padding: 16,
  },
  qrCodeImage: {
    width: 240,
    height: 240,
  },
  qrCodeImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodePattern: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  qrCodePatternText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000',
    letterSpacing: 0,
  },
  qrCodeAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },
  qrCodeText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  qrCodeHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  qrActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  scanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
  },
  scanButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  successBadgeText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  // ✅ Improved QR Code Scanner Styles
  qrCodeBox: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.primary,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  googlePayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  googlePayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4285f4',
    letterSpacing: 0.5,
  },
  qrCodeWrapper: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  qrCodeImage: {
    width: 240,
    height: 240,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  amountLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1,
  },
  upiIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 16,
  },
  upiIdText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  scanInstructions: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  googlePayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#4285f4',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginTop: 16,
    elevation: 6,
    shadowColor: '#4285f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  googlePayButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alternativeAppsContainer: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  alternativeAppsText: {
    fontSize: 12,
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  googlePayUPIText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  googlePayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#4285f4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#4285f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  googlePayButtonDisabled: {
    backgroundColor: '#9ca3af',
    elevation: 0,
  },
  googlePayButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  manualScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  manualScanText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  googlePaySuccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#d1fae5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  googlePaySuccessText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10b981',
  },
  paymentInstructions: {
    backgroundColor: '#fef3c7',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 10,
  },
  instructionItem: {
    fontSize: 13,
    color: '#92400e',
    marginBottom: 6,
    lineHeight: 18,
  },
  // ✅ Category Selector Styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoryToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: COLORS.white,
  },
  categoryToggleText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  categoryGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  noCategoriesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  categoryCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    position: 'relative',
    minHeight: 110,
  },
  categoryCardSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: '#fef3e2',
  },
  categoryCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCardDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedCategoriesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d1fae5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  selectedCategoriesInfoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  // ✅ City Selector Styles
  cityToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: COLORS.white,
    minHeight: 50,
  },
  cityToggleText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  cityGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  citySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 12,
    width: '100%',
  },
  citySearchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  cityCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    position: 'relative',
    minHeight: 90,
  },
  cityCardSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: '#fef3e2',
  },
  cityCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  cityCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 8,
  },
  cityCardNameSelected: {
    color: COLORS.secondary,
  },
  selectedCitiesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d1fae5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  selectedCitiesInfoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  // New Payment Section Styles
  registrationFeeBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  registrationFeeLabel: {
    fontSize: 14,
    color: '#78716c',
    fontWeight: '500',
    marginBottom: 8,
  },
  registrationFeeAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 4,
  },
  registrationFeeNote: {
    fontSize: 13,
    color: '#78716c',
    fontWeight: '400',
  },
  qrPaymentSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qrPaymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  qrPaymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  qrCodeDisplayBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 16,
  },
  qrCodeDisplayImage: {
    width: 250,
    height: 250,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  companyDetailsBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  upiDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  upiDetailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  upiDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  paymentNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  paymentNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#78716c',
    fontWeight: '500',
    lineHeight: 18,
  },
  optionalText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  transactionHints: {
    marginTop: 4,
    gap: 8,
  },
  transactionHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  screenshotUploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  screenshotUploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  screenshotUploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  screenshotUploadSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  screenshotPreview: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  screenshotPreviewImage: {
    width: '100%',
    height: '100%',
  },
  screenshotOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenshotUploadedText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginTop: 8,
  },
  screenshotChangeText: {
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 4,
  },
});

export default ProfileDetailsScreen;
