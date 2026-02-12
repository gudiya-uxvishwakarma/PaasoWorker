# Language Selection Feature

## Overview
WorkerTypeSelectionScreen mein header ke right side pe language selection option add kiya gaya hai. User apni pasand ki language select kar sakta hai aur poora app usi language mein kaam karega.

## Supported Languages
1. English (English)
2. Hindi (हिंदी)
3. Marathi (मराठी)
4. Gujarati (ગુજરાતી)
5. Tamil (தமிழ்)
6. Telugu (తెలుగు)
7. Kannada (ಕನ್ನಡ)
8. Bengali (বাংলা)
9. Punjabi (ਪੰਜਾਬੀ)

## Installation Steps

1. Install AsyncStorage dependency:
```bash
npm install @react-native-async-storage/async-storage
```

2. For iOS, install pods:
```bash
cd ios && pod install && cd ..
```

3. Rebuild the app:
```bash
# For Android
npm run android

# For iOS
npm run ios
```

## Files Created/Modified

### New Files:
- `src/constants/translations.js` - All translation strings
- `src/constants/languages.js` - Language configuration
- `src/context/LanguageContext.jsx` - Language context provider

### Modified Files:
- `App.jsx` - Added LanguageProvider wrapper
- `src/screens/onboarding/WorkerTypeSelectionScreen.jsx` - Added language selector in header
- `package.json` - Added AsyncStorage dependency

## How to Use

1. Language button header ke right side pe dikhega
2. Click karne pe modal open hoga with all available languages
3. Language select karne pe app automatically usi language mein switch ho jayega
4. Selected language AsyncStorage mein save hoti hai, so next time app open karne pe wahi language load hogi

## Adding More Languages

To add more languages:

1. Add language in `src/constants/languages.js`:
```javascript
{ code: 'ur', name: 'Urdu', nativeName: 'اردو' }
```

2. Add translations in `src/constants/translations.js`:
```javascript
ur: {
  chooseProfile: 'اپنی پروفائل منتخب کریں',
  // ... other translations
}
```

## Using Translations in Other Screens

```javascript
import { useLanguage } from '../context/LanguageContext';

const MyScreen = () => {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  
  return (
    <Text>{t('chooseProfile')}</Text>
  );
};
```
