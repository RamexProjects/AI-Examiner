import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { RootStackParamList } from './src/types';

// Create the navigation stack with our typed list
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, 
          contentStyle: { backgroundColor: '#0f172a' } 
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* We will add Quiz and Result screens here later */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}