import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { database, storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';

// Helper: convert blob to base64
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const TAGS = [
  'Slopers', 'Crimps', 'Jugs', 'Pinches', 'Pockets', 'Edges', 'Volumes',
  'Dynamic', 'Static', 'Powerful', 'Technical', 'Mantle', 'Overhang',
  'Heel hook', 'Toe hook', 'Bicycle', 'Gaston', 'Undercling', 'Match-heavy',
  'Slab', 'Vertical', 'Arete', 'Dihedral / Corner'
];

const TAG_COLORS = TAGS.reduce((acc, tag, i) => {
  acc[tag] = `hsl(${(i * 40) % 360}, 70%, 70%)`;
  return acc;
}, {});

export default function YouScreen({ userId }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [aiImageUri, setAiImageUri] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const userPostsRef = ref(database, `${userId}/personal`);
    const unsubscribe = onValue(userPostsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.entries(data).map(([id, post]) => ({
          id,
          ...post,
        }));
        setPosts(formatted);
      }
    });
    return () => unsubscribe();
  }, [userId]);

  const handleAIAnalyze = async () => {
    if (!selectedPost || !selectedPost.imageUrl) return;
    setLoadingAI(true);

    try {
      const localPath = `${FileSystem.documentDirectory}${selectedPost.id}.jpg`;
      const downloaded = await FileSystem.downloadAsync(selectedPost.imageUrl, localPath);

      const formData = new FormData();
      formData.append('file', {
        uri: downloaded.uri,
        name: 'climb.jpg',
        type: 'image/jpeg',
      });

      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const blob = await res.blob();

      const base64data = await blobToBase64(blob);
      const tempLocalPath = `${FileSystem.documentDirectory}ai_${selectedPost.id}.png`;
      await FileSystem.writeAsStringAsync(tempLocalPath, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setAiImageUri(tempLocalPath);

      // Ask user to save AI image
      Alert.alert('AI Analysis Complete', 'Save AI-analyzed image to Firebase?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async () => {
            const aiStorageRef = storageRef(storage, `images/${userId}/${selectedPost.id}/ai/processed.png`);
            await uploadBytes(aiStorageRef, blob);
            const aiUrl = await getDownloadURL(aiStorageRef);

            const postRef = ref(database, `${userId}/personal/${selectedPost.id}`);
            await update(postRef, { hasAI: true, aiImageUrl: aiUrl });
            Alert.alert('Saved!', 'AI image has been stored.');
          },
        },
      ]);
    } catch (err) {
      console.error('AI Analyze error:', err);
      Alert.alert('Error', 'Failed to run AI analysis.');
    } finally {
      setLoadingAI(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedPost(item);
        setAiImageUri(null);
      }}
      style={styles.card}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.grade}>{item.grade}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { marginTop: 60 }]}>
      {posts.length === 0 ? (
        <Text>No climbs yet</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <Modal visible={!!selectedPost} transparent animationType="fade">
        {selectedPost && (
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setSelectedPost(null);
                setAiImageUri(null);
              }}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: aiImageUri || selectedPost.imageUrl }}
              style={styles.fullImage}
            />

            <View style={styles.details}>
              <Text style={styles.title}>{selectedPost.title}</Text>
              <Text style={styles.grade}>Grade: {selectedPost.grade}</Text>
              <Text style={styles.stage}>Stage: {selectedPost.stage}</Text>
              <View style={styles.tagWrap}>
                {selectedPost.tags?.map(tag => (
                  <View key={tag} style={[styles.tag, { backgroundColor: TAG_COLORS[tag] }]}>
                    <Text style={{ color: 'black' }}>{tag}</Text>
                  </View>
                ))}
              </View>

              {loadingAI ? (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
              ) : (
                <Button title="Run AI Analyze" onPress={handleAIAnalyze} />
              )}
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    height: 200,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  grade: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flexGrow: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
    paddingTop: 60,
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  details: {
    padding: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  stage: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    margin: 4,
    backgroundColor: '#eee',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    fontSize: 30,
    color: 'white',
  },
});
