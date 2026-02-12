import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Alert,
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';

const WORKER_TYPES = [
  { 
    id: 'individual', 
    icon: '👤',
    label: 'Individual Worker', 
    description: 'Work independently',
    fee: 99 
  },
  { 
    id: 'crew_leader', 
    icon: '👥',
    label: 'Crew Leader', 
    description: 'Manage a team',
    fee: 299 
  },
  { 
    id: 'contractor', 
    icon: '🏗️',
    label: 'Contractor', 
    description: 'Handle projects',
    fee: 499 
  },
  { 
    id: 'service_provider', 
    icon: '🧰',
    label: 'Service Provider', 
    description: 'Shop/Agency business',
    fee: 999 
  },
];

const OnboardingScreen = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [workerType, setWorkerType] = useState(null);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [skills, setSkills] = useState('');
  const [serviceAreas, setServiceAreas] = useState('');
  const [crewSize, setCrewSize] = useState('');

  const selectedType = WORKER_TYPES.find(t => t.id === workerType);

  const handleNext = () => {
    if (step === 1 && !workerType) {
      Alert.alert('Required', 'Please select a worker type');
      return;
    }
    if (step === 2) {
      if (!name.trim()) {
        Alert.alert('Required', 'Please enter your name');
        return;
      }
      if (!skills.trim()) {
        Alert.alert('Required', 'Please enter your skills/services');
        return;
      }
      if (!serviceAreas.trim()) {
        Alert.alert('Required', 'Please enter service areas');
        return;
      }
      if (workerType === 'crew_leader' && !crewSize.trim()) {
        Alert.alert('Required', 'Please enter team size');
        return;
      }
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const data = {
      workerType,
      name,
      businessName,
      skills,
      serviceAreas,
      crewSize: workerType === 'crew_leader' ? crewSize : null,
      onboardingFee: selectedType?.fee,
    };
    onComplete(data);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        {(step > 1 || onBack) && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={styles.progressDot}>
                <View style={[
                  styles.progressDotInner,
                  step >= s && styles.progressDotActive
                ]} />
              </View>
            ))}
          </View>
          <Text style={styles.headerText}>Step {step} of 3</Text>
          <Text style={styles.headerSubtext}>
            {step === 1 && 'Choose Your Profile Type'}
            {step === 2 && 'Complete Your Profile'}
            {step === 3 && 'Complete Payment'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What best describes you?</Text>
            <Text style={styles.stepSubtitle}>
              Select the option that matches your work style
            </Text>
            
            {WORKER_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.workerTypeCard,
                  workerType === type.id && styles.selectedCard,
                ]}
                onPress={() => setWorkerType(type.id)}
                activeOpacity={0.7}
              >
                <View style={styles.workerTypeHeader}>
                  <Text style={styles.workerTypeIcon}>{type.icon}</Text>
                  <View style={styles.workerTypeInfo}>
                    <Text style={styles.workerTypeLabel}>{type.label}</Text>
                    <Text style={styles.workerTypeDescription}>{type.description}</Text>
                  </View>
                  {workerType === type.id && (
                    <View style={styles.checkmark}>
                      <Icon name="checkmark" size={20} color={COLORS.white} />
                    </View>
                  )}
                </View>
                <View style={styles.feeContainer}>
                  <Text style={styles.feeLabel}>One-time onboarding fee</Text>
                  <Text style={styles.feeAmount}>₹{type.fee}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <Text style={styles.stepSubtitle}>
              This information will be visible to customers
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            {(workerType === 'contractor' || workerType === 'service_provider') && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Business Name (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter business name"
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Skills / Services *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Plumbing, Electrical, Carpentry"
                value={skills}
                onChangeText={setSkills}
                multiline
                numberOfLines={3}
                placeholderTextColor={COLORS.textLight}
              />
              <Text style={styles.inputHint}>Separate multiple skills with commas</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Service Areas *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Mumbai, Navi Mumbai, Thane"
                value={serviceAreas}
                onChangeText={setServiceAreas}
                multiline
                numberOfLines={3}
                placeholderTextColor={COLORS.textLight}
              />
              <Text style={styles.inputHint}>Areas where you provide services</Text>
            </View>

            {workerType === 'crew_leader' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Team Size *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Number of team members"
                  keyboardType="number-pad"
                  value={crewSize}
                  onChangeText={setCrewSize}
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
            )}
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Complete Your Registration</Text>
            <Text style={styles.stepSubtitle}>
              One-time payment to activate your profile
            </Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryIcon}>{selectedType?.icon}</Text>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryType}>{selectedType?.label}</Text>
                  <Text style={styles.summaryName}>{name}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryDetails}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Skills</Text>
                  <Text style={styles.summaryValue}>{skills}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Service Areas</Text>
                  <Text style={styles.summaryValue}>{serviceAreas}</Text>
                </View>
                {workerType === 'crew_leader' && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Team Size</Text>
                    <Text style={styles.summaryValue}>{crewSize} members</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.paymentCard}>
              <Text style={styles.paymentTitle}>Payment Summary</Text>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Onboarding Fee</Text>
                <Text style={styles.paymentAmount}>₹{selectedType?.fee}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>GST (18%)</Text>
                <Text style={styles.paymentAmount}>₹{Math.round(selectedType?.fee * 0.18)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.paymentRow}>
                <Text style={styles.paymentTotalLabel}>Total Amount</Text>
                <Text style={styles.paymentTotalAmount}>
                  ₹{selectedType?.fee + Math.round(selectedType?.fee * 0.18)}
                </Text>
              </View>
            </View>

            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>What you get:</Text>
              <View style={styles.benefitItem}>
                <Icon name="checkmark-circle" size={20} color="#16a34a" />
                <Text style={styles.benefitText}>Verified profile badge</Text>
              </View>
              <View style={styles.benefitItem}>
                <Icon name="checkmark-circle" size={20} color="#16a34a" />
                <Text style={styles.benefitText}>Direct customer connections</Text>
              </View>
              <View style={styles.benefitItem}>
                <Icon name="checkmark-circle" size={20} color="#16a34a" />
                <Text style={styles.benefitText}>Profile insights & analytics</Text>
              </View>
              <View style={styles.benefitItem}>
                <Icon name="checkmark-circle" size={20} color="#16a34a" />
                <Text style={styles.benefitText}>24/7 support access</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {step === 3 ? 'Pay & Continue' : 'Continue'}
          </Text>
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
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressDot: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
    borderRadius: 2,
  },
  progressDotInner: {
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: COLORS.white,
  },
  headerText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  workerTypeCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    elevation: 1,
  },
  selectedCard: {
    borderColor: COLORS.accent,
    backgroundColor: `${COLORS.accent}10`,
  },
  workerTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workerTypeIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  workerTypeInfo: {
    flex: 1,
  },
  workerTypeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  workerTypeDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  feeLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 4,
  },
  summaryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  summaryDetails: {
    gap: 12,
  },
  summaryRow: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  paymentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  paymentAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  paymentTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  benefitsCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#166534',
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
