import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { useFonts } from 'expo-font';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null); 

  return (
    <NavigationContainer>
      {isLoggedIn ? <RootNavigator userToken={userToken.token} userId={userToken.userId} />
 : <AuthNavigator setIsLoggedIn={setIsLoggedIn} setUserToken={setUserToken}/>}
      
    </NavigationContainer>
  );
}
