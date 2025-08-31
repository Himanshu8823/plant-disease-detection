import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Keep NavigationContainer here
import DrawerNavigator from './navigation/DrawerNavigator'; // Import your drawer navigation

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator /> {/* Render DrawerNavigator inside the single NavigationContainer */}
    </NavigationContainer>
  );
}
