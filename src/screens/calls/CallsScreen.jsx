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
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';

const CallsScreen = ({ navigation }) => {
  // ✅ Use global language context for language persistence
  const { selectedLanguage } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('active');
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [showWeekFilter, setShowWeekFilter] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState('');
  const [jobToCancel, setJobToCancel] = useState(null);
  
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
    cancelled: [
      {
        id: 5,
        title: 'Painting Work',
        customer: 'Neha Singh',
        location: 'Rohini, Delhi',
        date: 'Yesterday, 11:00 AM',
        status: 'cancelled',
        payment: '₹4,000',
        description: 'Room painting and wall preparation work.',
        duration: '4-5 hours',
        phone: '+91 98765 43214',
        requirements: 'Painting tools, brushes, paint',
        cancelledDate: new Date().toLocaleDateString(),
        cancelledTime: new Date().toLocaleTimeString(),
        cancelReason: 'Schedule conflict',
        cancelledBy: 'Worker'
      },
    ],
  });

  const cancelReasons = [
    { id: 1, label: 'Too far location', icon: 'location-outline' },
    { id: 2, label: 'Not available', icon: 'time-outline' },
    { id: 3, label: 'Schedule conflict', icon: 'calendar-outline' },
    { id: 4, label: 'Job not suitable', icon: 'close-circle-outline' },
    { id: 5, label: 'Other', icon: 'ellipsis-horizontal-outline' },
  ];

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
                job.id === jobId ? { ...job, status: 'accepted' } : job
              );
              return { ...prevData, active: updatedActive };
            });
            Alert.alert('Success', 'Job accepted successfully!');
          },
        },
      ]
    );
  };

  const handleStartJob = (jobId, jobTitle) => {
    Alert.alert(
      'Start Job',
      `Are you ready to start "${jobTitle}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Start',
          onPress: () => {
            setJobsData(prevData => {
              const updatedActive = prevData.active.map(job =>
                job.id === jobId ? { ...job, status: 'in_progress' } : job
              );
              return { ...prevData, active: updatedActive };
            });
            Alert.alert('Job Started', 'Job is now in progress!');
          },
        },
      ]
    );
  };

  const handleRejectJob = (jobId, jobTitle) => {
    setJobToCancel({ id: jobId, title: jobTitle });
    setShowCancelModal(true);
  };

  const confirmCancelJob = () => {
    if (!selectedCancelReason) {
      Alert.alert('Required', 'Please select a cancellation reason');
      return;
    }

    if (jobToCancel) {
      setJobsData(prevData => {
        const job = prevData.active.find(j => j.id === jobToCancel.id);
        if (job) {
          const updatedActive = prevData.active.filter(j => j.id !== jobToCancel.id);
          const cancelledJob = { 
            ...job, 
            status: 'cancelled', 
            cancelledDate: new Date().toLocaleDateString(),
            cancelledTime: new Date().toLocaleTimeString(),
            cancelReason: selectedCancelReason,
            cancelledBy: 'Worker'
          };
          return {
            ...prevData,
            active: updatedActive,
            cancelled: [...prevData.cancelled, cancelledJob],
          };
        }
        return prevData;
      });
      
      setShowCancelModal(false);
      setSelectedCancelReason('');
      setJobToCancel(null);
      Alert.alert('Job Cancelled', 'The job has been moved to cancelled.');
    }
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
              const job = prevData.active.find(j => j.id === jobId);
              if (job) {
                const updatedActive = prevData.active.filter(j => j.id !== jobId);
                const completedJob = { 
                  ...job, 
                  status: 'completed', 
                  completedDate: new Date().toLocaleDateString(),
                  completedTime: new Date().toLocaleTimeString(),
                  paymentStatus: 'Paid',
                  rating: 5 // Default rating, can be updated later
                };
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
      case 'in_progress': return '#f97316';
      case 'accepted': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_progress': return 'play-circle';
      case 'accepted': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'completed': return 'checkmark-done-circle';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'accepted': return 'Accepted';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Cancel Reason Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Job</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowCancelModal(false);
                  setSelectedCancelReason('');
                  setJobToCancel(null);
                }}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cancelModalBody}>
              <Text style={styles.cancelModalText}>
                Please select a reason for cancelling "{jobToCancel?.title}":
              </Text>
              
              <View style={styles.reasonsList}>
                {cancelReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason.id}
                    style={[
                      styles.reasonOption,
                      selectedCancelReason === reason.label && styles.reasonOptionSelected
                    ]}
                    onPress={() => setSelectedCancelReason(reason.label)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.reasonContent}>
                      <Icon 
                        name={reason.icon} 
                        size={22} 
                        color={selectedCancelReason === reason.label ? COLORS.white : COLORS.textPrimary} 
                      />
                      <Text style={[
                        styles.reasonText,
                        selectedCancelReason === reason.label && styles.reasonTextSelected
                      ]}>
                        {reason.label}
                      </Text>
                    </View>
                    {selectedCancelReason === reason.label && (
                      <Icon name="checkmark-circle" size={24} color={COLORS.white} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.cancelModalButtons}>
                <TouchableOpacity 
                  style={styles.cancelModalButtonSecondary}
                  onPress={() => {
                    setShowCancelModal(false);
                    setSelectedCancelReason('');
                    setJobToCancel(null);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelModalButtonSecondaryText}>Go Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelModalButtonPrimary}
                  onPress={confirmCancelJob}
                  activeOpacity={0.8}
                >
                  <Icon name="close-circle" size={20} color={COLORS.white} />
                  <Text style={styles.cancelModalButtonPrimaryText}>Cancel Job</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
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

                {/* Expanded Details Section */}
                {isExpanded && (
                  <View style={styles.expandedDetails}>
                    {/* Customer Details Card */}
                    <View style={styles.detailCard}>
                      <View style={styles.detailCardHeader}>
                        <Icon name="person" size={20} color={COLORS.primary} />
                        <Text style={styles.detailCardTitle}>Customer Details</Text>
                      </View>
                      <View style={styles.detailCardContent}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Name:</Text>
                          <Text style={styles.detailValue}>{job.customer}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Service:</Text>
                          <Text style={styles.detailValue}>{job.title}</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.callButtonInline}
                          onPress={() => handleCall(job.phone, job.customer)}
                          activeOpacity={0.7}
                          disabled={job.status !== 'accepted' && job.status !== 'in_progress'}
                        >
                          <Icon name="call" size={20} color={COLORS.white} />
                          <Text style={styles.callButtonText}>{job.phone}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Job Details Card */}
                    <View style={styles.detailCard}>
                      <View style={styles.detailCardHeader}>
                        <Icon name="briefcase" size={20} color={COLORS.primary} />
                        <Text style={styles.detailCardTitle}>Job / Booking Details</Text>
                      </View>
                      <View style={styles.detailCardContent}>
                        <View style={styles.detailRowWithIcon}>
                          <Icon name="location" size={18} color={COLORS.textSecondary} />
                          <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Address</Text>
                            <Text style={styles.detailValue}>{job.location}</Text>
                          </View>
                        </View>
                        
                        <TouchableOpacity 
                          style={styles.mapButton}
                          onPress={() => handleGetDirections(job.location)}
                          activeOpacity={0.7}
                        >
                          <Icon name="navigate" size={18} color={COLORS.secondary} />
                          <Text style={styles.mapButtonText}>Get Directions</Text>
                        </TouchableOpacity>

                        <View style={styles.detailRowWithIcon}>
                          <Icon name="calendar" size={18} color={COLORS.textSecondary} />
                          <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Date & Time</Text>
                            <Text style={styles.detailValue}>{job.date}</Text>
                          </View>
                        </View>

                        <View style={styles.detailRowWithIcon}>
                          <Icon name="time" size={18} color={COLORS.textSecondary} />
                          <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Duration</Text>
                            <Text style={styles.detailValue}>{job.duration}</Text>
                          </View>
                        </View>

                        <View style={styles.descriptionBox}>
                          <Text style={styles.descriptionLabel}>Service Description</Text>
                          <Text style={styles.descriptionText}>{job.description}</Text>
                        </View>

                        <View style={styles.priceBox}>
                          <Icon name="cash" size={24} color={COLORS.secondary} />
                          <View>
                            <Text style={styles.priceLabel}>Payment Amount</Text>
                            <Text style={styles.priceValue}>{job.payment}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons based on Status */}
                    {job.status === 'pending' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.acceptButton}
                          onPress={() => handleAcceptJob(job.id, job.title)}
                          activeOpacity={0.8}
                        >
                          <Icon name="checkmark-circle" size={20} color={COLORS.white} />
                          <Text style={styles.acceptButtonText}>Accept Job</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.rejectButton}
                          onPress={() => handleRejectJob(job.id, job.title)}
                          activeOpacity={0.8}
                        >
                          <Icon name="close-circle" size={20} color={COLORS.white} />
                          <Text style={styles.rejectButtonText}>Reject Job</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {job.status === 'accepted' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.startButton}
                          onPress={() => handleStartJob(job.id, job.title)}
                          activeOpacity={0.8}
                        >
                          <Icon name="play-circle" size={20} color={COLORS.white} />
                          <Text style={styles.startButtonText}>Start Job</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.callButtonAction}
                          onPress={() => handleCall(job.phone, job.customer)}
                          activeOpacity={0.8}
                        >
                          <Icon name="call" size={20} color={COLORS.secondary} />
                          <Text style={styles.callButtonActionText}>Call Customer</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {job.status === 'accepted' && (
                      <TouchableOpacity 
                        style={styles.cancelJobButton}
                        onPress={() => handleRejectJob(job.id, job.title)}
                        activeOpacity={0.8}
                      >
                        <Icon name="close-circle-outline" size={18} color="#ef4444" />
                        <Text style={styles.cancelJobButtonText}>Cancel Job</Text>
                      </TouchableOpacity>
                    )}

                    {job.status === 'in_progress' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.completeButton}
                          onPress={() => handleMarkComplete(job.id, job.title)}
                          activeOpacity={0.8}
                        >
                          <Icon name="checkmark-done-circle" size={20} color={COLORS.white} />
                          <Text style={styles.completeButtonText}>Complete Job</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.callButtonAction}
                          onPress={() => handleCall(job.phone, job.customer)}
                          activeOpacity={0.8}
                        >
                          <Icon name="call" size={20} color={COLORS.secondary} />
                          <Text style={styles.callButtonActionText}>Call Customer</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {job.status === 'in_progress' && (
                      <TouchableOpacity 
                        style={styles.cancelJobButton}
                        onPress={() => handleRejectJob(job.id, job.title)}
                        activeOpacity={0.8}
                      >
                        <Icon name="close-circle-outline" size={18} color="#ef4444" />
                        <Text style={styles.cancelJobButtonText}>Cancel Job</Text>
                      </TouchableOpacity>
                    )}

                    {/* Completed State Display */}
                    {job.status === 'completed' && (
                      <View style={styles.statusCard}>
                        <View style={[styles.statusCardHeader, { backgroundColor: '#d1fae5' }]}>
                          <Icon name="checkmark-done-circle" size={24} color="#10b981" />
                          <Text style={[styles.statusCardTitle, { color: '#10b981' }]}>Job Completed</Text>
                        </View>
                        <View style={styles.statusCardContent}>
                          <View style={styles.statusDetailRow}>
                            <Icon name="calendar-outline" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.statusDetailText}>
                              Completed on {job.completedDate} at {job.completedTime}
                            </Text>
                          </View>
                          <View style={styles.statusDetailRow}>
                            <Icon name="cash-outline" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.statusDetailText}>
                              Payment Status: <Text style={styles.paidText}>{job.paymentStatus || 'Paid'}</Text>
                            </Text>
                          </View>
                          {job.rating && (
                            <View style={styles.ratingBox}>
                              <Icon name="star" size={22} color="#f59e0b" />
                              <Text style={styles.ratingBoxText}>Customer Rating: {job.rating}.0/5.0</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )}

                    {/* Cancelled State Display */}
                    {job.status === 'cancelled' && (
                      <View style={styles.statusCard}>
                        <View style={[styles.statusCardHeader, { backgroundColor: '#fee2e2' }]}>
                          <Icon name="close-circle" size={24} color="#ef4444" />
                          <Text style={[styles.statusCardTitle, { color: '#ef4444' }]}>Job Cancelled</Text>
                        </View>
                        <View style={styles.statusCardContent}>
                          <View style={styles.statusDetailRow}>
                            <Icon name="person-outline" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.statusDetailText}>
                              Cancelled by: <Text style={styles.cancelledByText}>{job.cancelledBy || 'Worker'}</Text>
                            </Text>
                          </View>
                          <View style={styles.statusDetailRow}>
                            <Icon name="calendar-outline" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.statusDetailText}>
                              {job.cancelledDate} at {job.cancelledTime}
                            </Text>
                          </View>
                          {job.cancelReason && (
                            <View style={styles.cancelReasonBox}>
                              <Text style={styles.cancelReasonLabel}>Cancellation Reason:</Text>
                              <Text style={styles.cancelReasonText}>{job.cancelReason}</Text>
                            </View>
                          )}
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

                {/* Thin Action Buttons for Active Jobs - Always visible */}
                {activeTab === 'active' && (
                  <View style={styles.thinButtonsContainer}>
                    {/* Post Button - Always visible on all active cards */}
                    <TouchableOpacity 
                      style={styles.thinButton}
                      onPress={() => handleAcceptJob(job.id, job.title)}
                      activeOpacity={0.8}
                    >
                      <Icon name="checkmark-circle-outline" size={18} color="#3b82f6" />
                      <Text style={[styles.thinButtonText, { color: '#3b82f6' }]}>Post</Text>
                    </TouchableOpacity>
                    
                    {/* Cancel Button - Always visible on all active cards */}
                    <TouchableOpacity 
                      style={styles.thinButton}
                      onPress={() => handleRejectJob(job.id, job.title)}
                      activeOpacity={0.8}
                    >
                      <Icon name="close-circle-outline" size={18} color="#ef4444" />
                      <Text style={[styles.thinButtonText, { color: '#ef4444' }]}>Cancel</Text>
                    </TouchableOpacity>
                    
                    {/* Complete Button - Always visible on all active cards */}
                    <TouchableOpacity 
                      style={styles.thinButton}
                      onPress={() => handleMarkComplete(job.id, job.title)}
                      activeOpacity={0.8}
                    >
                      <Icon name="checkmark-done-circle-outline" size={18} color="#10b981" />
                      <Text style={[styles.thinButtonText, { color: '#10b981' }]}>Complete</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
  detailCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  detailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  detailCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  detailCardContent: {
    padding: 12,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailRowWithIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  callButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  mapButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  descriptionBox: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  rejectButton: {
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
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f97316',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  callButtonAction: {
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
  callButtonActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  cancelJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ef4444',
    marginTop: 10,
  },
  cancelJobButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  quickCancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#ef4444',
    elevation: 2,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickCancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  thinButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  thinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thinButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginTop: 8,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusCardContent: {
    padding: 12,
    gap: 10,
  },
  statusDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDetailText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  paidText: {
    fontWeight: 'bold',
    color: '#10b981',
  },
  cancelledByText: {
    fontWeight: 'bold',
    color: '#ef4444',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fef3c7',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  ratingBoxText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  cancelReasonBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
    marginTop: 4,
  },
  cancelReasonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 4,
  },
  cancelReasonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
    lineHeight: 20,
  },
  reasonsList: {
    gap: 10,
    marginBottom: 20,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reasonOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reasonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reasonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  reasonTextSelected: {
    color: COLORS.white,
  },
  cancelModalContent: {
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
  cancelModalBody: {
    padding: 20,
  },
  cancelModalText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 16,
    lineHeight: 22,
  },
  cancelModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelModalButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cancelModalButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    elevation: 2,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelModalButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
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
