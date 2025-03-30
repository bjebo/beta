// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get, child } from 'firebase/database';
import { auth, database } from '../../firebase';

export default function LoginScreen({ navigation, setIsLoggedIn, setUserToken }) {
  const [email, setEmail] = useState('a@b.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // 🔍 Look up user's custom userId in the Realtime DB
      const snapshot = await get(child(ref(database), 'users'));
      let foundUserId = null;

      if (snapshot.exists()) {
        const users = snapshot.val();
        for (let key in users) {
          if (users[key].firebaseUid === user.uid) {
            foundUserId = key;
            break;
          }
        }
      }

      if (!foundUserId) {
        throw new Error('User ID not found in database');
      }

      // ✅ Pass info to App.js to show RootNavigator
      setUserToken({ token, userId: foundUserId });
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icons/logo.png')} // Update the path as needed
        style={styles.logo}
      />

      <TextInput
        placeholder="a@b.com"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="123456"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Sign In" onPress={handleLogin} 
      color={'#94962C'}/>

      <View style={[styles.linkContainer,  ]}>
        <Text>Don't have an account?</Text>
        <Button color={'#94962C'} title="Create Account" onPress={() => navigation.navigate('Signup')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#ffffff' },
  title: { fontSize: 28, marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 6 },
  linkContainer: { marginTop: 20, alignItems: 'center' },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center', // Centers the image horizontally within its parent
  },
});
