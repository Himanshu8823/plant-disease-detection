import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ShowInformation = () => {
    const router = useRouter();
    const { plantName, diseaseName, scientificName, diseaseInfo } = useLocalSearchParams();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Analysis Result</Text>
            <View style={styles.row}>
                <Text style={[styles.label, {color: "green"}]}>Plant Name: </Text>
                <Text style={styles.value}>{plantName}</Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.label, {color: "blue"}]}>Scientific Name: </Text>
                <Text style={styles.value}>{scientificName}</Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.label, {color: "red"}]}>Disease Name: </Text>
                <Text style={styles.value}>{diseaseName}</Text>
            </View>
            {diseaseInfo && (
                <View style={{}}>
                    <Text style={[styles.label, {color: "gold"}]}>Symptoms and Diagnosis:</Text>
                    
                    <Text style={[styles.value, {flexShrink: 1}]}>{diseaseInfo}</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default ShowInformation;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    value: {
        flexShrink: 1,
        fontSize: 16,
    },
});
