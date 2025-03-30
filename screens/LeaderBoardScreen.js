// LeaderBoardScreen.js
import React from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';

const LeaderBoardScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={require('../assets/leaderboard_image.jpg')} // Update path to your image
        style={[styles.image, { marginTop: 52 }]}
      />
      {/* Optionally add more content */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 800,         // Adjust height based on your design
    resizeMode: 'cover',
  },
});

export default LeaderBoardScreen;
