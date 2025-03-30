import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const Post = ({
  profileImage,
  profileName,
  postImage,
  timestamp,
  title,
  stage,
  grade,
}) => {
  const getCaption = () => {
    if (stage === 'Just Started') return `${profileName} just started ${title}`;
    if (stage === 'In Progress') return `${profileName} is working on ${title}`;
    if (stage === 'Completed') return `${profileName} has ascended ${title}`;
    return `${profileName} posted a climb`;
  };

  const getFormattedTime = () => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Change format if you prefer
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.dateText}>{getFormattedTime()}</Text>
        </View>
      </View>

      {/* Image */}
      <Image source={postImage} style={styles.postImage} resizeMode="cover" />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.caption}>{getCaption()}</Text>
        <Text style={styles.grade}>Grade: {grade}</Text>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    marginLeft: 8,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#eee',
  },
  footer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  grade: {
    fontSize: 14,
    color: '#555',
  },
});

export default Post;
