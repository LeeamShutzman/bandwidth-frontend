import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const TaskForm = ({ isVisible, onClose, onSave, onDelete, initialTask = null }) => {
  const { theme } = useTheme();
  const isEdit = !!initialTask;

  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  useEffect(() => {
    if (isVisible) {
      setTaskText(isEdit ? initialTask.text : '');
      setPriority(isEdit ? initialTask.priority : 'MEDIUM');
    }
  }, [isVisible, initialTask, isEdit]);

  const handleSubmit = () => {
    if (!taskText.trim()) return;
    onSave(taskText, priority);
    onClose();
  };

  const handleDelete = () => {
    if (!isEdit) return;
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to delete this task?");
      if (confirmed) {
        onDelete(initialTask.id);
        onClose();
      }
    } else {
      Alert.alert("Confirm Deletion", "Are you sure you want to delete this task?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => { onDelete(initialTask.id); onClose(); } },
      ]);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        
        {/* 1. THE FIX: The background closer is now a SIBLING to the content */}
        <Pressable 
          style={StyleSheet.absoluteFill} 
          onPress={onClose} 
        />

        {/* 2. Content container - No longer wrapped in Touchables */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
          pointerEvents="box-none" // Allows clicks to pass through container to the background Pressable
        >
          <View 
            style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}
            // Prevent clicks inside the card from triggering the background Pressable
            onStartShouldSetResponder={() => true} 
            onTouchEnd={(e) => e.stopPropagation()} 
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {isEdit ? 'Edit Task' : 'Add New Task'}
            </Text>

            <TextInput
              autoFocus={Platform.OS === 'web'}
              multiline
              numberOfLines={4}
              style={[
                styles.input,
                {
                  borderColor: theme.inputBackground,
                  backgroundColor: theme.inputBackground,
                  color: theme.text
                }
              ]}
              placeholder="Task description..."
              placeholderTextColor={theme.text === 'white' ? '#aaa' : '#777'}
              value={taskText}
              onChangeText={setTaskText}
              // Required for some browsers to keep focus
              onFocus={(e) => e.stopPropagation()}
            />

            <View style={styles.labelContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Priority:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={priority}
                  style={[styles.picker, { color: theme.text }]}
                  dropdownIconColor={theme.text}
                  onValueChange={(itemValue) => setPriority(itemValue)}
                >
                  <Picker.Item label="HIGH" value="HIGH" />
                  <Picker.Item label="MEDIUM" value="MEDIUM" />
                  <Picker.Item label="LOW" value="LOW" />
                </Picker>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { backgroundColor: theme.primaryButton }]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{isEdit ? 'Save' : 'Create'}</Text>
              </TouchableOpacity>
            </View>

            {isEdit && (
              <View style={[styles.buttonRow, styles.deleteRow]}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: initialTask.completed ? '#f59e0b' : '#10b981', flex: 1.5 }]}
                  onPress={() => onSave(taskText, priority, !initialTask.completed)}
                >
                  <Text style={styles.buttonText}>{initialTask.completed ? 'Reopen' : 'Complete'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 5, // Keep it above the Pressable background
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    minHeight: 100,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  labelContainer: { marginTop: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  pickerWrapper: {
    marginTop: -15,
    height: Platform.OS === 'ios' ? 120 : 50,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    ...Platform.select({
      web: {
        appearance: 'base-select',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 20,
        cursor: 'pointer',
        outlineStyle: 'none',
        backgroundColor: 'transparent',
      },
      ios: { transform: [{ scale: 0.9 }] },
    }),
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, width: '100%' },
  button: { paddingVertical: 14, flexBasis: 0, borderRadius: 12, flex: 1, alignItems: 'center', marginHorizontal: 6 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  cancelButton: { backgroundColor: '#6b7280' },
  deleteRow: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  deleteButton: { backgroundColor: '#dc2626', flex: 1 },
});

export default TaskForm;