import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const DrawerContent = (props:any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.headerText}>Smart Irrigation System</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity onPress={() => props.navigation.navigate('Login')} style={styles.drawerItem}>
        <Text style={styles.itemText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
  },
  drawerItem: {
    padding: 15,
    alignItems: 'flex-start',
  },
  itemText: {
    fontSize: 18,
  },
});

export default DrawerContent;
