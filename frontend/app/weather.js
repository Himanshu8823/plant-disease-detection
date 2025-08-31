import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      setLoading(true);
      
      // Get location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get weather data.');
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Fetch weather data
      await fetchWeatherData(currentLocation.coords.latitude, currentLocation.coords.longitude);
      await fetchForecastData(currentLocation.coords.latitude, currentLocation.coords.longitude);
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather/current?lat=${lat}&lon=${lon}&units=metric`);
      setWeatherData(response.data.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Use mock data for development
      setWeatherData({
        current: {
          temperature: 24.5,
          feelsLike: 26.2,
          humidity: 65,
          pressure: 1013,
          windSpeed: 12,
          windDirection: 180,
          description: 'Partly cloudy',
          icon: '02d',
          visibility: 10000,
          uvIndex: 'N/A',
        },
        location: {
          name: 'Current Location',
          country: 'Unknown',
          coordinates: { lat, lon }
        },
        agricultural: {
          growingConditions: 'Good',
          diseaseRisk: 'Medium',
          irrigationNeeded: 'Not needed',
          recommendations: ['Weather conditions are favorable for most crops']
        },
        timestamp: new Date().toISOString()
      });
    }
  };

  const fetchForecastData = async (lat, lon) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather/forecast?lat=${lat}&lon=${lon}&units=metric`);
      setForecastData(response.data.data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      // Use mock data for development
      setForecastData({
        location: {
          name: 'Current Location',
          country: 'Unknown',
          coordinates: { lat, lon }
        },
        forecast: [
          {
            datetime: '2024-01-15 12:00:00',
            temperature: 26,
            feelsLike: 28,
            humidity: 70,
            pressure: 1012,
            windSpeed: 15,
            windDirection: 185,
            description: 'Partly cloudy',
            icon: '02d',
            precipitation: 20,
            rain: 0,
            snow: 0,
          },
          {
            datetime: '2024-01-16 12:00:00',
            temperature: 28,
            feelsLike: 30,
            humidity: 75,
            pressure: 1010,
            windSpeed: 18,
            windDirection: 190,
            description: 'Cloudy',
            icon: '03d',
            precipitation: 60,
            rain: 5,
            snow: 0,
          }
        ],
        agricultural: {
          weeklyTrend: {
            averageTemperature: 25.5,
            temperatureRange: { min: 20, max: 30 },
            trend: 'Warming'
          },
          recommendations: ['Plan for increased irrigation needs', 'Monitor for fungal diseases']
        },
        timestamp: new Date().toISOString()
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getLocationAndWeather();
    setRefreshing(false);
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': 'sunny',
      '01n': 'moon',
      '02d': 'partly-sunny',
      '02n': 'partly-sunny',
      '03d': 'cloudy',
      '03n': 'cloudy',
      '04d': 'cloudy',
      '04n': 'cloudy',
      '09d': 'rainy',
      '09n': 'rainy',
      '10d': 'rainy',
      '10n': 'rainy',
      '11d': 'thunderstorm',
      '11n': 'thunderstorm',
      '13d': 'snow',
      '13n': 'snow',
      '50d': 'water',
      '50n': 'water',
    };
    return iconMap[iconCode] || 'partly-sunny';
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {weatherData && (
        <View style={styles.content}>
          {/* Current Weather Card */}
          <View style={styles.weatherCard}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={20} color="#22c55e" />
              <Text style={styles.locationText}>
                {weatherData.location.name}, {weatherData.location.country}
              </Text>
            </View>
            
            <View style={styles.currentWeather}>
              <View style={styles.temperatureSection}>
                <Ionicons 
                  name={getWeatherIcon(weatherData.current.icon)} 
                  size={80} 
                  color="#22c55e" 
                />
                <View style={styles.temperatureInfo}>
                  <Text style={styles.temperature}>
                    {Math.round(weatherData.current.temperature)}°C
                  </Text>
                  <Text style={styles.feelsLike}>
                    Feels like {Math.round(weatherData.current.feelsLike)}°C
                  </Text>
                  <Text style={styles.description}>
                    {weatherData.current.description}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.weatherDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="water" size={20} color="#22c55e" />
                <Text style={styles.detailText}>Humidity: {weatherData.current.humidity}%</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="speedometer" size={20} color="#22c55e" />
                <Text style={styles.detailText}>Pressure: {weatherData.current.pressure} hPa</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="airplane" size={20} color="#22c55e" />
                <Text style={styles.detailText}>Wind: {weatherData.current.windSpeed} km/h</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="eye" size={20} color="#22c55e" />
                <Text style={styles.detailText}>Visibility: {weatherData.current.visibility / 1000} km</Text>
              </View>
            </View>
          </View>

          {/* Agricultural Insights Card */}
          <View style={styles.agriculturalCard}>
            <Text style={styles.cardTitle}>Agricultural Insights</Text>
            
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Growing Conditions:</Text>
              <Text style={[styles.insightValue, { color: getRiskColor(weatherData.agricultural.growingConditions) }]}>
                {weatherData.agricultural.growingConditions}
              </Text>
            </View>
            
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Disease Risk:</Text>
              <Text style={[styles.insightValue, { color: getRiskColor(weatherData.agricultural.diseaseRisk) }]}>
                {weatherData.agricultural.diseaseRisk}
              </Text>
            </View>
            
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Irrigation:</Text>
              <Text style={styles.insightValue}>
                {weatherData.agricultural.irrigationNeeded}
              </Text>
            </View>

            <View style={styles.recommendations}>
              <Text style={styles.recommendationsTitle}>Recommendations:</Text>
              {weatherData.agricultural.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Forecast Card */}
          {forecastData && (
            <View style={styles.forecastCard}>
              <Text style={styles.cardTitle}>5-Day Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {forecastData.forecast.slice(0, 5).map((day, index) => (
                  <View key={index} style={styles.forecastItem}>
                    <Text style={styles.forecastDate}>
                      {new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                    <Ionicons 
                      name={getWeatherIcon(day.icon)} 
                      size={30} 
                      color="#22c55e" 
                    />
                    <Text style={styles.forecastTemp}>
                      {Math.round(day.temperature)}°C
                    </Text>
                    <Text style={styles.forecastHumidity}>
                      {day.humidity}%
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Weekly Trend Card */}
          {forecastData?.agricultural && (
            <View style={styles.trendCard}>
              <Text style={styles.cardTitle}>Weekly Trend</Text>
              <View style={styles.trendInfo}>
                <Text style={styles.trendText}>
                  Average Temperature: {Math.round(forecastData.agricultural.weeklyTrend.averageTemperature)}°C
                </Text>
                <Text style={styles.trendText}>
                  Range: {Math.round(forecastData.agricultural.weeklyTrend.temperatureRange.min)}°C - {Math.round(forecastData.agricultural.weeklyTrend.temperatureRange.max)}°C
                </Text>
                <Text style={styles.trendText}>
                  Trend: {forecastData.agricultural.weeklyTrend.trend}
                </Text>
              </View>
              
              <View style={styles.weeklyRecommendations}>
                <Text style={styles.recommendationsTitle}>Weekly Recommendations:</Text>
                {forecastData.agricultural.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="leaf" size={16} color="#22c55e" />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
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
  content: {
    padding: 16,
  },
  weatherCard: {
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
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  currentWeather: {
    marginBottom: 20,
  },
  temperatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  temperatureInfo: {
    flex: 1,
    marginLeft: 16,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  feelsLike: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  description: {
    fontSize: 18,
    color: '#374151',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  agriculturalCard: {
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
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  recommendations: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
  forecastCard: {
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
  forecastItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 80,
  },
  forecastDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
    marginTop: 4,
  },
  forecastHumidity: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  trendCard: {
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
  trendInfo: {
    marginBottom: 16,
  },
  trendText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  weeklyRecommendations: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});

export default Weather;