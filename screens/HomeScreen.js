import React, { useEffect, useState } from 'react';
import { View, Image, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import Post from '../components/post';

export default function HomeScreen({ userId }) {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('Anonymous Climber');

  useEffect(() => {
    // Fetch user's username
    const userRef = ref(database, `users/${userId}/username`);
    onValue(userRef, (snapshot) => {
      const name = snapshot.val();
      if (name) setUsername(name);
    });

    // Fetch posts
    const userPostsRef = ref(database, `${userId}/personal`);
    const unsubscribe = onValue(userPostsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.entries(data)
          .map(([id, post]) => ({
            id,
            ...post,
          }))
          .sort((a, b) => b.timestamp - a.timestamp); // newest first
        setPosts(formatted);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header with Logo */}
      <View style={styles.header}>
        
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Image
            source={require('../assets/icons/logo.png')}
            style={styles.logo}
          />
        {posts.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text>No posts yet.</Text>
          </View>
        ) : (
          posts.map(post => (
            <Post
              key={post.id}
              profileName={username}
              postImage={{ uri: post.imageUrl }}
              timestamp={post.timestamp}
              stage={post.stage}
              title={post.title}
              grade={post.grade}
              // profileImage={require('../assets/avatar-placeholder.png')}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff', // Sets the background of the safe area to white
  },
  header: {
    alignItems: 'left',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
