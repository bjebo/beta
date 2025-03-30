import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/authscreens/LoginScreen';
import SignupScreen from '../screens/authscreens/SignupScreen';


const Stack = createStackNavigator();

export default function AuthNavigator({ setIsLoggedIn, setUserToken  }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} setUserToken={setUserToken} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}