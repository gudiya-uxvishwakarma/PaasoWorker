import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';

const TeamManagementScreen = ({ onBack, userData }) => {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      skills: 'Plumbing, Electrical',
      status: 'active',
      joinedDate: '2024-01-15',
      completedJobs: 45,
      rating: 4.7,
    },
    {
      id: 2,
      name: 'Amit Singh',
      phone: '+91 98765 43211',
      skills: 'Carpentry, Painting',
      status: 'active',
      joinedDate: '2024-02-20',
      completedJobs: 32,
      rating: 4.5,
    },
    {
      id: 3,
      name: 'Suresh Patel',
      phone: '+91 98765 43212',
      skills: 'Masonry, Tiling',
      status: 'inactive',
      joinedDate: '2023-12-10',
      completedJobs: 28,
      rating: 4.3,
    },
  ]);

  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    skills: '',
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.phone || !newMember.skills) {
      Alert.alert('Required', 'Please fill all fields');
      return;
    }

    const member = {
      id: teamMembers.length + 1,
      ...newMember,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      completedJobs: 0,
      rating: 0,
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', phone: '', skills: '' });
    setAddMemberModalVisible(false);
    Alert.alert('Success', 'Team member added successfully');
  };

  const handleRemoveMember = (memberId) => {
    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this team member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setTeamMembers(teamMembers.filter(m => m.id !== memberId));
          },
        },
      ]
    );
  };

  const toggleMemberStatus = (memberId) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
  };

  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  const totalJobs = teamMembers.reduce((sum, m) => sum + m.completedJobs, 0);
  const avgRating = teamMembers.length > 0
    ? (teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1)
    : 0;

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
            <Text style={styles.title}>👥 Team Management</Text>
            <Text style={styles.subtitle}>Manage your crew members</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Team Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
                <Icon name="people" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{activeMembers}/{teamMembers.length}</Text>
              <Text style={styles.statLabel}>Active Members</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.secondary}15` }]}>
                <Icon name="checkmark-done" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.statValue}>{totalJobs}</Text>
              <Text style={styles.statLabel}>Total Jobs</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.accent}15` }]}>
                <Icon name="star" size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.statValue}>{avgRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* Add Member Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddMemberModalVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="add-circle" size={24} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add Team Member</Text>
        </TouchableOpacity>

        {/* Team Members List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Members ({teamMembers.length})</Text>

          {teamMembers.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <View style={[
                  styles.memberAvatar,
                  { backgroundColor: member.status === 'active' ? `${COLORS.primary}15` : '#e5e7eb' }
                ]}>
                  <Text style={styles.memberAvatarText}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>

                <View style={styles.memberInfo}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: member.status === 'active' ? '#10b98115' : '#ef444415' }
                    ]}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: member.status === 'active' ? '#10b981' : '#ef4444' }
                      ]} />
                      <Text style={[
                        styles.statusText,
                        { color: member.status === 'active' ? '#10b981' : '#ef4444' }
                      ]}>
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.memberDetail}>
                    <Icon name="call" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.memberDetailText}>{member.phone}</Text>
                  </View>

                  <View style={styles.memberDetail}>
                    <Icon name="construct" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.memberDetailText}>{member.skills}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.memberStats}>
                <View style={styles.memberStatItem}>
                  <Icon name="checkmark-circle" size={16} color={COLORS.secondary} />
                  <Text style={styles.memberStatText}>{member.completedJobs} jobs</Text>
                </View>
                <View style={styles.memberStatItem}>
                  <Icon name="star" size={16} color="#f59e0b" />
                  <Text style={styles.memberStatText}>{member.rating} rating</Text>
                </View>
                <View style={styles.memberStatItem}>
                  <Icon name="calendar" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.memberStatText}>Since {member.joinedDate}</Text>
                </View>
              </View>

              <View style={styles.memberActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: member.status === 'active' ? '#f59e0b15' : `${COLORS.secondary}15` }
                  ]}
                  onPress={() => toggleMemberStatus(member.id)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={member.status === 'active' ? 'pause' : 'play'}
                    size={18}
                    color={member.status === 'active' ? '#f59e0b' : COLORS.secondary}
                  />
                  <Text style={[
                    styles.actionButtonText,
                    { color: member.status === 'active' ? '#f59e0b' : COLORS.secondary }
                  ]}>
                    {member.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#ef444415' }]}
                  onPress={() => handleRemoveMember(member.id)}
                  activeOpacity={0.7}
                >
                  <Icon name="trash" size={18} color="#ef4444" />
                  <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Member Modal */}
      <Modal
        visible={addMemberModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddMemberModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Team Member</Text>
              <TouchableOpacity
                onPress={() => setAddMemberModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter member name"
                  value={newMember.name}
                  onChangeText={(text) => setNewMember({ ...newMember, name: text })}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 XXXXX XXXXX"
                  value={newMember.phone}
                  onChangeText={(text) => setNewMember({ ...newMember, phone: text })}
                  keyboardType="phone-pad"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Skills *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="e.g., Plumbing, Electrical"
                  value={newMember.skills}
                  onChangeText={(text) => setNewMember({ ...newMember, skills: text })}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleAddMember}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSubmitButtonText}>Add Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    elevation: 6,
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
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  memberCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  memberHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  memberDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  memberDetailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  memberStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 12,
  },
  memberStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberStatText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  memberActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalSubmitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
  },
  modalSubmitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  bottomPadding: {
    height: 40,
  },
});

export default TeamManagementScreen;
