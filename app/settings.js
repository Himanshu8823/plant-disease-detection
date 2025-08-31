import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    language: 'en',
    units: 'metric',
    notifications: true,
    darkMode: false,
    autoLocation: true,
    dataUsage: 'standard',
    privacyMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];

  const dataUsageOptions = [
    { value: 'minimal', label: 'Minimal', description: 'Basic features only' },
    { value: 'standard', label: 'Standard', description: 'Recommended for most users' },
    { value: 'high', label: 'High', description: 'Enhanced features and analytics' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      setSaving(true);
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Update settings on server if user is logged in
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          await axios.put('http://localhost:5000/api/user/preferences', {
            language: newSettings.language,
            units: newSettings.units,
            notifications: newSettings.notifications,
          });
        }
      } catch (error) {
        console.error('Error updating server preferences:', error);
      }
      
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleLanguageSelect = (languageCode) => {
    Alert.alert(
      'Change Language',
      `Are you sure you want to change the language to ${languages.find(l => l.code === languageCode)?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: () => handleSettingChange('language', languageCode),
        },
      ]
    );
  };

  const handleDataUsageChange = (value) => {
    Alert.alert(
      'Data Usage',
      'Changing data usage settings may affect app performance and features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: () => handleSettingChange('dataUsage', value),
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultSettings = {
              language: 'en',
              units: 'metric',
              notifications: true,
              darkMode: false,
              autoLocation: true,
              dataUsage: 'standard',
              privacyMode: false,
            };
            setSettings(defaultSettings);
            saveSettings(defaultSettings);
          },
        },
      ]
    );
  };

  const getLanguageName = (code) => {
    return languages.find(l => l.code === code)?.name || 'English';
  };

  const getLanguageFlag = (code) => {
    return languages.find(l => l.code === code)?.flag || '🇺🇸';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.savingText}>Saving...</Text>
        </View>
      )}

      {/* Language Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language & Region</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              // Show language selection modal or navigate to language screen
              Alert.alert(
                'Select Language',
                'Choose your preferred language:',
                languages.map(lang => ({
                  text: `${lang.flag} ${lang.name}`,
                  onPress: () => handleLanguageSelect(lang.code),
                })).concat([
                  { text: 'Cancel', style: 'cancel' }
                ])
              );
            }}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="language" size={20} color="#22c55e" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingValue}>
                  {getLanguageFlag(settings.language)} {getLanguageName(settings.language)}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="speedometer" size={20} color="#22c55e" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Units</Text>
                <Text style={styles.settingValue}>
                  {settings.units === 'metric' ? 'Metric (°C, km/h)' : 'Imperial (°F, mph)'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.units === 'metric'}
              onValueChange={(value) => handleSettingChange('units', value ? 'metric' : 'imperial')}
              trackColor={{ false: '#d1d5db', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color="#22c55e" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive alerts for disease detection results
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => handleSettingChange('notifications', value)}
              trackColor={{ false: '#d1d5db', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>

      {/* Location Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location & Privacy</Text>
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="location" size={20} color="#22c55e" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Auto Location</Text>
                <Text style={styles.settingDescription}>
                  Automatically use your location for weather data
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoLocation}
              onValueChange={(value) => handleSettingChange('autoLocation', value)}
              trackColor={{ false: '#d1d5db', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark" size={20} color="#22c55e" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Privacy Mode</Text>
                <Text style={styles.settingDescription}>
                  Limit data collection and sharing
                </Text>
              </View>
            </View>
            <Switch
              value={settings.privacyMode}
              onValueChange={(value) => handleSettingChange('privacyMode', value)}
              trackColor={{ false: '#d1d5db', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>

      {/* Data Usage Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Usage</Text>
        <View style={styles.card}>
          <Text style={styles.settingDescription}>
            Choose how much data the app can use for enhanced features
          </Text>
          {dataUsageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dataUsageOption,
                settings.dataUsage === option.value && styles.selectedOption
              ]}
              onPress={() => handleDataUsageChange(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionLabel,
                  settings.dataUsage === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  settings.dataUsage === option.value && styles.selectedOptionText
                ]}>
                  {option.description}
                </Text>
              </View>
              {settings.dataUsage === option.value && (
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={20} color="#22c55e" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Use dark theme for better visibility
                </Text>
              </View>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => handleSettingChange('darkMode', value)}
              trackColor={{ false: '#d1d5db', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="download" size={20} color="#22c55e" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Export Data</Text>
                <Text style={styles.settingDescription}>
                  Download your detection history and settings
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash" size={20} color="#ef4444" />
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: '#ef4444' }]}>Clear Cache</Text>
                <Text style={styles.settingDescription}>
                  Remove temporary files and data
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reset Settings */}
      <View style={styles.section}>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleResetSettings}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="refresh" size={20} color="#ef4444" />
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: '#ef4444' }]}>Reset All Settings</Text>
                <Text style={styles.settingDescription}>
                  Restore default settings
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* App Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>2.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.1.15</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated</Text>
            <Text style={styles.infoValue}>January 15, 2024</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  savingText: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingContent: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  settingValue: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  dataUsageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedOption: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  selectedOptionText: {
    color: '#22c55e',
  },
  dangerItem: {
    borderBottomColor: '#fee2e2',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#374151',
  },
  infoValue: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default Settings;