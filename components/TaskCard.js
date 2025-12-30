// components/TaskCard.js

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRIORITY_STYLES } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const TaskCard = ({ task, onSelectTask }) => {
  const { theme } = useTheme();

  // Look up priority colors, defaulting to LOW if not found
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.LOW;

  const cardStyle = {
    backgroundColor: priorityStyle.cardBg, // Use the priority background color
    borderColor: priorityStyle.text,
  };

  const textStyle = {
    color: priorityStyle.text,
  };

  // The TaskCard now only needs to handle the click to open the Edit modal
  return (

        <TouchableOpacity
          style={[styles.card, cardStyle]}
          onPress={() => onSelectTask(task)} // Opens the modal
          activeOpacity={0.7}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.taskText, textStyle]}>{task.text}</Text>

            {/* Priority Label */}
            <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.cardBg, borderColor: priorityStyle.text }]}>
              <Text style={[styles.priorityText, textStyle]}>{task.priority}</Text>
            </View>
          </View>
        </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    margin: 8,
    // width: Platform.OS === 'web' ? '100%' : '100%', 
    // The grid layout is handled in App.js FlatList
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    // Add margin for mobile platforms to ensure better word wrapping
    paddingRight: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    alignSelf: 'flex-start', // Fit content width
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default TaskCard;