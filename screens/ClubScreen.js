// ClubScreen.js
import React from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';

const ClubScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={require('../assets/club_image.jpg')} // Update the path to your image
        style={[styles.image, { marginTop: 80 }]}
      />
      {/* You can add additional content below if desired */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow ensures the content container expands with content
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',       // Full screen width
    height: 800,         // Adjust height as needed
    resizeMode: 'cover', // Adjust as needed: 'contain' or 'cover'
  },
});

export default ClubScreen;