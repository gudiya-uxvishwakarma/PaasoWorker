import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';

const CallsScreen = () => {
  // ✅ Use global language context for language persistence
  const { selectedLanguage } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('active');
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [showWeekFilter, setShowWeekFilter] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  
  // Log current language for debugging
  useEffect(() => {
    console.log('📞 Calls - Current Language:', selectedLanguage);
  }, [selectedLanguage]);
  
  const [jobsData, setJobsData] = useState({
    active: [
      {
        id: 1,
        title: 'Plumbing Work',
        customer: 'Rajesh Kumar',
        location: 'Sector 15, Noida',
        date: 'Today, 2:00 PM',
        status: 'ongoing',
        payment: '₹5,000',
        description: 'Kitchen sink repair and bathroom tap replacement needed urgently.',
        duration: '2-3 hours',
        phone: '+91 98765 43210',
        requirements: 'Basic plumbing tools, pipe fittings',
      },
      {
        id: 2,
        title: 'Electrical Repair',
        customer: 'Priya Sharma',
        location: 'Greater Kailash, Delhi',
        date: 'Tomorrow, 10:00 AM',
        status: 'scheduled',
        payment: '₹2,000',
        description: 'Fix electrical wiring issues in bedroom and install new switches.',
        duration: '1-2 hours',
        phone: '+91 98765 43211',
        requirements: 'Electrical tools, switches, wiring',
      },
      {
        id: 4,
        title: 'Carpentry Work',
        customer: 'Suresh Patel',
        location: 'Vasant Kunj, Delhi',
        date: 'Tomorrow, 3:00 PM',
        status: 'pending',
        payment: '₹3,500',
        description: 'Custom wardrobe installation and door repair work.',
        duration: '3-4 hours',
        phone: '+91 98765 43213',
        requirements: 'Carpentry tools, wood fittings',
      },
    ],
    completed: [
      {
        id: 3,
        title: 'AC Installation',
        customer: 'Amit Verma',
        location: 'Dwarka, Delhi',
        date: 'Yesterday',
        status: 'completed',
        payment: '₹5,000',
        rating: 5,
        description: 'Split AC installation in living room with proper mounting.',
        duration: '3-4 hours',
        phone: '+91 98765 43212',
        requirements: 'AC installation kit, drilling machine',
      },
    ],
    cancelled: [],
  });

  const weekOptions = [
    'This Week',
    'Last Week',
    'Next Week',
    'This Month',
    'Last Month',
    'All Time',
  ];

  const toggleJobDetails = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const handleCall = (phone, customerName) => {
    Alert.alert(
      'Call Customer',
      `Do you want to call ${customerName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phone}`).catch((err) => {
              Alert.alert('Error', 'Unable to make call');
              console.error('Call error:', err);
            });
          },
        },
      ]
    );
  };

  const handleAcceptJob = (jobId, jobTitle) => {
    Alert.alert(
      'Accept Job',
      `Do you want to accept "${jobTitle}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => {
            setJobsData(prevData => {
              const updatedActive = prevData.active.map(job =>
                job.id === jobId ? { ...job, status: 'scheduled' } : job
              );
              return { ...prevData, active: updatedActive };
            });
            Alert.alert('Success', 'Job accepted successfully!');
          },
        },
      ]
    );
  };

  const handleRejectJob = (jobId, jobTitle) => {
    Alert.alert(
      'Reject Job',
      `Are you sure you want to reject "${jobTitle}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setJobsData(prevData => {
              const jobToCancel = prevData.active.find(job => job.id === jobId);
              if (jobToCancel) {
                const updatedActive = prevData.active.filter(job => job.id !== jobId);
                const cancelledJob = { ...jobToCancel, status: 'cancelled', cancelledDate: new Date().toLocaleDateString() };
                return {
                  ...prevData,
                  active: updatedActive,
                  cancelled: [...prevData.cancelled, cancelledJob],
                };
              }
              return prevData;
            });
            Alert.alert('Job Rejected', 'The job has been moved to cancelled.');
          },
        },
      ]
    );
  };

  const handleMarkComplete = (jobId, jobTitle) => {
    Alert.alert(
      'Mark as Complete',
      `Are you sure you want to mark "${jobTitle}" as completed?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Complete',
          onPress: () => {
            setJobsData(prevData => {
              const jobToComplete = prevData.active.find(job => job.id === jobId);
              if (jobToComplete) {
                const updatedActive = prevData.active.filter(job => job.id !== jobId);
                const completedJob = { ...jobToComplete, status: 'completed', completedDate: new Date().toLocaleDateString() };
                return {
                  ...prevData,
                  active: updatedActive,
                  completed: [...prevData.completed, completedJob],
                };
              }
              return prevData;
            });
            Alert.alert('Success', 'Job marked as completed!');
          },
        },
      ]
    );
  };

  const handleGetDirections = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Unable to open maps');
      console.error('Maps error:', err);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return COLORS.primary;
      case 'scheduled': return COLORS.accent;
      case 'pending': return '#f59e0b';
      case 'completed': return COLORS.secondary;
      case 'cancelled': return '#ef4444';
      default: return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ongoing': return 'play-circle';
      case 'scheduled': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'completed': return 'checkmark-done-circle';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Week Filter Modal */}
      <Modal
        visible={showWeekFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWeekFilter(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowWeekFilter(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Time Period</Text>
              <TouchableOpacity 
                onPress={() => setShowWeekFilter(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weekOptionsContainer}>
              {weekOptions.map((week) => (
                <TouchableOpacity
                  key={week}
                  style={[
                    styles.weekOption,
                    selectedWeek === week && styles.weekOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedWeek(week);
                    setShowWeekFilter(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.weekOptionContent}>
                    <Icon 
                      name={
                        week.includes('Week') ? 'calendar-outline' :
                        week.includes('Month') ? 'calendar' :
                        'time-outline'
                      } 
                      size={22} 
                      color={selectedWeek === week ? COLORS.white : COLORS.primary} 
                    />
                    <Text style={[
                      styles.weekOptionText,
                      selectedWeek === week && styles.weekOptionTextSelected
                    ]}>
                      {week}
                    </Text>
                  </View>
                  {selectedWeek === week && (
                    <Icon name="checkmark-circle" size={24} color={COLORS.white} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="briefcase" size={28} color={COLORS.white} />
            <View>
              <Text style={styles.headerTitle}>My Calls</Text>
              <Text style={styles.headerSubtitle}>{selectedWeek}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.filterButton} 
            activeOpacity={0.8}
            onPress={() => setShowWeekFilter(true)}
          >
            <Icon name="filter-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active
          </Text>
          {jobsData.active.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{jobsData.active.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cancelled' && styles.tabActive]}
          onPress={() => setActiveTab('cancelled')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.tabTextActive]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {jobsData[activeTab].length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Icon name="briefcase-outline" size={64} color={COLORS.border} />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab} jobs</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active' && 'Your active jobs will appear here'}
              {activeTab === 'completed' && 'Your completed jobs will appear here'}
              {activeTab === 'cancelled' && 'Your cancelled jobs will appear here'}
            </Text>
          </View>
        ) : (
          jobsData[activeTab].map((job) => {
            const isExpanded = expandedJobId === job.id;
            return (
              <View
                key={job.id}
                style={styles.jobCard}
              >
                <View style={styles.jobHeader}>
                  <View style={styles.jobTitleContainer}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(job.status)}15` }]}>
                      <Icon name={getStatusIcon(job.status)} size={14} color={getStatusColor(job.status)} />
                      <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.jobDetails}>
                  <View style={styles.jobDetailRow}>
                    <Icon name="person-outline" size={18} color={COLORS.textSecondary} />
                    <Text style={styles.jobDetailText}>{job.customer}</Text>
                  </View>
                  <View style={styles.jobDetailRow}>
                    <Icon name="location-outline" size={18} color={COLORS.textSecondary} />
                    <Text style={styles.jobDetailText}>{job.location}</Text>
                  </View>
                  <View style={styles.jobDetailRow}>
                    <Icon name="calendar-outline" size={18} color={COLORS.textSecondary} />
                    <Text style={styles.jobDetailText}>{job.date}</Text>
                  </View>
                </View>

                {/* Expanded Details */}
                {isExpanded && (
                  <View style={styles.expandedDetails}>
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Description</Text>
                      <Text style={styles.detailSectionText}>{job.description}</Text>
                    </View>

                    <View style={styles.detailSection}>
                      <View style={styles.jobDetailRow}>
                        <Icon name="time-outline" size={18} color={COLORS.textSecondary} />
                        <Text style={styles.jobDetailText}>Duration: {job.duration}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.phoneRow}
                        onPress={() => handleCall(job.phone, job.customer)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.jobDetailRow}>
                          <Icon name="call-outline" size={18} color={COLORS.secondary} />
                          <Text style={[styles.jobDetailText, styles.phoneText]}>{job.phone}</Text>
                        </View>
                        <Icon name="call" size={20} color={COLORS.secondary} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Requirements</Text>
                      <Text style={styles.detailSectionText}>{job.requirements}</Text>
                    </View>

                    {job.status === 'pending' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.actionButtonAccept} 
                          activeOpacity={0.8}
                          onPress={() => handleAcceptJob(job.id, job.title)}
                        >
                          <Icon name="checkmark-circle" size={20} color={COLORS.white} />
                          <Text style={styles.actionButtonPrimaryText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionButtonReject} 
                          activeOpacity={0.8}
                          onPress={() => handleRejectJob(job.id, job.title)}
                        >
                          <Icon name="close-circle" size={20} color={COLORS.white} />
                          <Text style={styles.actionButtonPrimaryText}>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {job.status === 'ongoing' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.actionButtonPrimary} 
                          activeOpacity={0.8}
                          onPress={() => handleMarkComplete(job.id, job.title)}
                        >
                          <Icon name="checkmark-circle" size={20} color={COLORS.white} />
                          <Text style={styles.actionButtonPrimaryText}>Mark Complete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionButtonSecondary} 
                          activeOpacity={0.8}
                          onPress={() => handleCall(job.phone, job.customer)}
                        >
                          <Icon name="call" size={20} color={COLORS.secondary} />
                          <Text style={styles.actionButtonSecondaryText}>Call Customer</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {job.status === 'scheduled' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.actionButtonPrimary} 
                          activeOpacity={0.8}
                          onPress={() => handleGetDirections(job.location)}
                        >
                          <Icon name="navigate" size={20} color={COLORS.white} />
                          <Text style={styles.actionButtonPrimaryText}>Get Directions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionButtonSecondary} 
                          activeOpacity={0.8}
                          onPress={() => handleCall(job.phone, job.customer)}
                        >
                          <Icon name="call" size={20} color={COLORS.secondary} />
                          <Text style={styles.actionButtonSecondaryText}>Call Customer</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {job.status === 'completed' && job.rating && (
                      <View style={styles.completedInfo}>
                        <View style={styles.ratingDisplay}>
                          <Icon name="star" size={20} color="#f59e0b" />
                          <Text style={styles.ratingDisplayText}>Rated {job.rating}.0 by customer</Text>
                        </View>
                      </View>
                    )}

                    {job.status === 'cancelled' && job.cancelledDate && (
                      <View style={styles.cancelledInfo}>
                        <View style={styles.cancelledDisplay}>
                          <Icon name="close-circle" size={20} color="#ef4444" />
                          <Text style={styles.cancelledDisplayText}>Cancelled on {job.cancelledDate}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.jobFooter}>
                  <View style={styles.paymentContainer}>
                    <Icon name="cash-outline" size={20} color={COLORS.secondary} />
                    <Text style={styles.paymentText}>{job.payment}</Text>
                  </View>
                  {job.rating && (
                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={16} color="#f59e0b" />
                      <Text style={styles.ratingText}>{job.rating}.0</Text>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.viewButton} 
                    activeOpacity={0.7}
                    onPress={() => toggleJobDetails(job.id)}
                  >
                    <Text style={styles.viewButtonText}>
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </Text>
                    <Icon 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={COLORS.accent} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  jobHeader: {
    marginBottom: 16,
  },
  jobTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  jobTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobDetails: {
    gap: 12,
    marginBottom: 16,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  jobDetailText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  phoneText: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
  },
  expandedDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: 16,
  },
  detailSection: {
    gap: 8,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  detailSectionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  actionButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  completedInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  ratingDisplayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  cancelledInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  cancelledDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  cancelledDisplayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
  },
  actionButtonAccept: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonReject: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekOptionsContainer: {
    padding: 12,
  },
  weekOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  weekOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  weekOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weekOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  weekOptionTextSelected: {
    color: COLORS.white,
  },
});

export default CallsScreen;
