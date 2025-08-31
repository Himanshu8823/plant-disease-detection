import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Import screens
import Home from '../app/home';
import Detection from '../app/detection';
import Weather from '../app/weather';
import Analytics from '../app/analytics';
import Profile from '../app/profile';
import Settings from '../app/settings';
import Login from '../app/login';
import Signup from '../app/signup';
import ContactUs from '../app/contactus';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: isDark ? '#1e293b' : '#f0fdf4',
          width: 280,
        },
        drawerActiveBackgroundColor: '#22c55e',
        drawerActiveTintColor: '#ffffff',
        drawerInactiveTintColor: isDark ? '#64748b' : '#374151',
        drawerLabelStyle: {
          fontWeight: '600',
          fontSize: 16,
          marginLeft: -10,
        },
        headerStyle: {
          backgroundColor: '#22c55e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen
        name="home"
        component={Home}
        options={{
          drawerLabel: "Dashboard",
          title: "Plant Disease Detector",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='grid-outline' size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="detection"
        component={Detection}
        options={{
          drawerLabel: "Disease Detection",
          title: "Plant Disease Detection",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='camera-outline' size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="weather"
        component={Weather}
        options={{
          drawerLabel: "Weather & Agriculture",
          title: "Weather & Agriculture",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='partly-sunny-outline' size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="analytics"
        component={Analytics}
        options={{
          drawerLabel: "Analytics & Insights",
          title: "Analytics & Insights",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='analytics-outline' size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        component={Profile}
        options={{
          drawerLabel: "Profile",
          title: "User Profile",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='person-outline' size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        component={Settings}
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='settings-outline' size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="login"
        component={Login}
        options={{
          drawerLabel: "Login",
          title: "Login",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='log-in-outline' size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="signup"
        component={Signup}
        options={{
          drawerLabel: "Sign Up",
          title: "Sign Up",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='person-add-outline' size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="contactus"
        component={ContactUs}
        options={{
          drawerLabel: "Contact Us",
          title: "Contact Us",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='mail-outline' size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
