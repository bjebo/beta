import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const TAGS = [
  'Slopers', 'Crimps', 'Jugs', 'Pinches', 'Pockets', 'Edges', 'Volumes',
  'Dynamic', 'Static', 'Powerful', 'Technical', 'Mantle', 'Overhang',
  'Heel hook', 'Toe hook', 'Bicycle', 'Gaston', 'Undercling', 'Match-heavy',
  'Slab', 'Vertical', 'Arete', 'Dihedral / Corner'
];

const TAG_COLORS = {
  'Slopers': '#FF6B6B',
  'Crimps': '#6B8EFF',
  'Jugs': '#FFD93D',
  'Pinches': '#FF9F1C',
  'Pockets': '#6BCB77',
  'Edges': '#4D96FF',
  'Volumes': '#9D4EDD',
  'Dynamic': '#FF5E5E',
  'Static': '#1FAB89',
  'Powerful': '#E07A5F',
  'Technical': '#81B29A',
  'Mantle': '#3D5A80',
  'Overhang': '#EE6C4D',
  'Heel hook': '#98C1D9',
  'Toe hook': '#F4A261',
  'Bicycle': '#E5989B',
  'Gaston': '#C8553D',
  'Undercling': '#43AA8B',
  'Match-heavy': '#8ECAE6',
  'Slab': '#B5838D',
  'Vertical': '#6A994E',
  'Arete': '#5A189A',
  'Dihedral / Corner': '#0F4C5C'
};

export default function TagSelector({ selectedTags, onChange }) {
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {TAGS.map((tag) => (
        <TouchableOpacity
          key={tag}
          style={[styles.tagButton, {
            backgroundColor: selectedTags.includes(tag) ? TAG_COLORS[tag] : '#eee',
            borderColor: TAG_COLORS[tag],
          }]}
          onPress={() => toggleTag(tag)}
        >
          <Text style={[styles.tagText, { color: selectedTags.includes(tag) ? '#fff' : TAG_COLORS[tag] }]}>
            {tag}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    padding: 10
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
