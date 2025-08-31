
import { Stack } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import MyDrawer from "../navigation/DrawerNavigator"; // Correct the import path

export default function RootLayout() {
  return (
    <MyDrawer />  
    
  );
}

const styles = StyleSheet.create({
  navButton: {
    paddingRight: 15, // Add padding to the right
  },
});
