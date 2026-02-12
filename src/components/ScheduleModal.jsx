import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/colors';

const DAYS = [
  { key: 'Mon', label: 'Monday' },
  { key: 'Tue', label: 'Tuesday' },
  { key: 'Wed', label: 'Wednesday' },
  { key: 'Thu', label: 'Thursday' },
  { key: 'Fri', label: 'Friday' },
  { key: 'Sat', label: 'Saturday' },
  { key: 'Sun', label: 'Sunday' },
];

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

const ScheduleModal = ({ visible, onClose }) => {
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const selectAllDays = () => {
    setSelectedDays(DAYS.map((d) => d.key));
  };

  const clearAllDays = () => {
    setSelectedDays([]);
  };

  const handleSave = () => {
    // Save logic here
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconContainer}>
                <Icon name="calendar" size={24} color={COLORS.secondary} />
              </View>
              <View>
                <Text style={styles.title}>Working Schedule</Text>
                <Text style={styles.subtitle}>Set your availability</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Working Days Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Working Days</Text>
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    onPress={selectAllDays}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickActionText}>Select All</Text>
                  </TouchableOpacity>
                  <Text style={styles.quickActionSeparator}>•</Text>
                  <TouchableOpacity
                    onPress={clearAllDays}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickActionText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.daysContainer}>
                {DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day.key);
                  return (
                    <TouchableOpacity
                      key={day.key}
                      style={[
                        styles.dayButton,
                        isSelected && styles.dayButtonActive,
                      ]}
                      onPress={() => toggleDay(day.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && styles.dayTextActive,
                        ]}
                      >
                        {day.key}
                      </Text>
                      {isSelected && (
                        <View style={styles.dayCheckmark}>
                          <Icon name="checkmark" size={12} color={COLORS.white} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.selectedDaysInfo}>
                <Icon name="information-circle" size={16} color={COLORS.accent} />
                <Text style={styles.selectedDaysText}>
                  {selectedDays.length === 0
                    ? 'No days selected'
                    : `${selectedDays.length} day${selectedDays.length > 1 ? 's' : ''} selected`}
                </Text>
              </View>
            </View>

            {/* Working Hours Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Working Hours</Text>

              {/* Start Time */}
              <View style={styles.timeSection}>
                <View style={styles.timeLabelContainer}>
                  <Icon name="time-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.timeLabel}>Start Time</Text>
                </View>
                <TouchableOpacity
                  style={styles.timeSelector}
                  onPress={() => setShowStartPicker(!showStartPicker)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeValue}>{startTime}</Text>
                  <Icon
                    name={showStartPicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>

                {showStartPicker && (
                  <View style={styles.timePicker}>
                    <ScrollView
                      style={styles.timePickerScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {TIME_SLOTS.map((time) => (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.timeOption,
                            startTime === time && styles.timeOptionActive,
                          ]}
                          onPress={() => {
                            setStartTime(time);
                            setShowStartPicker(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.timeOptionText,
                              startTime === time && styles.timeOptionTextActive,
                            ]}
                          >
                            {time}
                          </Text>
                          {startTime === time && (
                            <Icon name="checkmark" size={18} color={COLORS.primary} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* End Time */}
              <View style={styles.timeSection}>
                <View style={styles.timeLabelContainer}>
                  <Icon name="time" size={20} color={COLORS.primary} />
                  <Text style={styles.timeLabel}>End Time</Text>
                </View>
                <TouchableOpacity
                  style={styles.timeSelector}
                  onPress={() => setShowEndPicker(!showEndPicker)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeValue}>{endTime}</Text>
                  <Icon
                    name={showEndPicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>

                {showEndPicker && (
                  <View style={styles.timePicker}>
                    <ScrollView
                      style={styles.timePickerScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {TIME_SLOTS.map((time) => (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.timeOption,
                            endTime === time && styles.timeOptionActive,
                          ]}
                          onPress={() => {
                            setEndTime(time);
                            setShowEndPicker(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.timeOptionText,
                              endTime === time && styles.timeOptionTextActive,
                            ]}
                          >
                            {time}
                          </Text>
                          {endTime === time && (
                            <Icon name="checkmark" size={18} color={COLORS.primary} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Duration Info */}
              <View style={styles.durationInfo}>
                <Icon name="hourglass-outline" size={16} color={COLORS.primary} />
                <Text style={styles.durationText}>
                  Total: {Math.abs(parseInt(endTime) - parseInt(startTime))} hours per day
                </Text>
              </View>
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Icon name="checkmark-circle" size={20} color={COLORS.primary} />
                <Text style={styles.summaryTitle}>Schedule Summary</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Days:</Text>
                <Text style={styles.summaryValue}>
                  {selectedDays.length > 0 ? selectedDays.join(', ') : 'None'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Hours:</Text>
                <Text style={styles.summaryValue}>
                  {startTime} - {endTime}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Icon name="close-circle-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                selectedDays.length === 0 && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={selectedDays.length === 0}
              activeOpacity={0.8}
            >
              <Icon name="checkmark-circle" size={20} color={COLORS.white} />
              <Text style={styles.saveButtonText}>Save Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    maxHeight: 500,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '600',
  },
  quickActionSeparator: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dayTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  dayCheckmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  selectedDaysInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: `${COLORS.accent}10`,
    borderRadius: 10,
  },
  selectedDaysText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  timeSection: {
    marginBottom: 16,
  },
  timeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  timePicker: {
    marginTop: 10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    maxHeight: 200,
  },
  timePickerScroll: {
    maxHeight: 200,
  },
  timeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  timeOptionActive: {
    backgroundColor: `${COLORS.primary}10`,
  },
  timeOptionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  timeOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  summaryCard: {
    margin: 20,
    padding: 18,
    backgroundColor: `${COLORS.primary}12`,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: `${COLORS.primary}35`,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    gap: 14,
    padding: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.white,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 18,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default ScheduleModal;
