import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function BoulderLogCard({
  username,
  datetime,
  title,
  grade,
  tags = [],
  imageUrl,
  likes = 0,
  comments = 0,
  avatarUrl
}) {
  return (
    <View style={styles.card}>
      {/* Top section */}
      <View style={styles.header}>
        <Image
          source={{ uri: avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{datetime} by {username}</Text>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.badgeRow}>
        <Text style={styles.badge}>● {grade}</Text>
        {tags.map((tag, index) => (
          <Text
            key={index}
            style={[styles.badge, tag === 'Sloper' ? styles.highlightBadge : null]}
          >
            {tag}
          </Text>
        ))}
      </View>

      {/* Map area or post image */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.mapImage}
        />
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity>
          <Text style={styles.icon}>💬 {comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>👍 {likes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center'
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 12
  },
  title: {
    fontSize: 16, fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12, color: '#666'
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  badge: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    color: '#333',
    marginRight: 6,
    marginBottom: 6
  },
  highlightBadge: {
    backgroundColor: '#c00',
    color: '#fff'
  },
  mapContainer: {
    height: 200,
    backgroundColor: '#ddd'
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee'
  },
  icon: {
    fontSize: 16
  }
});
