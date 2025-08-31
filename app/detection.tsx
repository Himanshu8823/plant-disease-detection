import React, { useState } from 'react';
import { View, Image, Text, Alert, SafeAreaView, StyleSheet, ScrollView, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import MyButton from '@/components/MyButton';
import * as FileSystem from 'expo-file-system';
import LottieView from 'lottie-react-native';

const Detection = () => {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [plantName, setPlantName] = useState('');
    const [diseaseName, setDiseaseName] = useState('');
    const [scientificName, setScientificName] = useState('');
    const [diseaseInfo, setDiseaseInfo] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!pickerResult.canceled && pickerResult.assets) {
            setImage(pickerResult.assets[0].uri);
        }
    };

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera is required!");
            return;
        }

        const cameraResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!cameraResult.canceled && cameraResult.assets) {
            setImage(cameraResult.assets[0].uri);
        }
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

            // Call our backend API instead of directly calling Kindwise
            const response = await axios.post(
                'http://localhost:5000/api/detection/analyze',
                {
                    image: base64Image,
                    latitude: 49.207,
                    longitude: 16.608,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 60000, // 60 second timeout
                }
            );

            if (response.data.success) {
                const result = response.data.data;
                setPlantName(result.plant.name);
                setDiseaseName(result.disease.name);
                setScientificName(result.disease.confidence.toFixed(1));
                
                // Format disease info from the structured response
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

    return (
        <ScrollView contentContainerStyle={{}}>
            {plantName && !loading && (
            <LottieView
                                source={require('../assets/animations/confetti.json')}
                            autoPlay={true}
                            loop={true}
                            
                            style={styles.lottie}
                        />
            )}
            <SafeAreaView>
                {/* If an image is  selected, hide the select and capture image buttons */}
                {image && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                        {!loading && !plantName && ( // Only show Analyze button when not loading or result not displayed
                            <MyButton title="Analyze Image" onPress={analyzeImage} style={styles.analyzeButton} />
                        )}
                          
                    </View>
                )}

                {/* If no image selected, show buttons */}
                {!image && (
                    <View style={styles.container}>
                        <MyButton title="Select Image" onPress={pickImage} style={{ marginBottom: 10 }} />
                        <MyButton title="Take Photo" onPress={openCamera} style={undefined} />
                    </View>
                )}

                {/* Modal for analyzing the image */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="#0000ff" />
                          
                            <Text style={styles.loadingText}>Analyzing the Image...</Text>
                        </View>
                    </View>
                </Modal>

                {/* Display analysis results if available */}
                {plantName && !loading && (
                    
                    <ScrollView style={{ marginTop: '2%' }}>
                        
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableHeader}>Plant Name :</Text>
                                <Text style={styles.tableCell}>{plantName}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableHeader}>Disease Name :</Text>
                                <Text style={styles.tableCell}>{diseaseName}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableHeader}>Disease Probability :</Text>
                                <Text style={styles.tableCell}>{scientificName} %</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableHeader}>Symptoms & Diagnosis :</Text>
                                <Text style={styles.tableCell}>{diseaseInfo}</Text>
                            </View>
                        </View>
                        
                    </ScrollView>
                )}

            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "80%",
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%',
    },
    image: {
        width: "80%",
        height: 200,
        marginBottom: 20,
        borderRadius:20 
    },
    analyzeButton: {
        alignSelf: 'center',
        marginTop: 20,
    },
    table: {
        marginTop: 20,
        borderWidth: 5,
        borderColor: 'green',
        width: '100%',
        borderRadius: 5,
        
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
    },
    tableHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        textAlign: 'left',
        color: 'green',
    },
    tableCell: {
        fontSize: 14,
        flex: 2,
        textAlign: 'left',
        color: 'black',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    lottie: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        alignSelf:'center',
    },
});

export default Detection;
