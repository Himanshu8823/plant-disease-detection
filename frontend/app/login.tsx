import MyButton from "@/components/MyButton";
import { auth } from "@/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, Image, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const router = useRouter();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedInStatus = await AsyncStorage.getItem("isLoggedIn");
      const isLoggedIn = loggedInStatus !== null ? JSON.parse(loggedInStatus) : false;
      
      if (isLoggedIn) {
        router.navigate("/home");
      }
    };
    
    checkLoginStatus();
  }, []); // Add an empty dependency array

  const onLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      alert("Login Successful");
      
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
      
      router.navigate('/home');
    } catch (error: any) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const onSignup = () => {
    router.navigate('/signup');
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <Image source={require('../assets/images/applogo.png')} style={styles.imagelogo} />
          <View style={{ flex: 1, alignItems: 'center' }}>   
            <Text style={{fontSize: 25, fontWeight: 'bold', marginTop: "1%",marginBottom: "5%",alignSelf: 'center', color: 'green'}}>Login</Text>
            <TextInput placeholder="Email" inputMode="email" style={styles.input} onChangeText={(text) => setEmail(text)} autoCapitalize="none"/>
            <TextInput placeholder="Password" secureTextEntry={true} style={styles.input} onChangeText={(text) => setPassword(text)} autoCapitalize="none"/>
            <View style={styles.loginButton}>
              {loading ? <ActivityIndicator size="large" color="green"  />
               :<MyButton title={"Login"} onPress={onLogin} style={{}}/>}
            </View>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
            <Text style={styles.signup} onPress={onSignup}>Don't have an account? Sign up</Text>
          </View>
          {!isKeyboardVisible && (
            <View style={styles.footer}>
              <Image source={require('../assets/images/transparant.png')} style={styles.footerImage} />
            </View>
          )}
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  imagelogo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: "20%",
    marginLeft: "10%",
  },
  input: {
    width: '80%',
    height: 60,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    height: 60,
    marginTop: "10%",
    alignItems: 'center',
  },
  forgotPassword: {
    marginTop: "10%",
    color: 'gray',
    fontSize: 16,
  },
  footer: {
    width: "100%",
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
  footerImage: {
    width: '100%',
    height: '100%',
  },
  signup: {
    marginTop: "5%",
    color: 'blue',
    fontSize: 17,
  }
});
