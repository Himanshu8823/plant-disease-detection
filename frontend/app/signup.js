import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LottieView from 'lottie-react-native';

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token and user data
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Failed',
        error.response?.data?.message || 'An error occurred during signup'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert('Coming Soon', 'Google signup will be available soon!');
  };

  const InputField = ({ 
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'words'
  }) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#64748b" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );

  const PasswordField = ({ 
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    showPassword, 
    setShowPassword 
  }) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#64748b" style={styles.inputIcon} />
      <TextInput
        style={[styles.input, styles.passwordInput]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.eyeIcon}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Ionicons
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color="#64748b"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <LottieView
            source={require('../assets/animations/plant-scan.json')}
            autoPlay
            loop
            style={styles.headerAnimation}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our plant health community</Text>
        </View>

        {/* Signup Form */}
        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <InputField
                icon="person"
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(value) => updateFormData('firstName', value)}
              />
            </View>
            <View style={styles.nameField}>
              <InputField
                icon="person"
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(value) => updateFormData('lastName', value)}
              />
            </View>
          </View>

          <InputField
            icon="mail"
            placeholder="Email address"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <PasswordField
            icon="lock-closed"
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <PasswordField
            icon="lock-closed"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
          />

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <LottieView
                source={require('../assets/animations/loading.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignup}
          >
            <Ionicons name="logo-google" size={20} color="#ea4335" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerAnimation: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nameField: {
    flex: 0.48,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
  termsLink: {
    color: '#4ade80',
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingAnimation: {
    width: 24,
    height: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#64748b',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 14,
    color: '#4ade80',
    fontWeight: 'bold',
  },
});