import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function RootNavigator({ userToken, userId }) {
  console.log('Logged-in user token:', userToken); 
  

  return (
    <Stack.Navigator>
      {/* The bottom tabs live here */}
      <Stack.Screen
        name="MainTabs"
        options={{ headerShown: false }}
      >
        {() => <BottomTabs userId={userId} />}
      </Stack.Screen>
      {/* A screen that can be pushed from anywhere inside MainTabs */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );
}
