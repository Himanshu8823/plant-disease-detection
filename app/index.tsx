import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View, ActivityIndicator } from "react-native";

async function getUserData() {
  const isLoggedInString = await AsyncStorage.getItem('isLoggedIn');
  const isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;
  return isLoggedIn;
}

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await getUserData();
      setLoading(false); 
      if (isLoggedIn) {
        console.log("Logged in");
        router.navigate('/home');
      } else {
        console.log("Not logged in");
        router.navigate('/login');
      }
    };
    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: "100%", height: "50%" }}>
      <Image source={require('../assets/images/firstpage.png')} style={{ width: "90%", height: "30%", margin: "2%" }} />
    </View>
  );
}

export default Index;
