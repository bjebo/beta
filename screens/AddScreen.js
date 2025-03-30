import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, database } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const TAGS = [
  'Slopers', 'Crimps', 'Jugs', 'Pinches', 'Pockets', 'Edges', 'Volumes',
  'Dynamic', 'Static', 'Powerful', 'Technical', 'Mantle', 'Overhang',
  'Heel hook', 'Toe hook', 'Bicycle', 'Gaston', 'Undercling', 'Match-heavy',
  'Slab', 'Vertical', 'Arete', 'Dihedral / Corner'
];

const STAGES = ['Just Started', 'In Progress', 'Completed'];
const GRADES = Array.from({ length: 13 }, (_, i) => `V${i}`);
const GRADE_COLORS = GRADES.reduce((acc, grade, i) => {
  acc[grade] = `hsl(${(i * 28) % 360}, 70%, 60%)`;
  return acc;
}, {});
const TAG_COLORS = TAGS.reduce((acc, tag, i) => {
  acc[tag] = `hsl(${(i * 40) % 360}, 70%, 70%)`;
  return acc;
}, {});

export default function AddScreen({ userId }) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('');
  const [gradeDropdownVisible, setGradeDropdownVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [stage, setStage] = useState('Just Started');
  const [fullscreen, setFullscreen] = useState(false);
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePost = async () => {
    if (!image || !title || !grade) return;

    try {
      const postRef = push(dbRef(database, `${userId}/personal`));
      const postId = postRef.key;

      const response = await fetch(image);
      const blob = await response.blob();
      const imageRef = storageRef(storage, `images/${userId}/${postId}`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      await set(postRef, {
        postId,
        title,
        grade,
        tags: selectedTags,
        stage,
        imageUrl,
        timestamp: Date.now(),
        hasAI: false,
      });

      setImage(null);
      setTitle('');
      setGrade('');
      setSelectedTags([]);
      setStage('Just Started');
      navigation.navigate('You');
    } catch (err) {
      console.error('Error posting:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ marginTop: 60 }}>
      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        {image ? (
          <TouchableOpacity onPress={() => setFullscreen(true)}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <Text>Upload Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      {/* Grade Dropdown */}
      <Text style={styles.sectionLabel}>Grade:</Text>
      <TouchableOpacity
        style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
        onPress={() => setGradeDropdownVisible(!gradeDropdownVisible)}
      >
        <Text>{grade || 'Select Grade'}</Text>
        {grade && (
          <View style={[styles.gradeDot, { backgroundColor: GRADE_COLORS[grade] }]} />
        )}
      </TouchableOpacity>

      {gradeDropdownVisible && (
        <FlatList
          data={GRADES}
          keyExtractor={(item) => item}
          numColumns={4}
          contentContainerStyle={{ marginBottom: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setGrade(item);
                setGradeDropdownVisible(false);
              }}
              style={[styles.gradeItem, { backgroundColor: GRADE_COLORS[item] }]}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Text style={styles.sectionLabel}>Tags:</Text>
      <View style={styles.tagsContainer}>
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, {
              backgroundColor: selectedTags.includes(tag) ? TAG_COLORS[tag] : '#eee'
            }]}
            onPress={() => toggleTag(tag)}
          >
            <Text>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Stage:</Text>
      <View style={styles.tagsContainer}>
        {STAGES.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.tag, {
              backgroundColor: stage === option ? '#666' : '#eee'
            }]}
            onPress={() => setStage(option)}
          >
            <Text style={{ color: stage === option ? 'white' : 'black' }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Post" onPress={handlePost} disabled={!image || !title || !grade} />

      <Modal visible={fullscreen} transparent>
        <View style={styles.fullscreenOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setFullscreen(false)}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: image }} style={styles.fullscreenImage} />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imageUpload: {
    alignItems: 'center',
    marginBottom: 16,
    height: 200,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden'
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionLabel: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  gradeItem: {
    flex: 1,
    margin: 5,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  gradeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    color: 'white',
    fontSize: 30,
  },
});
