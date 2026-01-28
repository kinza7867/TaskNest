import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Platform,
  Vibration,
  StatusBar,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTasks, saveTasks } from '../storage/taskStorage';

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyzMEYnk5Yg19Ekv75mj-jDoPJul24-sp96w&s';

export default function EditTaskScreen({ route, navigation }) {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState(task.priority || 'Medium');

  const priorities = ['Low', 'Medium', 'High'];

  const updateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Attention', 'A mission title is required.');
      return;
    }

    Vibration.vibrate(10);
    const tasks = await getTasks();
    const updated = tasks.map(t =>
      t.id === task.id ? { ...t, title, description, dueDate: dueDate.toISOString(), priority } : t
    );
    await saveTasks(updated);
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDueDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER: LOGO AND TITLE GROUPED CLOSE */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <View style={styles.logoBadge}>
                <Image source={{ uri: LOGO_URL }} style={styles.miniLogo} />
              </View>
              <Text style={styles.headerTitle}>Edit Task</Text>
            </View>
          </View>

          <View style={styles.headerRightPlaceholder}>
             <TouchableOpacity onPress={updateTask}>
                <Ionicons name="checkmark-done" size={24} color="#6366F1" />
             </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TITLE INPUT */}
          <Text style={styles.label}>Mission Objective</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="Objective name..."
              placeholderTextColor="#475569"
            />
          </View>

          {/* DESCRIPTION INPUT */}
          <Text style={styles.label}>Briefing Details</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.multilineInput]}
              multiline
              numberOfLines={4}
              placeholder="Enter technical specifications..."
              placeholderTextColor="#475569"
            />
          </View>

          {/* DATE PICKER */}
          <Text style={styles.label}>Deadline</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.dateLeft}>
                <Ionicons name="calendar" size={18} color="#6366F1" style={{marginRight: 10}} />
                <Text style={styles.dateText}>{dueDate.toDateString()}</Text>
            </View>
            <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>Modify</Text>
            </View>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              textColor="white"
            />
          )}

          {/* PRIORITY SELECTION */}
          <Text style={styles.label}>Threat Level</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((p) => {
              const isActive = priority === p;
              const color = p === 'High' ? '#EF4444' : p === 'Medium' ? '#F59E0B' : '#10B981';
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    isActive && { borderColor: color, backgroundColor: `${color}15` }
                  ]}
                  onPress={() => { Vibration.vibrate(5); setPriority(p); }}
                >
                  <View style={[styles.statusDot, { backgroundColor: color }]} />
                  <Text style={[styles.priorityText, isActive && { color: '#FFF' }]}>{p}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.updateBtn} onPress={updateTask}>
              <Text style={styles.updateBtnText}>Update Mission</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelBtnText}>Discard Changes</Text>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#86a4d4ee',
    height: 75,
    position: 'relative',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { 
    backgroundColor: '#4F46E5', 
    padding: 10, 
    borderRadius: 12,
    marginRight: 65,
  },
  headerTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  logoBadge: { 
    width: 34, 
    height: 34, 
    borderRadius: 18, 
    backgroundColor: '#FFF', 
    marginRight: 10, 
    overflow: 'hidden', 
    borderWidth: 2, 
    borderColor: '#6366F1' 
  },
  miniLogo: { width: '100%', height: '100%' },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#FFF', 
    letterSpacing: 0.5 
  },
  closeBtn: {
    padding: 5
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#e9ecf0',
    marginTop: 25,
    marginBottom: 10,
    letterSpacing: 1
  },
  inputContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#224372',
    overflow: 'hidden'
  },
  input: {
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500'
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#224372'
  },
  dateLeft: { flexDirection: 'row', alignItems: 'center' },
  dateText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  editBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  editBadgeText: { color: '#94A3B8', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#224372'
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8
  },
  priorityText: { color: '#475569', fontWeight: '800', fontSize: 13 },
  buttonContainer: { marginTop: 40 },
  updateBtn: {
    backgroundColor: '#6366F1',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  updateBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  cancelBtn: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center'
  },
  cancelBtnText: { color: '#607899', fontWeight: '700', fontSize: 13 }
});