import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const stages = ['Just Started', 'In Progress', 'Completed'];

const StageSelector = ({ selectedStage, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Stage</Text>
      <View style={styles.buttonContainer}>
        {stages.map((stage) => (
          <TouchableOpacity
            key={stage}
            style={[
              styles.button,
              selectedStage === stage && styles.buttonSelected,
            ]}
            onPress={() => onChange(stage)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedStage === stage && styles.buttonTextSelected,
              ]}
            >
              {stage}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default StageSelector;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonSelected: {
    backgroundColor: '#555',
    borderColor: '#555',
  },
  buttonText: {
    color: '#333',
    fontWeight: '500',
  },
  buttonTextSelected: {
    color: '#fff',
  },
});
