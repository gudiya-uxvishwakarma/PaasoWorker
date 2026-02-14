import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Switch,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Path, Circle, Rect, G, Text as SvgText } from 'react-native-svg';
import COLORS from '../../constants/colors';
import ScheduleModal from '../../components/ScheduleModal';

// Circular Progress Component
const CircularProgress = ({ percentage, size = 100, strokeWidth = 8, color = COLORS.secondary }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = circumference - (percentage / 100) * circumference;
  
  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Percentage text */}
      <SvgText
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy=".3em"
        fontSize="24"
        fontWeight="900"
        fill={color}
      >
        {percentage}%
      </SvgText>
    </Svg>
  );
};

// Enhanced Mini Chart Component with Gradient
const MiniChart = ({ data, color, type = 'line' }) => {
  const chartWidth = 120;
  const chartHeight = 50;
  const padding = 4;
  
  if (type === 'bar') {
    const barWidth = (chartWidth - padding * (data.length + 1)) / data.length;
    const maxValue = Math.max(...data);
    
    return (
      <Svg width={chartWidth} height={chartHeight} style={styles.chartSvg}>
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * (chartHeight - padding * 2);
          const x = padding + index * (barWidth + padding);
          const y = chartHeight - barHeight - padding;
          
          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              opacity={0.7 + (index / data.length) * 0.3}
              rx={2}
            />
          );
        })}
      </Svg>
    );
  }
  
  // Line chart with area
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - padding - ((value - minValue) / range) * (chartHeight - padding * 2);
    return { x, y };
  });
  
  // Create path for line
  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }
  
  // Create area path
  let areaPath = pathData + ` L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
  
  return (
    <Svg width={chartWidth} height={chartHeight} style={styles.chartSvg}>
      {/* Area fill */}
      <Path
        d={areaPath}
        fill={color}
        opacity={0.15}
      />
      {/* Line */}
      <Path
        d={pathData}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Points */}
      {points.map((point, index) => (
        <Circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={2.5}
          fill={color}
        />
      ))}
    </Svg>
  );
};

const  DashboardScreen = ({ userData, onNavigate }) => {
  const [availability, setAvailability] = useState('online');
  const [hideNumber, setHideNumber] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  const getAvailabilityColor = () => {
    switch (availability) {
      case 'online': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Modern Header with Gradient */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>👋 Welcome back</Text>
              <Text style={styles.userName}>{userData?.name || 'Worker'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => onNavigate('verification')}
              activeOpacity={0.8}
            >
              <Icon name="person" size={26} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Modern Availability Toggle - Compact */}
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityHeader}>
            <View>
              <Text style={styles.cardTitle}>Your Status</Text>
            </View>
            <View style={[styles.statusIndicator, { backgroundColor: getAvailabilityColor() }]}>
              <Icon name="pulse" size={16} color={COLORS.white} />
            </View>
          </View>
          
          <View style={styles.statusToggleRow}>
            {[
              { key: 'online', icon: 'checkmark-circle', label: 'Online', color: '#10b981', gradient: ['#10b981', '#059669'] },
              { key: 'busy', icon: 'time', label: 'Busy', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] },
              { key: 'offline', icon: 'close-circle', label: 'Offline', color: '#ef4444', gradient: ['#ef4444', '#dc2626'] }
            ].map((status) => (
              <TouchableOpacity
                key={status.key}
                style={[
                  styles.statusToggle,
                  availability === status.key && {
                    backgroundColor: status.color,
                    transform: [{ scale: 1.05 }],
                  },
                ]}
                onPress={() => setAvailability(status.key)}
                activeOpacity={0.7}
              >
                <Icon 
                  name={status.icon} 
                  size={18} 
                  color={availability === status.key ? COLORS.white : status.color} 
                />
                <Text
                  style={[
                    styles.statusToggleText,
                    availability === status.key && { color: COLORS.white, fontWeight: '900' },
                  ]}
                >
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitleMain}> Your Analytics</Text>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderLeftColor: COLORS.accent, borderLeftWidth: 4 }]}>
              <View style={styles.chartContainer}>
                <MiniChart 
                  data={[85, 92, 78, 95, 110, 105, 127]} 
                  color={COLORS.accent}
                  type="line"
                />
              </View>
              <Text style={styles.statLabel}>Profile Views</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: COLORS.secondary, borderLeftWidth: 4 }]}>
              <View style={styles.chartContainer}>
                <CircularProgress 
                  percentage={75} 
                  size={80} 
                  strokeWidth={8} 
                  color={COLORS.secondary}
                />
              </View>
              <Text style={styles.statLabel}>Contact Unlocks</Text>
            </View>
          </View>
        </View>

        {/* Modern Performance Metrics */}
        <View style={styles.performanceCard}>
          <View style={styles.performanceHeader}>
            <View>
              <Text style={styles.cardTitle}>⚡ Performance</Text>
              <Text style={styles.cardSubtitle}>This week's highlights</Text>
            </View>

          </View>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricItemModern}>
              <View style={[styles.metricIconCircle, { backgroundColor: '#10b98120' }]}>
                <Icon name="checkmark-done" size={24} color="#10b981" />
              </View>
              <Text style={styles.metricValueLarge}>12</Text>
              <Text style={styles.metricLabelModern}>Jobs Done</Text>
              <View style={styles.metricProgress}>
                <View style={[styles.metricProgressBar, { width: '75%', backgroundColor: '#10b981' }]} />
              </View>
            </View>

            <View style={styles.metricItemModern}>
              <View style={[styles.metricIconCircle, { backgroundColor: '#f59e0b20' }]}>
                <Icon name="star" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.metricValueLarge}>4.8</Text>
              <Text style={styles.metricLabelModern}>Rating</Text>
              <View style={styles.metricProgress}>
                <View style={[styles.metricProgressBar, { width: '96%', backgroundColor: '#f59e0b' }]} />
              </View>
            </View>

            <View style={styles.metricItemModern}>
              <View style={[styles.metricIconCircle, { backgroundColor: `${COLORS.accent}20` }]}>
                <Icon name="time" size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.metricValueLarge}>2.5h</Text>
              <Text style={styles.metricLabelModern}>Response</Text>
              <View style={styles.metricProgress}>
                <View style={[styles.metricProgressBar, { width: '60%', backgroundColor: COLORS.accent }]} />
              </View>
            </View>

            <View style={styles.metricItemModern}>
              <View style={[styles.metricIconCircle, { backgroundColor: `${COLORS.secondary}20` }]}>
                <Icon name="trending-up" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.metricValueLarge}>85%</Text>
              <Text style={styles.metricLabelModern}>Success</Text>
              <View style={styles.metricProgress}>
                <View style={[styles.metricProgressBar, { width: '85%', backgroundColor: COLORS.secondary }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Modern Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}> Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionItemModern}
            onPress={() => setScheduleModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconModern, { backgroundColor: `${COLORS.accent}15` }]}>
              <Icon name="calendar" size={24} color={COLORS.accent} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Set Working Hours</Text>
              <Text style={styles.actionSubtitle}>Manage your availability schedule</Text>
            </View>
            <View style={styles.actionArrow}>
              <Icon name="arrow-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItemModern} 
            activeOpacity={0.7}
            onPress={() => onNavigate('verification')}
          >
            <View style={[styles.actionIconModern, { backgroundColor: `${COLORS.secondary}15` }]}>
              <Icon name="shield-checkmark" size={24} color={COLORS.secondary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Get Verified</Text>
              <Text style={styles.actionSubtitle}>Upload KYC documents for trust badge</Text>
            </View>
            <View style={styles.actionArrow}>
              <Icon name="arrow-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          {userData?.workerType === 'crew_leader' && (
            <TouchableOpacity 
              style={styles.actionItemModern} 
              activeOpacity={0.7}
              onPress={() => onNavigate('teamManagement')}
            >
              <View style={[styles.actionIconModern, { backgroundColor: `${COLORS.primary}15` }]}>
                <Icon name="people" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Manage Team</Text>
                <Text style={styles.actionSubtitle}>Add or remove team members</Text>
              </View>
              <View style={styles.actionArrow}>
                <Icon name="arrow-forward" size={20} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Modern Privacy Card */}
        <View style={styles.privacyCardModern}>
          <View style={styles.privacyHeaderRow}>
            <View style={[styles.privacyIconLarge, { backgroundColor: `${COLORS.primary}15` }]}>
              <Icon name="lock-closed" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.privacyTextContainer}>
              <Text style={styles.privacyTitleModern}>Hide Phone Number</Text>
              <Text style={styles.privacySubtitleModern}>
                Customers will request to view your contact
              </Text>
            </View>
            <Switch
              value={hideNumber}
              onValueChange={setHideNumber}
              trackColor={{ false: '#e5e7eb', true: `${COLORS.secondary}50` }}
              thumbColor={hideNumber ? COLORS.secondary : '#f3f4f6'}
              ios_backgroundColor="#e5e7eb"
            />
          </View>
        </View>

        {/* Premium Boost Card - Modern Design */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumGradient}>
            <View style={styles.premiumHeader}>
              <View style={styles.premiumIconContainer}>
                <Icon name="rocket" size={32} color="#fff" />
              </View>
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumTitle}>🌟 Boost Your Visibility</Text>
                <Text style={styles.premiumSubtitle}>Get 3x more customers with premium</Text>
              </View>
            </View>

            <View style={styles.premiumFeatures}>
              <View style={styles.premiumFeatureItem}>
                <View style={styles.premiumFeatureIcon}>
                  <Icon name="star" size={20} color="#f59e0b" />
                </View>
                <View style={styles.premiumFeatureInfo}>
                  <Text style={styles.premiumFeatureTitle}>Featured Listing</Text>
                  <Text style={styles.premiumFeatureDesc}>Top placement in search results</Text>
                </View>
                <View style={styles.premiumPrice}>
                  <Text style={styles.premiumPriceAmount}>₹299</Text>
                  <Text style={styles.premiumPricePeriod}>/week</Text>
                </View>
              </View>

              <View style={styles.premiumFeatureItem}>
                <View style={styles.premiumFeatureIcon}>
                  <Icon name="shield-checkmark" size={20} color={COLORS.secondary} />
                </View>
                <View style={styles.premiumFeatureInfo}>
                  <Text style={styles.premiumFeatureTitle}>Verified Badge</Text>
                  <Text style={styles.premiumFeatureDesc}>Build instant customer trust</Text>
                </View>
                <View style={styles.premiumPrice}>
                  <Text style={styles.premiumPriceAmount}>₹499</Text>
                  <Text style={styles.premiumPricePeriod}>/year</Text>
                </View>
              </View>

              <View style={styles.premiumFeatureItem}>
                <View style={styles.premiumFeatureIcon}>
                  <Icon name="diamond" size={20} color={COLORS.accent} />
                </View>
                <View style={styles.premiumFeatureInfo}>
                  <Text style={styles.premiumFeatureTitle}>Pro Subscription</Text>
                  <Text style={styles.premiumFeatureDesc}>All features + analytics</Text>
                </View>
                <View style={styles.premiumPrice}>
                  <Text style={styles.premiumPriceAmount}>₹999</Text>
                  <Text style={styles.premiumPricePeriod}>/month</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.premiumButton} 
              activeOpacity={0.9}
              onPress={() => onNavigate('subscription')}
            >
              <Text style={styles.premiumButtonText}>Explore Premium Plans</Text>
              <Icon name="arrow-forward-circle" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Schedule Modal */}
      <ScheduleModal 
        visible={scheduleModalVisible}
        onClose={() => setScheduleModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: 40,
    elevation: 0,
  },
  headerGradient: {
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  userName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  profileButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  
  // Modern Availability Card - Compact
  availabilityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  statusToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusToggle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 14,
  },
  statusMessageText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    fontWeight: '500',
  },

  // Stats Section - Compact
  statsContainer: {
    marginBottom: 16,
  },
  sectionTitleMain: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#10b98115',
    borderRadius: 10,
  },
  statTrendText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10b981',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  chartSvg: {
    marginVertical: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  statPeriod: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // Performance Card - Compact
  performanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricItemModern: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  metricIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricValueLarge: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  metricLabelModern: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  metricProgress: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  metricProgressBar: {
    height: '100%',
    borderRadius: 3,
  },

  // Actions Card - Compact
  actionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  actionItemModern: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIconModern: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    fontWeight: '500',
  },
  actionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Privacy Card - Compact
  privacyCardModern: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  privacyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  privacyIconLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyTitleModern: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  privacySubtitleModern: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    fontWeight: '500',
  },

  // Premium Card - Compact
  premiumCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  premiumGradient: {
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  premiumIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 3,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  premiumFeatures: {
    gap: 10,
    marginBottom: 16,
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 12,
    borderRadius: 16,
    gap: 10,
  },
  premiumFeatureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumFeatureInfo: {
    flex: 1,
  },
  premiumFeatureTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 2,
  },
  premiumFeatureDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  premiumPrice: {
    alignItems: 'flex-end',
  },
  premiumPriceAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  premiumPricePeriod: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 3,
  },
  premiumButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary,
  },
  
  bottomPadding: {
    height: 40,
  },
});

export default  DashboardScreen;
