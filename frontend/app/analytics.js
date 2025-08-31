import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [personalData, setPersonalData] = useState(null);
  const [diseaseInsights, setDiseaseInsights] = useState(null);
  const [weatherImpact, setWeatherImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data
      await Promise.all([
        fetchUsageAnalytics(),
        fetchPersonalAnalytics(),
        fetchDiseaseInsights(),
        fetchWeatherImpact(),
      ]);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      Alert.alert('Error', 'Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/usage');
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Error fetching usage analytics:', error);
      // Use mock data for development
      setAnalyticsData({
        totalUsers: 1250,
        activeUsers: 890,
        totalDetections: 5670,
        successfulDetections: 4890,
        averageAccuracy: 86.2,
        topDiseases: [
          { name: 'Early Blight', count: 450, percentage: 15.2 },
          { name: 'Late Blight', count: 380, percentage: 12.8 },
          { name: 'Powdery Mildew', count: 320, percentage: 10.8 },
        ],
        topPlants: [
          { name: 'Tomato', count: 1200, percentage: 20.3 },
          { name: 'Potato', count: 980, percentage: 16.6 },
          { name: 'Corn', count: 750, percentage: 12.7 },
        ],
      });
    }
  };

  const fetchPersonalAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/personal');
      setPersonalData(response.data.data);
    } catch (error) {
      console.error('Error fetching personal analytics:', error);
      // Use mock data for development
      setPersonalData({
        totalDetections: 25,
        successfulDetections: 22,
        successRate: 88.0,
        averageConfidence: 82.5,
        mostDetectedDiseases: [
          { name: 'Early Blight', count: 12, confidence: 85.2 },
          { name: 'Powdery Mildew', count: 8, confidence: 78.9 },
        ],
        mostDetectedPlants: [
          { name: 'Tomato', count: 15, successRate: 86.7 },
          { name: 'Potato', count: 8, successRate: 75.0 },
        ],
        weeklyTrend: [
          { week: 'Week 1', detections: 5, successRate: 80 },
          { week: 'Week 2', detections: 8, successRate: 87.5 },
          { week: 'Week 3', detections: 12, successRate: 83.3 },
        ],
      });
    }
  };

  const fetchDiseaseInsights = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/diseases');
      setDiseaseInsights(response.data.data);
    } catch (error) {
      console.error('Error fetching disease insights:', error);
      // Use mock data for development
      setDiseaseInsights({
        commonDiseases: [
          {
            name: 'Early Blight',
            scientificName: 'Alternaria solani',
            description: 'A fungal disease that affects tomatoes and potatoes',
            symptoms: ['Dark brown spots on leaves', 'Yellowing of leaves', 'Stunted growth'],
            treatment: ['Remove infected leaves', 'Apply fungicide', 'Improve air circulation'],
            prevention: ['Crop rotation', 'Proper spacing', 'Avoid overhead watering'],
            riskLevel: 'High',
            affectedPlants: ['Tomato', 'Potato', 'Pepper']
          },
          {
            name: 'Late Blight',
            scientificName: 'Phytophthora infestans',
            description: 'A devastating disease that can destroy entire crops',
            symptoms: ['Water-soaked lesions', 'White fungal growth', 'Rapid plant death'],
            treatment: ['Immediate fungicide application', 'Remove infected plants', 'Quarantine area'],
            prevention: ['Plant resistant varieties', 'Avoid overhead irrigation', 'Monitor weather conditions'],
            riskLevel: 'Critical',
            affectedPlants: ['Tomato', 'Potato']
          },
        ],
        seasonalTrends: {
          spring: ['Early Blight', 'Powdery Mildew'],
          summer: ['Late Blight', 'Leaf Spot', 'Root Rot'],
          fall: ['Early Blight', 'Powdery Mildew'],
          winter: ['Root Rot', 'Damping Off']
        },
      });
    }
  };

  const fetchWeatherImpact = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/weather-impact?lat=40.7128&lon=-74.0060');
      setWeatherImpact(response.data.data);
    } catch (error) {
      console.error('Error fetching weather impact:', error);
      // Use mock data for development
      setWeatherImpact({
        currentConditions: {
          temperature: 24.5,
          humidity: 65,
          precipitation: 0,
          windSpeed: 12,
          diseaseRisk: 'Medium',
          recommendations: [
            'Monitor for fungal diseases due to moderate humidity',
            'Consider preventive fungicide application',
            'Ensure proper plant spacing for air circulation'
          ]
        },
        forecast: {
          next3Days: [
            { date: '2024-01-15', temp: 26, humidity: 70, risk: 'High' },
            { date: '2024-01-16', temp: 28, humidity: 75, risk: 'High' },
            { date: '2024-01-17', temp: 22, humidity: 60, risk: 'Medium' }
          ],
          weeklyTrend: 'Increasing disease risk due to rising temperatures and humidity'
        },
      });
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high':
      case 'critical':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Global Statistics */}
      {analyticsData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Global Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analyticsData.totalUsers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analyticsData.activeUsers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analyticsData.totalDetections.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Detections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analyticsData.averageAccuracy}%</Text>
              <Text style={styles.statLabel}>Avg. Accuracy</Text>
            </View>
          </View>
        </View>
      )}

      {/* Personal Statistics */}
      {personalData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{personalData.totalDetections}</Text>
              <Text style={styles.statLabel}>Total Detections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{personalData.successRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{personalData.averageConfidence}%</Text>
              <Text style={styles.statLabel}>Avg. Confidence</Text>
            </View>
          </View>
        </View>
      )}

      {/* Top Diseases */}
      {analyticsData?.topDiseases && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Most Detected Diseases</Text>
          {analyticsData.topDiseases.map((disease, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{disease.name}</Text>
                <Text style={styles.listItemSubtitle}>{disease.count} detections</Text>
              </View>
              <Text style={styles.percentage}>{disease.percentage}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* Top Plants */}
      {analyticsData?.topPlants && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Most Detected Plants</Text>
          {analyticsData.topPlants.map((plant, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{plant.name}</Text>
                <Text style={styles.listItemSubtitle}>{plant.count} detections</Text>
              </View>
              <Text style={styles.percentage}>{plant.percentage}%</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderPersonalTab = () => (
    <View style={styles.tabContent}>
      {/* Personal Trends */}
      {personalData?.weeklyTrend && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Trend</Text>
          {personalData.weeklyTrend.map((week, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{week.week}</Text>
                <Text style={styles.listItemSubtitle}>{week.detections} detections</Text>
              </View>
              <Text style={styles.percentage}>{week.successRate}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* Your Most Detected Diseases */}
      {personalData?.mostDetectedDiseases && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Most Detected Diseases</Text>
          {personalData.mostDetectedDiseases.map((disease, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{disease.name}</Text>
                <Text style={styles.listItemSubtitle}>{disease.count} times</Text>
              </View>
              <Text style={styles.percentage}>{disease.confidence}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* Your Most Detected Plants */}
      {personalData?.mostDetectedPlants && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Most Detected Plants</Text>
          {personalData.mostDetectedPlants.map((plant, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{plant.name}</Text>
                <Text style={styles.listItemSubtitle}>{plant.count} times</Text>
              </View>
              <Text style={styles.percentage}>{plant.successRate}%</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderDiseasesTab = () => (
    <View style={styles.tabContent}>
      {/* Common Diseases */}
      {diseaseInsights?.commonDiseases && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Common Diseases</Text>
          {diseaseInsights.commonDiseases.map((disease, index) => (
            <View key={index} style={styles.diseaseCard}>
              <View style={styles.diseaseHeader}>
                <Text style={styles.diseaseName}>{disease.name}</Text>
                <Text style={[styles.riskLevel, { color: getRiskColor(disease.riskLevel) }]}>
                  {disease.riskLevel}
                </Text>
              </View>
              <Text style={styles.scientificName}>{disease.scientificName}</Text>
              <Text style={styles.diseaseDescription}>{disease.description}</Text>
              
              <View style={styles.diseaseSection}>
                <Text style={styles.sectionTitle}>Symptoms:</Text>
                {disease.symptoms.map((symptom, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <Ionicons name="ellipse" size={6} color="#22c55e" />
                    <Text style={styles.bulletText}>{symptom}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.diseaseSection}>
                <Text style={styles.sectionTitle}>Treatment:</Text>
                {disease.treatment.map((treatment, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <Ionicons name="checkmark-circle" size={12} color="#22c55e" />
                    <Text style={styles.bulletText}>{treatment}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.diseaseSection}>
                <Text style={styles.sectionTitle}>Prevention:</Text>
                {disease.prevention.map((prevention, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <Ionicons name="shield-checkmark" size={12} color="#22c55e" />
                    <Text style={styles.bulletText}>{prevention}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Seasonal Trends */}
      {diseaseInsights?.seasonalTrends && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Seasonal Disease Trends</Text>
          {Object.entries(diseaseInsights.seasonalTrends).map(([season, diseases]) => (
            <View key={season} style={styles.seasonCard}>
              <Text style={styles.seasonTitle}>{season.charAt(0).toUpperCase() + season.slice(1)}</Text>
              <View style={styles.diseaseTags}>
                {diseases.map((disease, index) => (
                  <View key={index} style={styles.diseaseTag}>
                    <Text style={styles.diseaseTagText}>{disease}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderWeatherTab = () => (
    <View style={styles.tabContent}>
      {/* Current Weather Impact */}
      {weatherImpact?.currentConditions && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Weather Impact</Text>
          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>Temperature</Text>
              <Text style={styles.weatherStatValue}>{weatherImpact.currentConditions.temperature}°C</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>Humidity</Text>
              <Text style={styles.weatherStatValue}>{weatherImpact.currentConditions.humidity}%</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>Disease Risk</Text>
              <Text style={[styles.weatherStatValue, { color: getRiskColor(weatherImpact.currentConditions.diseaseRisk) }]}>
                {weatherImpact.currentConditions.diseaseRisk}
              </Text>
            </View>
          </View>
          
          <View style={styles.recommendations}>
            <Text style={styles.recommendationsTitle}>Recommendations:</Text>
            {weatherImpact.currentConditions.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Ionicons name="leaf" size={16} color="#22c55e" />
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Forecast Impact */}
      {weatherImpact?.forecast && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3-Day Forecast Impact</Text>
          {weatherImpact.forecast.next3Days.map((day, index) => (
            <View key={index} style={styles.forecastItem}>
              <View style={styles.forecastHeader}>
                <Text style={styles.forecastDate}>{day.date}</Text>
                <Text style={[styles.forecastRisk, { color: getRiskColor(day.risk) }]}>
                  {day.risk} Risk
                </Text>
              </View>
              <View style={styles.forecastDetails}>
                <Text style={styles.forecastDetail}>Temp: {day.temp}°C</Text>
                <Text style={styles.forecastDetail}>Humidity: {day.humidity}%</Text>
              </View>
            </View>
          ))}
          <Text style={styles.weeklyTrend}>{weatherImpact.forecast.weeklyTrend}</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons 
            name="analytics" 
            size={20} 
            color={activeTab === 'overview' ? '#ffffff' : '#22c55e'} 
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
          onPress={() => setActiveTab('personal')}
        >
          <Ionicons 
            name="person" 
            size={20} 
            color={activeTab === 'personal' ? '#ffffff' : '#22c55e'} 
          />
          <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
            Personal
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'diseases' && styles.activeTab]}
          onPress={() => setActiveTab('diseases')}
        >
          <Ionicons 
            name="medical" 
            size={20} 
            color={activeTab === 'diseases' ? '#ffffff' : '#22c55e'} 
          />
          <Text style={[styles.tabText, activeTab === 'diseases' && styles.activeTabText]}>
            Diseases
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weather' && styles.activeTab]}
          onPress={() => setActiveTab('weather')}
        >
          <Ionicons 
            name="partly-sunny" 
            size={20} 
            color={activeTab === 'weather' ? '#ffffff' : '#22c55e'} 
          />
          <Text style={[styles.tabText, activeTab === 'weather' && styles.activeTabText]}>
            Weather
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'personal' && renderPersonalTab()}
        {activeTab === 'diseases' && renderDiseasesTab()}
        {activeTab === 'weather' && renderWeatherTab()}
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
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  diseaseCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  riskLevel: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6b7280',
    marginBottom: 8,
  },
  diseaseDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  diseaseSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  seasonCard: {
    marginBottom: 16,
  },
  seasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  diseaseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  diseaseTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  diseaseTagText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '500',
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weatherStat: {
    alignItems: 'center',
    flex: 1,
  },
  weatherStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  weatherStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  recommendations: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  forecastItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forecastDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  forecastRisk: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#fef3c7',
  },
  forecastDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDetail: {
    fontSize: 12,
    color: '#6b7280',
  },
  weeklyTrend: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default Analytics;