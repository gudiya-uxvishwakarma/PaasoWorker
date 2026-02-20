import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/auth/LoginScreen';
import WorkerTypeSelectionScreen from '../screens/onboarding/WorkerTypeSelectionScreen';
import LanguageSelectionScreen from '../screens/onboarding/LanguageSelectionScreen';
import ProfileDetailsScreen from '../screens/onboarding/ProfileDetailsScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import HomeScreen from '../screens/dashboard/DashboardScreen';
import JobScreen from '../screens/calls/CallsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SubscriptionScreen from '../screens/monetization/SubscriptionScreen';
import VerificationScreen from '../screens/verification/VerificationScreen';
import TeamManagementScreen from '../screens/team/TeamManagementScreen';
import COLORS from '../constants/colors';

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userData, setUserData] = useState(null);
  const [selectedWorkerType, setSelectedWorkerType] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [navigationHistory, setNavigationHistory] = useState(['login']);
  const [activeTab, setActiveTab] = useState('dashboard');

  /**
   * Check if user needs to complete onboarding steps
   * Returns: { required: boolean, screen: string, reason: string }
   */
  const checkOnboardingStatus = (userData) => {
    if (!userData) {
      return { required: true, screen: 'login', reason: 'No user data' };
    }

    // Step 1: Check if worker type is selected
    if (!userData.workerType) {
      return { 
        required: true, 
        screen: 'workerTypeSelection', 
        reason: 'Worker type not selected' 
      };
    }

    // Step 2: Check if profile details are complete
    const hasBasicInfo = userData.name && userData.mobile;
    const hasCategory = userData.category && (Array.isArray(userData.category) ? userData.category.length > 0 : userData.category);
    const hasLocation = userData.city || userData.serviceArea;
    
    if (!hasBasicInfo || !hasCategory || !hasLocation) {
      return { 
        required: true, 
        screen: 'profileDetails', 
        reason: 'Profile incomplete' 
      };
    }

    // Step 3: After profile details are complete, go directly to dashboard
    // Dashboard will show verification status (Pending/Approved/Rejected)
    // No need to check verification here - let users see their dashboard
    
    // All onboarding steps complete - go to home/dashboard
    return { required: false, screen: 'home', reason: 'Onboarding complete' };
  };

  const navigate = (screen, data = null) => {
    setCurrentScreen(screen);
    if (data) setUserData(data);
    setNavigationHistory(prev => [...prev, screen]);
  };

  const handleLogout = async () => {
    // Reset all state
    setUserData(null);
    setSelectedWorkerType(null);
    setActiveTab('dashboard');
    setNavigationHistory(['login']);
    setCurrentScreen('login');
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previousScreen = newHistory[newHistory.length - 1];
      setCurrentScreen(previousScreen);
      setNavigationHistory(newHistory);
      return true;
    }
    return false;
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HomeScreen userData={userData} onNavigate={navigate} />;
      case 'calls':
        return <JobScreen />;
      case 'profile':
        return <ProfileScreen userData={userData} onNavigate={navigate} onBack={null} onLogout={handleLogout} />;
      default:
        return <HomeScreen userData={userData} onNavigate={navigate} />;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={(phoneNumber, workerData) => {
              // User logged in successfully
              setUserData(workerData);
              
              // Check onboarding status and navigate accordingly
              const onboardingStatus = checkOnboardingStatus(workerData);
              
              if (onboardingStatus.required) {
                console.log('📋 Onboarding required:', onboardingStatus.reason);
                navigate(onboardingStatus.screen);
              } else {
                console.log('✅ Onboarding complete, going to home');
                navigate('home');
              }
            }}
            onNewUser={(phoneNumber) => {
              // New user - start registration flow
              setUserData({ phoneNumber });
              navigate('workerTypeSelection');
            }}
          />
        );
      case 'workerTypeSelection':
        return <WorkerTypeSelectionScreen 
          userData={userData}
          onComplete={(type, language) => {
            setSelectedWorkerType(type);
            setSelectedLanguage(language);
            
            // Update user data with worker type
            const updatedData = { 
              ...userData, 
              workerType: type,
              languages: [language]
            };
            setUserData(updatedData);
            
            navigate('profileDetails');
          }}
          onNavigateToLanguage={() => navigate('languageSelection')}
          onBack={goBack}
        />;
      case 'languageSelection':
        return <LanguageSelectionScreen 
          onComplete={(language) => {
            setSelectedLanguage(language);
            // Go back to worker type selection
            goBack();
          }}
          onBack={goBack}
        />;
      case 'profileDetails':
        return <ProfileDetailsScreen 
          workerType={selectedWorkerType || userData?.workerType}
          selectedLanguage={selectedLanguage}
          userData={userData}
          onComplete={async (data) => {
            // Profile details complete
            const updatedData = { ...userData, ...data };
            setUserData(updatedData);
            
            // Check if all onboarding is complete
            const onboardingStatus = checkOnboardingStatus(updatedData);
            if (onboardingStatus.required) {
              navigate(onboardingStatus.screen);
            } else {
              navigate('home', updatedData);
            }
          }}
          onBack={goBack}
        />;
      case 'onboarding':
        return <OnboardingScreen 
          onComplete={(data) => {
            setUserData(data);
            navigate('home', data);
          }}
          onBack={goBack}
        />;
      case 'home':
        return (
          <View style={styles.container}>
            {renderMainContent()}
            <View style={styles.bottomNav}>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('dashboard')}
                activeOpacity={0.7}
              >
                <Icon
                  name={activeTab === 'dashboard' ? 'home' : 'home-outline'}
                  size={24}
                  color={activeTab === 'dashboard' ? COLORS.primary : COLORS.textSecondary}
                />
                <Text style={[
                  styles.navLabel,
                  activeTab === 'dashboard' && styles.navLabelActive
                ]}>
                  Dashboard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('calls')}
                activeOpacity={0.7}
              >
                <Icon
                  name={activeTab === 'calls' ? 'briefcase' : 'briefcase-outline'}
                  size={24}
                  color={activeTab === 'calls' ? COLORS.primary : COLORS.textSecondary}
                />
                <Text style={[
                  styles.navLabel,
                  activeTab === 'calls' && styles.navLabelActive
                ]}>
                  Calls
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('profile')}
                activeOpacity={0.7}
              >
                <Icon
                  name={activeTab === 'profile' ? 'person' : 'person-outline'}
                  size={24}
                  color={activeTab === 'profile' ? COLORS.primary : COLORS.textSecondary}
                />
                <Text style={[
                  styles.navLabel,
                  activeTab === 'profile' && styles.navLabelActive
                ]}>
                  Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'subscription':
        return <SubscriptionScreen onNavigate={navigate} onBack={goBack} />;
      case 'verification':
        return <VerificationScreen 
          onBack={goBack} 
          userData={userData}
          onComplete={(updatedData) => {
            // Verification complete, update user data
            setUserData(updatedData);
            
            // Check next onboarding step
            const onboardingStatus = checkOnboardingStatus(updatedData);
            if (onboardingStatus.required) {
              navigate(onboardingStatus.screen);
            } else {
              navigate('home');
            }
          }}
        />;
      case 'teamManagement':
        return <TeamManagementScreen onBack={goBack} userData={userData} />;
      default:
        return (
          <LoginScreen
            onLogin={(phoneNumber, workerData) => {
              setUserData(workerData);
              navigate('home');
            }}
            onNewUser={(phoneNumber) => {
              setUserData({ phoneNumber });
              navigate('workerTypeSelection');
            }}
          />
        );
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default AppNavigator;
