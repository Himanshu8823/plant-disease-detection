import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#4ade80',
        },
        headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
        },
        drawerActiveTintColor: '#4ade80',
        drawerInactiveTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="detection"
        options={{
          title: 'Disease Detection',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="weather"
        options={{
          title: 'Weather',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="analytics" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="chat"
        options={{
          title: 'AI Expert Chat',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="contactus"
        options={{
          title: 'Contact Us',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="mail" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          title: 'Login',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-in" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}