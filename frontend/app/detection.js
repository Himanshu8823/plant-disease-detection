import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Detection = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [confidence, setConfidence] = useState('');
  const [diseaseInfo, setDiseaseInfo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [userData, setUserData] = useState(null);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    loadUserData();
    getLocation();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadUserData = async () => {
    try {
      const userString = await AsyncStorage.getItem('userData');
      if (userString) {
        setUserData(JSON.parse(userString));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access camera roll is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!pickerResult.canceled && pickerResult.assets) {
        setImage(pickerResult.assets[0].uri);
        resetResults();
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access camera is required!");
        return;
      }

      const cameraResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!cameraResult.canceled && cameraResult.assets) {
        setImage(cameraResult.assets[0].uri);
        resetResults();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const resetResults = () => {
    setPlantName('');
    setDiseaseName('');
    setConfidence('');
    setDiseaseInfo('');
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image before analyzing.');
      return;
    }

    setLoading(true);
    setModalVisible(true);

    try {
      const base64Image = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Call our backend API
      const response = await axios.post(
        'http://localhost:5000/api/detection/analyze',
        {
          image: base64Image,
          latitude: location?.coords?.latitude || 49.207,
          longitude: location?.coords?.longitude || 16.608,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      if (response.data.success) {
        const result = response.data.data;
        setPlantName(result.plant.name);
        setDiseaseName(result.disease.name);
        setConfidence(result.disease.confidence.toFixed(1));
        
        // Format disease info
        const formattedInfo = `
Symptoms:
${result.disease.symptoms.map(s => `• ${s}`).join('\n')}

Diagnosis:
${result.disease.diagnosis.map(d => `• ${d}`).join('\n')}

Treatment:
${result.disease.treatment.map(t => `• ${t}`).join('\n')}

Prevention:
${result.disease.prevention.map(p => `• ${p}`).join('\n')}
        `;
        setDiseaseInfo(formattedInfo);

        // Save to history if user is logged in
        if (userData) {
          await saveToHistory(result);
        }
      } else {
        throw new Error(response.data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Detection error:', error);
      if (error.response?.status === 401) {
        Alert.alert('Error', 'Invalid API key. Please contact support.');
      } else if (error.code === 'ECONNABORTED') {
        Alert.alert('Error', 'Request timeout. Please try again.');
      } else {
        Alert.alert('Error', 'Error analyzing image. Please try again.');
      }
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const saveToHistory = async (result) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      await axios.post(
        'http://localhost:5000/api/history/add',
        {
          plantName: result.plant.name,
          diseaseName: result.disease.name,
          confidence: result.disease.confidence,
          imageUrl: image,
          location: {
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
          },
          symptoms: result.disease.symptoms,
          treatment: result.disease.treatment,
          prevention: result.disease.prevention,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const getConfidenceColor = (confidence) => {
    const conf = parseFloat(confidence);
    if (conf >= 80) return '#10b981';
    if (conf >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
          }
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Plant Disease Detection</Text>
            <Text style={styles.headerSubtitle}>
              Take a photo or select an image to analyze plant diseases
            </Text>
          </View>

          {/* Image Section */}
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <View style={styles.imageActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="refresh" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Retake</Text>
                </TouchableOpacity>
                {!loading && !plantName && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.analyzeButton]}
                    onPress={analyzeImage}
                  >
                    <Ionicons name="analytics" size={20} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Analyze</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.uploadSection}>
              <LottieView
                source={require('../assets/animations/plant-scan.json')}
                autoPlay
                loop
                style={styles.uploadAnimation}
              />
              <Text style={styles.uploadTitle}>Ready to Scan</Text>
              <Text style={styles.uploadSubtitle}>
                Take a clear photo of the plant or leaf you want to analyze
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cameraButton]}
                  onPress={openCamera}
                >
                  <Ionicons name="camera" size={24} color="#ffffff" />
                  <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.galleryButton]}
                  onPress={pickImage}
                >
                  <Ionicons name="images" size={24} color="#ffffff" />
                  <Text style={styles.buttonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Results Section */}
          {plantName && !loading && (
            <View style={styles.resultsContainer}>
              <LottieView
                source={require('../assets/animations/success.json')}
                autoPlay
                loop={false}
                style={styles.successAnimation}
              />
              
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Ionicons name="leaf" size={24} color="#22c55e" />
                  <Text style={styles.resultTitle}>Analysis Complete</Text>
                </View>

                <View style={styles.resultGrid}>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Plant</Text>
                    <Text style={styles.resultValue}>{plantName}</Text>
                  </View>
                  
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Disease</Text>
                    <Text style={styles.resultValue}>{diseaseName}</Text>
                  </View>
                  
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Confidence</Text>
                    <Text style={[
                      styles.resultValue, 
                      { color: getConfidenceColor(confidence) }
                    ]}>
                      {confidence}%
                    </Text>
                  </View>
                </View>

                <View style={styles.diseaseInfo}>
                  <Text style={styles.diseaseInfoTitle}>Detailed Information</Text>
                  <Text style={styles.diseaseInfoText}>{diseaseInfo}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => setImage(null)}
                  >
                    <Ionicons name="camera" size={20} color="#22c55e" />
                    <Text style={styles.secondaryButtonText}>Scan Another</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => {
                      // Navigate to chat for follow-up questions
                    }}
                  >
                    <Ionicons name="chatbubble" size={20} color="#ffffff" />
                    <Text style={styles.buttonText}>Ask Expert</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Loading Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LottieView
                source={require('../assets/animations/scanning.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
              <Text style={styles.loadingTitle}>Analyzing Image</Text>
              <Text style={styles.loadingSubtitle}>
                Our AI is examining your plant for diseases...
              </Text>
              <ActivityIndicator size="large" color="#22c55e" style={styles.spinner} />
            </View>
          </View>
        </Modal>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  uploadSection: {
    alignItems: 'center',
    padding: 40,
  },
  uploadAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#22c55e',
  },
  galleryButton: {
    backgroundColor: '#3b82f6',
  },
  primaryButton: {
    backgroundColor: '#22c55e',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#6b7280',
    gap: 8,
    flex: 1,
  },
  analyzeButton: {
    backgroundColor: '#22c55e',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    padding: 20,
  },
  successAnimation: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  resultGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resultItem: {
    flex: 1,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  diseaseInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
    marginBottom: 20,
  },
  diseaseInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  diseaseInfoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingAnimation: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  spinner: {
    marginTop: 10,
  },
});

export default Detection;