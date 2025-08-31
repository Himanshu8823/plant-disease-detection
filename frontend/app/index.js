import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recentDetections, setRecentDetections] = useState([]);

  useEffect(() => {
    checkAuthStatus();
    loadRecentDetections();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setUserName(user.displayName || user.email || 'User');
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const loadRecentDetections = async () => {
    try {
      const detections = await AsyncStorage.getItem('recentDetections');
      if (detections) {
        setRecentDetections(JSON.parse(detections).slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading recent detections:', error);
    }
  };

  const navigateToScreen = (screen) => {
    router.push(`/${screen}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const QuickActionCard = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.quickActionContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={32} color="#ffffff" />
        </View>
        <View style={styles.quickActionText}>
          <Text style={styles.quickActionTitle}>{title}</Text>
          <Text style={styles.quickActionDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Ionicons name={icon} size={24} color={color} />
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#4ade80" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>
            {isLoggedIn ? userName : 'Welcome to Plant Disease Detector'}
          </Text>
          <Text style={styles.subtitle}>
            Your AI-powered plant health companion
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <LottieView
            source={require('../assets/animations/plant-scan.json')}
            autoPlay
            loop
            style={styles.lottieIcon}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            title="Detect Disease"
            description="Scan plant photos for diseases"
            icon="camera"
            color="#4ade80"
            onPress={() => navigateToScreen('detection')}
          />
          <QuickActionCard
            title="Weather"
            description="Check local weather conditions"
            icon="partly-sunny"
            color="#3b82f6"
            onPress={() => navigateToScreen('weather')}
          />
          <QuickActionCard
            title="AI Chat"
            description="Get expert advice"
            icon="chatbubbles"
            color="#8b5cf6"
            onPress={() => navigateToScreen('chat')}
          />
          <QuickActionCard
            title="Analytics"
            description="View your detection history"
            icon="analytics"
            color="#f59e0b"
            onPress={() => navigateToScreen('analytics')}
          />
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Detections"
            value={recentDetections.length}
            icon="camera"
            color="#4ade80"
          />
          <StatCard
            title="Success Rate"
            value="95%"
            icon="checkmark-circle"
            color="#3b82f6"
          />
          <StatCard
            title="Plants Scanned"
            value="12"
            icon="leaf"
            color="#8b5cf6"
          />
        </View>
      </View>

      {/* Recent Detections */}
      {recentDetections.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Detections</Text>
            <TouchableOpacity onPress={() => navigateToScreen('analytics')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentDetections.map((detection, index) => (
              <View key={index} style={styles.recentCard}>
                <Image
                  source={{ uri: detection.imageUrl }}
                  style={styles.recentImage}
                />
                <View style={styles.recentContent}>
                  <Text style={styles.recentPlant}>{detection.plantName}</Text>
                  <Text style={styles.recentDisease}>{detection.diseaseName}</Text>
                  <Text style={styles.recentConfidence}>
                    {Math.round(detection.confidence * 100)}% confidence
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Tip</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#f59e0b" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Best Time to Scan Plants</Text>
            <Text style={styles.tipText}>
              Scan your plants in natural daylight for the most accurate disease detection results.
            </Text>
          </View>
        </View>
      </View>

      {/* Auth Section */}
      {!isLoggedIn && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Started</Text>
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={[styles.authButton, styles.loginButton]}
              onPress={() => navigateToScreen('login')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, styles.signupButton]}
              onPress={() => navigateToScreen('signup')}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#4ade80',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
  },
  headerIcon: {
    width: 80,
    height: 80,
  },
  lottieIcon: {
    width: '100%',
    height: '100%',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4ade80',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  recentCard: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recentImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recentContent: {
    padding: 12,
  },
  recentPlant: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  recentDisease: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  recentConfidence: {
    fontSize: 10,
    color: '#4ade80',
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  loginButton: {
    backgroundColor: '#4ade80',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ade80',
  },
});