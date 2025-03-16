import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text, SafeAreaView, BackHandler, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyButton from "@/components/MyButton"; 
import LottieView from "lottie-react-native";

const Home = () => {
    const navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const getUserData = async () => {
        const isLoggedInString = await AsyncStorage.getItem('isLoggedIn');
        return isLoggedInString ? JSON.parse(isLoggedInString) : false;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const loggedInStatus = await getUserData();
            setIsLoggedIn(loggedInStatus);
        };
        fetchUserData();
    }, []);
    const openDetectionPage = () => {
        navigation.navigate('detection' as never); 
    };
    const openDetection = () =>{
         
    }

    const handleBack = useCallback(() => {
        Alert.alert(
            "Are you sure you want to exit?",
            "Press 'Yes' to exit, 'No' to continue.",
            [
                { text: "No", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                { text: "Yes", onPress: () => BackHandler.exitApp() }
            ]
        );
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            handleBack();
            return true;
        });
        return () => {
            backHandler.remove();
        };
    }, [handleBack]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.home}>
                <Text>Welcome To Plant Disease Detection App</Text>
            </View>
            <View style={styles.openPage}>
    
            </View>
            <LottieView
                source={require('../assets/animations/confetti.json')}
                autoPlay={true}
                loop={false}
                style={styles.lottie}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    home: {
        fontSize: 20,
        marginTop: '50%',
    },
    openPage: {
        marginTop: '10%',
    },
    lottie: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
});

export default Home;
