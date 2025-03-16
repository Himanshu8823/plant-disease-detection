import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../app/home';
import Detection from '../app/detection';
import { Ionicons } from '@expo/vector-icons';
import ContactUs from '@/app/contactus';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#228B22', // Change this to your desired color
          width: 240, // Set the width if needed
        },
        drawerActiveBackgroundColor: "skyblue",
        drawerLabelStyle: {
          color: 'white', // Change this to the desired color for the drawer item labels
          fontWeight: 'bold', // Optional: make the text bold
          marginTop:10,
          
          fontSize:17
        },
        
      }}
    >
      <Drawer.Screen
        name="home"
        component={Home}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: 'green',
            
          },
          drawerLabel: "Home",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='home-outline' size={size} color='white' style={{marginTop:10}}/>
          ),
        }}
      />
      <Drawer.Screen
        name="detection"
        component={Detection}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: "green",
          },
          drawerLabel: "Detection",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='eye' size={size} color='white' style={{marginTop:10}}/>
          ),
        }}
      />
      <Drawer.Screen
        name='contactus'
        component={ContactUs}
        options={{
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "green",
          },
          drawerLabel: "Contact Us",
          drawerIcon: ({ size, color }) => (
            <Ionicons name='mail' size={size} color='white' style={{marginTop:10}}/>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
