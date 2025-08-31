// Signup.tsx

import MyButton from "@/components/MyButton";
import { auth } from "@/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, Image, TextInput, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator } from "react-native";


// Initialize Firebase app

const Signup = () => {
  const router = useRouter();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const onLogin = () => {
    router.navigate('/login');
  }

  const onSignup = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        alert('Signup successful');

        router.navigate('/login');
      }
    } catch (error: any) {

      if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use. Please use a different email.');
      }
      else if (error.code === 'auth/invalid-email') {
        alert('Invalid email. Please enter a valid email address.');
      }
      else if (error.code === 'auth/weak-password') {
        alert('Password is too weak. Please enter a stronger password.');
      }
      else {
        alert('Signup failed. Please try again.');
      }
    }
    finally{
      setLoading(false);
    }
  }

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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
          <Image source={require('../assets/images/applogo.png')} style={styles.imagelogo} />

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: "1%", marginBottom: "5%", alignSelf: 'center', color: 'green' }}>
              Sign Up
            </Text>
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(text) => setConfirmPassword(text)}
              autoCapitalize="none"
            />
            <View style={styles.loginButton}>
              {loading ? <ActivityIndicator size="large" color="green" /> 
                :<> 
               <MyButton title={"Sign Up"} onPress={onSignup} style={{}}/>
               </>
               }

            </View>
            <Text style={styles.loginLink} onPress={onLogin}>
              Already have an account? Login
            </Text>

          </View>

          {!isKeyboardVisible && (
            <View style={styles.footer}>
              <Image source={require('../assets/images/transparant.png')} style={styles.footerImage} />
            </View>
          )}
        </View>
      </ScrollView>


    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  imagelogo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: "17%",
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
  loginLink: {
    marginTop: "5%",
    color: 'blue',
    fontSize: 17,
  }
});
