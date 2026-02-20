import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Load saved language on app start
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const changeLanguage = async (language) => {
    try {
      setSelectedLanguage(language);
      await AsyncStorage.setItem('selectedLanguage', language);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  ];

  // All translations for the app
  const translations = {
    English: {
      // Common
      language: 'Language',
      selectLanguage: 'Select Language',
      continue: 'Continue',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      
      // Worker Type Selection
      chooseProfile: 'Choose Your Profile',
      selectProfileType: 'Select a profile type',
      
      // Worker Types
      individualWorker: 'Individual Worker',
      crewLeader: 'Crew Leader',
      contractor: 'Contractor',
      serviceProvider: 'Service Provider',
      
      // Features
      personalProfile: 'Personal profile',
      directBookings: 'Direct bookings',
      teamManagement: 'Team management',
      multipleWorkers: 'Multiple workers',
      projectContracts: 'Project contracts',
      licensedWork: 'Licensed work',
      businessProfile: 'Business profile',
      multipleServices: 'Multiple services',
      manageTeam: 'Manage and lead a team',
      shopAgency: 'Shop/Agency',
    },
    Hindi: {
      language: 'भाषा',
      selectLanguage: 'भाषा चुनें',
      continue: 'जारी रखें',
      back: 'वापस',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      
      chooseProfile: 'अपनी प्रोफ़ाइल चुनें',
      selectProfileType: 'प्रोफ़ाइल प्रकार चुनें',
      
      individualWorker: 'व्यक्तिगत कार्यकर्ता',
      crewLeader: 'क्रू/टीम लीडर',
      contractor: 'ठेकेदार',
      serviceProvider: 'सेवा प्रदाता',
      
      personalProfile: 'व्यक्तिगत प्रोफ़ाइल',
      directBookings: 'सीधी बुकिंग',
      teamManagement: 'टीम प्रबंधन',
      multipleWorkers: 'कई कार्यकर्ता',
      projectContracts: 'परियोजना अनुबंध',
      licensedWork: 'लाइसेंस प्राप्त कार्य',
      businessProfile: 'व्यवसाय प्रोफ़ाइल',
      multipleServices: 'कई सेवाएं',
      manageTeam: 'टीम का प्रबंधन और नेतृत्व',
      shopAgency: 'दुकान/एजेंसी',
    },
    Kannada: {
      language: 'ಭಾಷೆ',
      selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
      continue: 'ಮುಂದುವರಿಸಿ',
      back: 'ಹಿಂದೆ',
      save: 'ಉಳಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      
      chooseProfile: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ',
      selectProfileType: 'ಪ್ರೊಫೈಲ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      
      individualWorker: 'ವೈಯಕ್ತಿಕ ಕೆಲಸಗಾರ',
      crewLeader: 'ಸಿಬ್ಬಂದಿ/ತಂಡ ನಾಯಕ',
      contractor: 'ಗುತ್ತಿಗೆದಾರ',
      serviceProvider: 'ಸೇವಾ ಪೂರೈಕೆದಾರ',
      
      personalProfile: 'ವೈಯಕ್ತಿಕ ಪ್ರೊಫೈಲ್',
      directBookings: 'ನೇರ ಬುಕಿಂಗ್‌ಗಳು',
      teamManagement: 'ತಂಡ ನಿರ್ವಹಣೆ',
      multipleWorkers: 'ಅನೇಕ ಕೆಲಸಗಾರರು',
      projectContracts: 'ಯೋಜನಾ ಒಪ್ಪಂದಗಳು',
      licensedWork: 'ಪರವಾನಗಿ ಪಡೆದ ಕೆಲಸ',
      businessProfile: 'ವ್ಯಾಪಾರ ಪ್ರೊಫೈಲ್',
      multipleServices: 'ಅನೇಕ ಸೇವೆಗಳು',
      manageTeam: 'ತಂಡವನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಮುನ್ನಡೆಸಿ',
      shopAgency: 'ಅಂಗಡಿ/ಏಜೆನ್ಸಿ',
    },
    Tamil: {
      language: 'மொழி',
      selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
      continue: 'தொடரவும்',
      back: 'பின்செல்',
      save: 'சேமி',
      cancel: 'ரத்துசெய்',
      
      chooseProfile: 'உங்கள் சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்',
      selectProfileType: 'சுயவிவர வகையைத் தேர்ந்தெடுக்கவும்',
      
      individualWorker: 'தனிப்பட்ட தொழிலாளி',
      crewLeader: 'குழு/டீம் தலைவர்',
      contractor: 'ஒப்பந்ததாரர்',
      serviceProvider: 'சேவை வழங்குநர்',
      
      personalProfile: 'தனிப்பட்ட சுயவிவரம்',
      directBookings: 'நேரடி முன்பதிவுகள்',
      teamManagement: 'குழு மேலாண்மை',
      multipleWorkers: 'பல தொழிலாளர்கள்',
      projectContracts: 'திட்ட ஒப்பந்தங்கள்',
      licensedWork: 'உரிமம் பெற்ற வேலை',
      businessProfile: 'வணிக சுயவிவரம்',
      multipleServices: 'பல சேவைகள்',
      manageTeam: 'குழுவை நிர்வகித்து வழிநடத்துங்கள்',
      shopAgency: 'கடை/ஏஜென்சி',
    },
    Telugu: {
      language: 'భాష',
      selectLanguage: 'భాషను ఎంచుకోండి',
      continue: 'కొనసాగించు',
      back: 'వెనుకకు',
      save: 'సేవ్ చేయి',
      cancel: 'రద్దు చేయి',
      
      chooseProfile: 'మీ ప్రొఫైల్‌ను ఎంచుకోండి',
      selectProfileType: 'ప్రొఫైల్ రకాన్ని ఎంచుకోండి',
      
      individualWorker: 'వ్యక్తిగత కార్మికుడు',
      crewLeader: 'క్రూ/టీమ్ లీడర్',
      contractor: 'కాంట్రాక్టర్',
      serviceProvider: 'సేవా ప్రదాత',
      
      personalProfile: 'వ్యక్తిగత ప్రొఫైల్',
      directBookings: 'ప్రత్యక్ష బుకింగ్‌లు',
      teamManagement: 'బృంద నిర్వహణ',
      multipleWorkers: 'అనేక కార్మికులు',
      projectContracts: 'ప్రాజెక్ట్ ఒప్పందాలు',
      licensedWork: 'లైసెన్స్ పొందిన పని',
      businessProfile: 'వ్యాపార ప్రొఫైల్',
      multipleServices: 'అనేక సేవలు',
      manageTeam: 'బృందాన్ని నిర్వహించండి మరియు నడిపించండి',
      shopAgency: 'దుకాణం/ఏజెన్సీ',
    },
    Malayalam: {
      language: 'ഭാഷ',
      selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
      continue: 'തുടരുക',
      back: 'തിരികെ',
      save: 'സേവ് ചെയ്യുക',
      cancel: 'റദ്ദാക്കുക',
      
      chooseProfile: 'നിങ്ങളുടെ പ്രൊഫൈൽ തിരഞ്ഞെടുക്കുക',
      selectProfileType: 'പ്രൊഫൈൽ തരം തിരഞ്ഞെടുക്കുക',
      
      individualWorker: 'വ്യക്തിഗത തൊഴിലാളി',
      crewLeader: 'ക്രൂ/ടീം ലീഡർ',
      contractor: 'കരാറുകാരൻ',
      serviceProvider: 'സേവന ദാതാവ്',
      
      personalProfile: 'വ്യക്തിഗത പ്രൊഫൈൽ',
      directBookings: 'നേരിട്ടുള്ള ബുക്കിംഗുകൾ',
      teamManagement: 'ടീം മാനേജ്മെന്റ്',
      multipleWorkers: 'ഒന്നിലധികം തൊഴിലാളികൾ',
      projectContracts: 'പ്രോജക്ട് കരാറുകൾ',
      licensedWork: 'ലൈസൻസുള്ള ജോലി',
      businessProfile: 'ബിസിനസ് പ്രൊഫൈൽ',
      multipleServices: 'ഒന്നിലധികം സേവനങ്ങൾ',
      manageTeam: 'ടീമിനെ നിയന്ത്രിക്കുകയും നയിക്കുകയും ചെയ്യുക',
      shopAgency: 'കട/ഏജൻസി',
    },
    Marathi: {
      language: 'भाषा',
      selectLanguage: 'भाषा निवडा',
      continue: 'सुरू ठेवा',
      back: 'मागे',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      
      chooseProfile: 'तुमचे प्रोफाइल निवडा',
      selectProfileType: 'प्रोफाइल प्रकार निवडा',
      
      individualWorker: 'वैयक्तिक कामगार',
      crewLeader: 'क्रू/टीम लीडर',
      contractor: 'कंत्राटदार',
      serviceProvider: 'सेवा प्रदाता',
      
      personalProfile: 'वैयक्तिक प्रोफाइल',
      directBookings: 'थेट बुकिंग',
      teamManagement: 'टीम व्यवस्थापन',
      multipleWorkers: 'अनेक कामगार',
      projectContracts: 'प्रकल्प करार',
      licensedWork: 'परवानाधारक काम',
      businessProfile: 'व्यवसाय प्रोफाइल',
      multipleServices: 'अनेक सेवा',
      manageTeam: 'टीमचे व्यवस्थापन आणि नेतृत्व',
      shopAgency: 'दुकान/एजन्सी',
    },
    Gujarati: {
      language: 'ભાષા',
      selectLanguage: 'ભાષા પસંદ કરો',
      continue: 'ચાલુ રાખો',
      back: 'પાછળ',
      save: 'સાચવો',
      cancel: 'રદ કરો',
      
      chooseProfile: 'તમારી પ્રોફાઇલ પસંદ કરો',
      selectProfileType: 'પ્રોફાઇલ પ્રકાર પસંદ કરો',
      
      individualWorker: 'વ્યક્તિગત કામદાર',
      crewLeader: 'ક્રૂ/ટીમ લીડર',
      contractor: 'કોન્ટ્રાક્ટર',
      serviceProvider: 'સેવા પ્રદાતા',
      
      personalProfile: 'વ્યક્તિગત પ્રોફાઇલ',
      directBookings: 'સીધી બુકિંગ',
      teamManagement: 'ટીમ મેનેજમેન્ટ',
      multipleWorkers: 'અનેક કામદારો',
      projectContracts: 'પ્રોજેક્ટ કરાર',
      licensedWork: 'લાઇસન્સ પ્રાપ્ત કામ',
      businessProfile: 'વ્યવસાય પ્રોફાઇલ',
      multipleServices: 'અનેક સેવાઓ',
      manageTeam: 'ટીમનું સંચાલન અને નેતૃત્વ',
      shopAgency: 'દુકાન/એજન્સી',
    },
    Punjabi: {
      language: 'ਭਾਸ਼ਾ',
      selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
      continue: 'ਜਾਰੀ ਰੱਖੋ',
      back: 'ਪਿੱਛੇ',
      save: 'ਸੰਭਾਲੋ',
      cancel: 'ਰੱਦ ਕਰੋ',
      
      chooseProfile: 'ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਚੁਣੋ',
      selectProfileType: 'ਪ੍ਰੋਫਾਈਲ ਕਿਸਮ ਚੁਣੋ',
      
      individualWorker: 'ਵਿਅਕਤੀਗਤ ਕਾਮਾ',
      crewLeader: 'ਕਰੂ/ਟੀਮ ਲੀਡਰ',
      contractor: 'ਠੇਕੇਦਾਰ',
      serviceProvider: 'ਸੇਵਾ ਪ੍ਰਦਾਤਾ',
      
      personalProfile: 'ਨਿੱਜੀ ਪ੍ਰੋਫਾਈਲ',
      directBookings: 'ਸਿੱਧੀ ਬੁਕਿੰਗ',
      teamManagement: 'ਟੀਮ ਪ੍ਰਬੰਧਨ',
      multipleWorkers: 'ਕਈ ਕਾਮੇ',
      projectContracts: 'ਪ੍ਰੋਜੈਕਟ ਇਕਰਾਰਨਾਮੇ',
      licensedWork: 'ਲਾਇਸੰਸਸ਼ੁਦਾ ਕੰਮ',
      businessProfile: 'ਕਾਰੋਬਾਰੀ ਪ੍ਰੋਫਾਈਲ',
      multipleServices: 'ਕਈ ਸੇਵਾਵਾਂ',
      manageTeam: 'ਟੀਮ ਦਾ ਪ੍ਰਬੰਧਨ ਅਤੇ ਅਗਵਾਈ',
      shopAgency: 'ਦੁਕਾਨ/ਏਜੰਸੀ',
    },
    Bengali: {
      language: 'ভাষা',
      selectLanguage: 'ভাষা নির্বাচন করুন',
      continue: 'চালিয়ে যান',
      back: 'পিছনে',
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল করুন',
      
      chooseProfile: 'আপনার প্রোফাইল নির্বাচন করুন',
      selectProfileType: 'প্রোফাইল প্রকার নির্বাচন করুন',
      
      individualWorker: 'ব্যক্তিগত কর্মী',
      crewLeader: 'ক্রু/টিম লিডার',
      contractor: 'ঠিকাদার',
      serviceProvider: 'সেবা প্রদানকারী',
      
      personalProfile: 'ব্যক্তিগত প্রোফাইল',
      directBookings: 'সরাসরি বুকিং',
      teamManagement: 'দল ব্যবস্থাপনা',
      multipleWorkers: 'একাধিক কর্মী',
      projectContracts: 'প্রকল্প চুক্তি',
      licensedWork: 'লাইসেন্সপ্রাপ্ত কাজ',
      businessProfile: 'ব্যবসা প্রোফাইল',
      multipleServices: 'একাধিক সেবা',
      manageTeam: 'দল পরিচালনা এবং নেতৃত্ব',
      shopAgency: 'দোকান/এজেন্সি',
    },
    Odia: {
      language: 'ଭାଷା',
      selectLanguage: 'ଭାଷା ଚୟନ କରନ୍ତୁ',
      continue: 'ଜାରି ରଖନ୍ତୁ',
      back: 'ପଛକୁ',
      save: 'ସଂରକ୍ଷଣ କରନ୍ତୁ',
      cancel: 'ବାତିଲ କରନ୍ତୁ',
      
      chooseProfile: 'ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଚୟନ କରନ୍ତୁ',
      selectProfileType: 'ପ୍ରୋଫାଇଲ୍ ପ୍ରକାର ଚୟନ କରନ୍ତୁ',
      
      individualWorker: 'ବ୍ୟକ୍ତିଗତ କର୍ମଚାରୀ',
      crewLeader: 'କ୍ରୁ/ଟିମ୍ ଲିଡର',
      contractor: 'ଠିକାଦାର',
      serviceProvider: 'ସେବା ପ୍ରଦାନକାରୀ',
      
      personalProfile: 'ବ୍ୟକ୍ତିଗତ ପ୍ରୋଫାଇଲ୍',
      directBookings: 'ସିଧାସଳଖ ବୁକିଂ',
      teamManagement: 'ଟିମ୍ ପରିଚାଳନା',
      multipleWorkers: 'ଏକାଧିକ କର୍ମଚାରୀ',
      projectContracts: 'ପ୍ରକଳ୍ପ ଚୁକ୍ତି',
      licensedWork: 'ଲାଇସେନ୍ସପ୍ରାପ୍ତ କାମ',
      businessProfile: 'ବ୍ୟବସାୟ ପ୍ରୋଫାଇଲ୍',
      multipleServices: 'ଏକାଧିକ ସେବା',
      manageTeam: 'ଟିମ୍ ପରିଚାଳନା ଏବଂ ନେତୃତ୍ୱ',
      shopAgency: 'ଦୋକାନ/ଏଜେନ୍ସି',
    },
    Assamese: {
      language: 'ভাষা',
      selectLanguage: 'ভাষা নিৰ্বাচন কৰক',
      continue: 'অব্যাহত ৰাখক',
      back: 'পিছলৈ',
      save: 'সংৰক্ষণ কৰক',
      cancel: 'বাতিল কৰক',
      
      chooseProfile: 'আপোনাৰ প্ৰফাইল নিৰ্বাচন কৰক',
      selectProfileType: 'প্ৰফাইল প্ৰকাৰ নিৰ্বাচন কৰক',
      
      individualWorker: 'ব্যক্তিগত কৰ্মী',
      crewLeader: 'ক্ৰু/টিম লিডাৰ',
      contractor: 'ঠিকাদাৰ',
      serviceProvider: 'সেৱা প্ৰদানকাৰী',
      
      personalProfile: 'ব্যক্তিগত প্ৰফাইল',
      directBookings: 'প্ৰত্যক্ষ বুকিং',
      teamManagement: 'দল পৰিচালনা',
      multipleWorkers: 'একাধিক কৰ্মী',
      projectContracts: 'প্ৰকল্প চুক্তি',
      licensedWork: 'অনুজ্ঞাপত্ৰপ্ৰাপ্ত কাম',
      businessProfile: 'ব্যৱসায় প্ৰফাইল',
      multipleServices: 'একাধিক সেৱা',
      manageTeam: 'দল পৰিচালনা আৰু নেতৃত্ব',
      shopAgency: 'দোকান/এজেন্সি',
    },
  };

  const t = (key) => {
    return translations[selectedLanguage]?.[key] || translations.English[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        changeLanguage,
        languages,
        translations: translations[selectedLanguage] || translations.English,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
