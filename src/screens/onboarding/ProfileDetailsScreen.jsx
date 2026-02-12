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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';

const ProfileDetailsScreen = ({ workerType, selectedLanguage = 'English', onComplete, onBack }) => {
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

  const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  ];

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
      location: 'Location/Service Areas',
      enterLocation: 'e.g., Andheri, Bandra, Mumbai',
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
    individual: { icon: '👤', title: 'Individual Worker' },
    crew_leader: { icon: '👥', title: 'Crew Leader' },
    contractor: { icon: '🏗️', title: 'Contractor' },
    service_provider: { icon: '🧰', title: 'Service Provider' },
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
  };

  const handleDocumentUpload = (docType) => {
    // Placeholder for document upload functionality
    Alert.alert('Document Upload', `Upload ${docType} functionality will be implemented`);
    // In real implementation, use react-native-image-picker or similar
  };

  const handleQRScan = () => {
    // Placeholder for QR code scanning
    Alert.alert('QR Scanner', 'QR code scanner will open here');
    // In real implementation, use react-native-camera or react-native-qrcode-scanner
    setFormData(prev => ({
      ...prev,
      payment: { ...prev.payment, qrScanned: true }
    }));
  };

  const handleTransactionScreenshot = () => {
    // Placeholder for screenshot upload
    Alert.alert('Upload Screenshot', 'Transaction screenshot upload will be implemented');
    // In real implementation, use react-native-image-picker
  };

  const handleSubmit = () => {
    // Validation for Individual Worker
    if (workerType === 'individual') {
      if (!formData.name.trim()) {
        Alert.alert('Required', 'Please enter your name');
        return;
      }
      if (!formData.email.trim()) {
        Alert.alert('Required', 'Please enter your email');
        return;
      }
      if (!formData.mobile.trim() || formData.mobile.length < 10) {
        Alert.alert('Required', 'Please enter a valid mobile number');
        return;
      }
      if (!formData.password.trim() || formData.password.length < 6) {
        Alert.alert('Required', 'Password must be at least 6 characters');
        return;
      }
      if (!formData.payment.transactionNumber.trim()) {
        Alert.alert('Required', 'Please enter transaction number');
        return;
      }
    } else {
      // Validation for other worker types
      if (!formData.name.trim()) {
        Alert.alert('Required', 'Please enter your name');
        return;
      }
      
      if ((workerType === 'service_provider' || workerType === 'contractor') && !formData.businessName.trim()) {
        Alert.alert('Required', 'Please enter your business name');
        return;
      }

      if (!formData.skills.trim()) {
        Alert.alert('Required', 'Please enter your skills');
        return;
      }

      if (!formData.serviceAreas.trim()) {
        Alert.alert('Required', 'Please enter service areas');
        return;
      }

      if (workerType === 'crew_leader' && !formData.teamSize.trim()) {
        Alert.alert('Required', 'Please enter your team size');
        return;
      }
    }

    onComplete({ ...formData, workerType });
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
          <Text style={styles.typeDisplayIcon}>
            {workerTypeInfo[workerType]?.icon}
          </Text>
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
            {/* Basic Details Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📋 {t.basicDetails}</Text>

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
                <TextInput
                  style={styles.input}
                  placeholder={t.enterMobile}
                  value={formData.mobile}
                  onChangeText={(value) => updateField('mobile', value)}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.password} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.createPassword}
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Languages Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🌐 {t.languages}</Text>
              <Text style={styles.cardSubtitle}>{t.selectLanguages}</Text>

              <TouchableOpacity
                style={styles.languageSelector}
                onPress={() => setShowLanguageMenu(!showLanguageMenu)}
                activeOpacity={0.7}
              >
                <Icon name="language" size={22} color={COLORS.primary} />
                <Text style={styles.languageSelectorText}>
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
                <View style={styles.languageList}>
                  {availableLanguages.map((language) => {
                    const isSelected = formData.selectedLanguages.includes(language.name);
                    return (
                      <TouchableOpacity
                        key={language.code}
                        style={[
                          styles.languageItem,
                          isSelected && styles.languageItemSelected
                        ]}
                        onPress={() => toggleLanguage(language.name)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.languageName}>{language.name}</Text>
                        {isSelected && (
                          <Icon name="checkmark-circle" size={22} color={COLORS.secondary} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {formData.selectedLanguages.length > 0 && (
                <View style={styles.selectedLanguagesContainer}>
                  {formData.selectedLanguages.map((lang, index) => (
                    <View key={index} style={styles.selectedLanguageChip}>
                      <Text style={styles.selectedLanguageText}>{lang}</Text>
                      <TouchableOpacity onPress={() => toggleLanguage(lang)}>
                        <Icon name="close-circle" size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Documents Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📄 {t.documents}</Text>
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

            {/* Payment Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>💳 {t.registrationPayment}</Text>
              <Text style={styles.cardSubtitle}>{t.completePayment}</Text>

              {/* Payment Amount Info */}
              <View style={styles.paymentInfoBox}>
                <View style={styles.paymentInfoHeader}>
                  <Icon name="cash" size={28} color={COLORS.secondary} />
                  <View style={styles.paymentInfoTextContainer}>
                    <Text style={styles.paymentInfoLabel}>{t.registrationFee}</Text>
                    <Text style={styles.paymentInfoAmount}>₹499</Text>
                  </View>
                </View>
                <Text style={styles.paymentInfoNote}>
                  {t.oneTimeFee}
                </Text>
              </View>

              {/* QR Code Section */}
              <View style={styles.qrSection}>
                <TouchableOpacity
                  style={styles.qrToggleButton}
                  onPress={() => setShowQRCode(!showQRCode)}
                  activeOpacity={0.7}
                >
                  <Icon name="qr-code" size={24} color={COLORS.primary} />
                  <Text style={styles.qrToggleText}>
                    {showQRCode ? t.hideQR : t.showQR}
                  </Text>
                  <Icon 
                    name={showQRCode ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.textSecondary} 
                  />
                </TouchableOpacity>

                {showQRCode && (
                  <View style={styles.qrCodeContainer}>
                    <View style={styles.qrCodePlaceholder}>
                      <Icon name="qr-code" size={120} color={COLORS.primary} />
                      <Text style={styles.qrCodeText}>{t.scanToPay}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.scanButton}
                      onPress={handleQRScan}
                      activeOpacity={0.7}
                    >
                      <Icon name="scan" size={22} color={COLORS.white} />
                      <Text style={styles.scanButtonText}>{t.scanQR}</Text>
                    </TouchableOpacity>
                    {formData.payment.qrScanned && (
                      <View style={styles.successBadge}>
                        <Icon name="checkmark-circle" size={20} color="#10b981" />
                        <Text style={styles.successBadgeText}>{t.qrScanned}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Transaction Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.transactionNumber} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterTransaction}
                  value={formData.payment.transactionNumber}
                  onChangeText={(value) => 
                    setFormData(prev => ({
                      ...prev,
                      payment: { ...prev.payment, transactionNumber: value }
                    }))
                  }
                  placeholderTextColor="#94a3b8"
                />
                <Text style={styles.hint}>{t.transactionHint}</Text>
              </View>

              {/* Transaction Screenshot */}
              <View style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Icon name="image" size={32} color={COLORS.secondary} />
                  <View style={styles.documentTextContainer}>
                    <Text style={styles.documentTitle}>{t.paymentScreenshot}</Text>
                    <Text style={styles.documentSubtitle}>{t.uploadProof}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.uploadButton, { backgroundColor: COLORS.secondary }]}
                  onPress={handleTransactionScreenshot}
                  activeOpacity={0.7}
                >
                  <Icon name="cloud-upload" size={20} color={COLORS.white} />
                  <Text style={styles.uploadButtonText}>{t.upload}</Text>
                </TouchableOpacity>
              </View>

             
              
            </View>
          </>
        )}

        {/* Other Worker Types Form */}
        {workerType !== 'individual' && (
          <>
            {/* Basic Details Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📋 {t.basicDetails}</Text>

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
                <TextInput
                  style={styles.input}
                  placeholder={t.enterMobile}
                  value={formData.mobile}
                  onChangeText={(value) => updateField('mobile', value)}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.password} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.createPassword}
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* Services */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.services} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t.enterServices}
                  value={formData.services}
                  onChangeText={(value) => updateField('services', value)}
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.location} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t.enterLocation}
                  value={formData.serviceAreas}
                  onChangeText={(value) => updateField('serviceAreas', value)}
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* GST Number (for crew_leader and contractor) */}
              {(workerType === 'crew_leader' || workerType === 'contractor') && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t.gstNumber}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.enterGST}
                    value={formData.gstNumber}
                    onChangeText={(value) => updateField('gstNumber', value)}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}

              {/* MSME Number (for crew_leader and contractor) */}
              {(workerType === 'crew_leader' || workerType === 'contractor') && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t.msmeNumber}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.enterMSME}
                    value={formData.msmeNumber}
                    onChangeText={(value) => updateField('msmeNumber', value)}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}
            </View>

            {/* Languages Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🌐 {t.languages}</Text>
              <Text style={styles.cardSubtitle}>{t.selectLanguages}</Text>

              <TouchableOpacity
                style={styles.languageSelector}
                onPress={() => setShowLanguageMenu(!showLanguageMenu)}
                activeOpacity={0.7}
              >
               
                <Text style={styles.languageSelectorText}>
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
                <View style={styles.languageList}>
                  {availableLanguages.map((language) => {
                    const isSelected = formData.selectedLanguages.includes(language.name);
                    return (
                      <TouchableOpacity
                        key={language.code}
                        style={[
                          styles.languageItem,
                          isSelected && styles.languageItemSelected
                        ]}
                        onPress={() => toggleLanguage(language.name)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.languageName}>{language.name}</Text>
                        {isSelected && (
                          <Icon name="checkmark-circle" size={22} color={COLORS.secondary} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {formData.selectedLanguages.length > 0 && (
                <View style={styles.selectedLanguagesContainer}>
                  {formData.selectedLanguages.map((lang, index) => (
                    <View key={index} style={styles.selectedLanguageChip}>
                      <Text style={styles.selectedLanguageText}>{lang}</Text>
                      <TouchableOpacity onPress={() => toggleLanguage(lang)}>
                        <Icon name="close-circle" size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Documents Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📄 {t.documents}</Text>
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

            {/* Payment Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>💳 {t.registrationPayment}</Text>
              <Text style={styles.cardSubtitle}>{t.completePayment}</Text>

              {/* Payment Amount Info */}
              <View style={styles.paymentInfoBox}>
                <View style={styles.paymentInfoHeader}>
                  <Icon name="cash" size={28} color={COLORS.secondary} />
                  <View style={styles.paymentInfoTextContainer}>
                    <Text style={styles.paymentInfoLabel}>{t.registrationFee}</Text>
                    <Text style={styles.paymentInfoAmount}>₹499</Text>
                  </View>
                </View>
                <Text style={styles.paymentInfoNote}>
                  {t.oneTimeFee}
                </Text>
              </View>

              {/* QR Code Section */}
              <View style={styles.qrSection}>
                <TouchableOpacity
                  style={styles.qrToggleButton}
                  onPress={() => setShowQRCode(!showQRCode)}
                  activeOpacity={0.7}
                >
                  <Icon name="qr-code" size={24} color={COLORS.primary} />
                  <Text style={styles.qrToggleText}>
                    {showQRCode ? t.hideQR : t.showQR}
                  </Text>
                  <Icon 
                    name={showQRCode ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.textSecondary} 
                  />
                </TouchableOpacity>

                {showQRCode && (
                  <View style={styles.qrCodeContainer}>
                    <View style={styles.qrCodePlaceholder}>
                      <Icon name="qr-code" size={120} color={COLORS.primary} />
                      <Text style={styles.qrCodeText}>{t.scanToPay}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.scanButton}
                      onPress={handleQRScan}
                      activeOpacity={0.7}
                    >
                      <Icon name="scan" size={22} color={COLORS.white} />
                      <Text style={styles.scanButtonText}>{t.scanQR}</Text>
                    </TouchableOpacity>
                    {formData.payment.qrScanned && (
                      <View style={styles.successBadge}>
                        <Icon name="checkmark-circle" size={20} color="#10b981" />
                        <Text style={styles.successBadgeText}>{t.qrScanned}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Transaction Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.transactionNumber} <Text style={styles.required}>{t.required}</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterTransaction}
                  value={formData.payment.transactionNumber}
                  onChangeText={(value) => 
                    setFormData(prev => ({
                      ...prev,
                      payment: { ...prev.payment, transactionNumber: value }
                    }))
                  }
                  placeholderTextColor="#94a3b8"
                />
                <Text style={styles.hint}>{t.transactionHint}</Text>
              </View>

              {/* Transaction Screenshot */}
              <View style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Icon name="image" size={32} color={COLORS.secondary} />
                  <View style={styles.documentTextContainer}>
                    <Text style={styles.documentTitle}>{t.paymentScreenshot}</Text>
                    <Text style={styles.documentSubtitle}>{t.uploadProof}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.uploadButton, { backgroundColor: COLORS.secondary }]}
                  onPress={handleTransactionScreenshot}
                  activeOpacity={0.7}
                >
                  <Icon name="cloud-upload" size={20} color={COLORS.white} />
                  <Text style={styles.uploadButtonText}>{t.upload}</Text>
                </TouchableOpacity>
              </View>
            </View>

        {/* Availability Card */}
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
          </>
        )}

        {/* Info Box */}
       
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>{t.completeProfile}</Text>
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
    backgroundColor: `${COLORS.accent}10`,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: `${COLORS.accent}30`,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
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
    height: 48,
  },
  textArea: {
    height: 48,
    textAlignVertical: 'center',
    paddingTop: 12,
  },
  hint: {
    fontSize: 5,
    color: COLORS.textLight,
    marginTop: 6,
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
    elevation: 2,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
    marginTop: -8,
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
    backgroundColor: COLORS.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
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
    backgroundColor: COLORS.secondary + '15',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.secondary + '30',
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
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  qrCodeText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default ProfileDetailsScreen;
