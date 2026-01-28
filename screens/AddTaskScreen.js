import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  StatusBar,
  Image,
  Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTasks, saveTasks } from '../storage/taskStorage';

const { width } = Dimensions.get('window');
const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyzMEYnk5Yg19Ekv75mj-jDoPJul24-sp96w&s';

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [mood, setMood] = useState('😊');
  const [category, setCategory] = useState('Work');

  const moods = ['😊', '🔥', '🧘', '🧠', '⚡', '😴'];
  const categories = ['Work', 'Personal', 'Health', 'Urgent', 'Finance', 'Ideas'];

  const addTask = async () => {
    if (!title.trim()) {
      Vibration.vibrate(50);
      return Alert.alert('Missing Title', 'Please name your task.');
    }

    const tasks = await getTasks();
    tasks.push({
      id: Date.now().toString(),
      title,
      description,
      priority,
      mood,
      category,
      completed: false,
      createdAt: new Date().toISOString()
    });

    await saveTasks(tasks);
    Vibration.vibrate(10);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* ELITE HEADER WITH LOGO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <View style={styles.logoBadge}>
               <Image source={{ uri: LOGO_URL }} style={styles.miniLogo} />
            </View>
            <Text style={styles.headerTitle}>New Task</Text>
          </View>

          <View style={{ width: 45 }} />
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            
            {/* INPUT CARD (Elite Slate) */}
            <View style={styles.glassInputCard}>
              <Text style={styles.inputLabel}>IDENTIFIER</Text>
              <TextInput
                placeholder="What's the mission?"
                style={styles.titleInput}
                placeholderTextColor="#475569"
                onChangeText={setTitle}
                value={title}
              />
              <View style={styles.darkDivider} />
              <Text style={styles.inputLabel}>SPECIFICATIONS</Text>
              <TextInput
                placeholder="Technical details..."
                style={styles.descInput}
                multiline
                onChangeText={setDescription}
                placeholderTextColor="#475569"
              />
            </View>

            {/* MOOD SELECTION */}
            <Text style={styles.sectionHeading}>Vibe / Energy</Text>
            <View style={styles.moodGrid}>
              {moods.map((m) => (
                <TouchableOpacity 
                  key={m} 
                  style={[styles.moodBox, mood === m && styles.moodBoxActive]}
                  onPress={() => setMood(m)}
                >
                  <Text style={{ fontSize: 24 }}>{m}</Text>
                  {mood === m && <View style={styles.glowDot} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* PRIORITY SELECTION */}
            <Text style={styles.sectionHeading}>Execution Priority</Text>
            <View style={styles.priorityRow}>
              {['Low', 'Medium', 'High'].map((p) => (
                <TouchableOpacity 
                  key={p} 
                  style={[
                    styles.priorityCard, 
                    priority === p && { backgroundColor: getPriorityColor(p), borderColor: getPriorityColor(p) }
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityText, priority === p && { color: '#0F172A' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* CATEGORY (Horizontal Scroll) */}
            <Text style={styles.sectionHeading}>Domain</Text>
            <View style={styles.catWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                {categories.map((cat) => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.catChip, category === cat && styles.catChipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Ionicons 
                      name={getCatIcon(cat)} 
                      size={14} 
                      color={category === cat ? "#FFF" : "#6366F1"} 
                    />
                    <Text style={[styles.catChipText, category === cat && { color: '#FFF' }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* CREATE BUTTON */}
            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8} onPress={addTask}>
              <Text style={styles.submitBtnText}>DEPLOY TASK</Text>
              <View style={styles.submitIconBox}>
                <Ionicons name="rocket-outline" size={18} color="#6366F1" />
              </View>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const getPriorityColor = (p) => {
  if(p === 'High') return '#F87171';
  if(p === 'Medium') return '#FB923C';
  return '#4ADE80';
};

const getCatIcon = (cat) => {
    switch(cat) {
      case 'Work': return 'briefcase-outline';
      case 'Personal': return 'person-outline';
      case 'Health': return 'heart-outline';
      case 'Urgent': return 'flash-outline';
      case 'Finance': return 'wallet-outline';
      default: return 'bookmark-outline';
    }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' }, 
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.46)'
  },
  backBtn: { backgroundColor: '#1E293B', width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  logoBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', marginRight: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#6366F1' },
  miniLogo: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },
  
  scrollBody: { paddingHorizontal: 20, paddingBottom: 50 },
  
  glassInputCard: { 
    backgroundColor: '#1E293B', 
    borderRadius: 24, 
    padding: 22, 
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(140, 163, 238, 0.33)'
  },
  inputLabel: { fontSize: 12, fontWeight: '800', color: '#bcbcf3', letterSpacing: 1, marginBottom: 10 },
  titleInput: { fontSize: 20, fontWeight: '700', color: '#FFF', paddingVertical: 5 },
  darkDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 18 },
  descInput: { fontSize: 15, color: '#94A3B8', height: 80, textAlignVertical: 'top', fontWeight: '500' },

  sectionHeading: { fontSize: 11, fontWeight: '900', color: '#bcbcf3', marginTop: 30, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 2 },
  
  moodGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBox: { 
    width: (width - 60) / 6.5, height: 55, 
    backgroundColor: '#1E293B', borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
  },
  moodBoxActive: { borderColor: '#6366F1', backgroundColor: 'rgba(99, 102, 241, 0.1)' },
  glowDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#6366F1', marginTop: 4 },

  priorityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priorityCard: { 
    flex: 1, backgroundColor: '#1E293B', paddingVertical: 14, 
    borderRadius: 16, alignItems: 'center', marginHorizontal: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
  },
  priorityText: { fontWeight: '900', fontSize: 12, color: '#64748B' },

  catWrapper: { marginHorizontal: -20 },
  catScroll: { paddingHorizontal: 20 },
  catChip: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', 
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 15, 
    marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' 
  },
  catChipActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  catChipText: { marginLeft: 8, fontWeight: '700', fontSize: 13, color: '#64748B' },

  submitBtn: {
    backgroundColor: '#FFF', 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderRadius: 22, marginTop: 45,
    shadowColor: '#6366F1', shadowOpacity: 0.3, shadowRadius: 20, elevation: 5
  },
  submitBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  submitIconBox: { backgroundColor: '#EEF2FF', width: 35, height: 35, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }
});