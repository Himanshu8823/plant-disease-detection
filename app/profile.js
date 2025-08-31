import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user data from AsyncStorage
      const userString = await AsyncStorage.getItem('userData');
      if (userString) {
        const user = JSON.parse(userString);
        setUserData(user);
        
        // Fetch user statistics
        await fetchUserStats(user.uid);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/stats`);
      setUserStats(response.data.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Use mock data for development
      setUserStats({
        totalDetections: 25,
        successfulDetections: 22,
        successRate: 88.0,
        lastDetectionAt: new Date().toISOString(),
        accountCreatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLoginAt: new Date().toISOString(),
      });
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('isLoggedIn');
              // Navigate to login screen
              // You can use navigation here if needed
              Alert.alert('Success', 'Logged out successfully');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call API to delete account
              await axios.delete('http://localhost:5000/api/auth/account');
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('isLoggedIn');
              Alert.alert('Success', 'Account deleted successfully');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAccountAge = (createdAt) => {
    if (!createdAt) return 'N/A';
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#6b7280" />
        <Text style={styles.errorText}>No user data found</Text>
        <Text style={styles.errorSubtext}>Please login to view your profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons 
            name="person" 
            size={20} 
            color={activeTab === 'profile' ? '#ffffff' : '#22c55e'} 
          />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Ionicons 
            name="analytics" 
            size={20} 
            color={activeTab === 'stats' ? '#ffffff' : '#22c55e'} 
          />
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            Statistics
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Ionicons 
            name="settings" 
            size={20} 
            color={activeTab === 'settings' ? '#ffffff' : '#22c55e'} 
          />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'profile' && (
          <View style={styles.tabContent}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person-circle" size={100} color="#22c55e" />
              </View>
              <Text style={styles.userName}>{userData.displayName || 'User'}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
              <View style={styles.userRole}>
                <Ionicons name="shield-checkmark" size={16} color="#22c55e" />
                <Text style={styles.roleText}>
                  {userData.premium ? 'Premium User' : 'Standard User'}
                </Text>
              </View>
            </View>

            {/* Account Information */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Account Information</Text>
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color="#22c55e" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Display Name</Text>
                  <Text style={styles.infoValue}>{userData.displayName || 'Not set'}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="mail" size={20} color="#22c55e" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{userData.email}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={20} color="#22c55e" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoValue}>{userData.phoneNumber || 'Not set'}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={20} color="#22c55e" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>{formatDate(userStats?.accountCreatedAt)}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time" size={20} color="#22c55e" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Last Login</Text>
                  <Text style={styles.infoValue}>{formatDate(userStats?.lastLoginAt)}</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quick Actions</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="camera" size={24} color="#22c55e" />
                <Text style={styles.actionText}>New Detection</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="partly-sunny" size={24} color="#22c55e" />
                <Text style={styles.actionText}>Check Weather</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="analytics" size={24} color="#22c55e" />
                <Text style={styles.actionText}>View Analytics</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'stats' && (
          <View style={styles.tabContent}>
            {/* Statistics Overview */}
            {userStats && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Your Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userStats.totalDetections}</Text>
                    <Text style={styles.statLabel}>Total Detections</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userStats.successfulDetections}</Text>
                    <Text style={styles.statLabel}>Successful</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userStats.successRate}%</Text>
                    <Text style={styles.statLabel}>Success Rate</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{getAccountAge(userStats.accountCreatedAt)}</Text>
                    <Text style={styles.statLabel}>Account Age</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Recent Activity */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Activity</Text>
              <View style={styles.activityItem}>
                <Ionicons name="camera" size={20} color="#22c55e" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Plant Disease Detection</Text>
                  <Text style={styles.activitySubtitle}>Analyzed tomato plant for diseases</Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="partly-sunny" size={20} color="#22c55e" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Weather Check</Text>
                  <Text style={styles.activitySubtitle}>Viewed weather forecast for your location</Text>
                  <Text style={styles.activityTime}>1 day ago</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="analytics" size={20} color="#22c55e" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Analytics Review</Text>
                  <Text style={styles.activitySubtitle}>Checked your detection history</Text>
                  <Text style={styles.activityTime}>3 days ago</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              </View>
            </View>
          </View>
        )}

        {activeTab === 'settings' && (
          <View style={styles.tabContent}>
            {/* Account Settings */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Account Settings</Text>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="person" size={20} color="#22c55e" />
                <Text style={styles.settingText}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="lock-closed" size={20} color="#22c55e" />
                <Text style={styles.settingText}>Change Password</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="notifications" size={20} color="#22c55e" />
                <Text style={styles.settingText}>Notification Settings</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="language" size={20} color="#22c55e" />
                <Text style={styles.settingText}>Language & Region</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Data & Privacy */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Data & Privacy</Text>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="download" size={20} color="#22c55e" />
                <Text style={styles.settingText}>Export My Data</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="shield-checkmark" size={20} color="#22c55e" />
                <Text style={styles.settingText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="document-text" size={20} color="#22c55e" />
                <Text style={styles.settingText}>Terms of Service</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Account Actions */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Account Actions</Text>
              <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleLogout}>
                <Ionicons name="log-out" size={20} color="#ef4444" />
                <Text style={[styles.settingText, styles.dangerText]}>Logout</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleDeleteAccount}>
                <Ionicons name="trash" size={20} color="#ef4444" />
                <Text style={[styles.settingText, styles.dangerText]}>Delete Account</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* App Information */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>App Information</Text>
              <View style={styles.infoRow}>
                <Ionicons name="information-circle" size={20} color="#22c55e" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Version</Text>
                  <Text style={styles.infoValue}>2.0.0</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="build" size={20} color="#22c55e" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Build</Text>
                  <Text style={styles.infoValue}>2024.1.15</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#374151',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#22c55e',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  userRole: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  dangerItem: {
    borderBottomColor: '#fee2e2',
  },
  dangerText: {
    color: '#ef4444',
  },
});

export default Profile;