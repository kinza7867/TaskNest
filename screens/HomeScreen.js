import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  Dimensions,
  Vibration,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTasks, saveTasks } from '../storage/taskStorage';

const { width } = Dimensions.get('window');
const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyzMEYnk5Yg19Ekv75mj-jDoPJul24-sp96w&s';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  // Reload tasks every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    const data = await getTasks();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(data || []);
  };

  const categories = ['All', 'Work', 'Personal', 'Health', 'Urgent'];

  const toggleComplete = async (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const updated = tasks.map(t => t.id === item.id ? {...t, completed: !t.completed} : t);
    setTasks(updated);
    await saveTasks(updated);
    if (!item.completed) Vibration.vibrate(10);
  };

  const completed = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? completed / tasks.length : 0;

  const renderTask = ({ item }) => (
    <View style={styles.taskWrapper}>
      <View style={[styles.taskCard, item.completed && styles.taskCardCompleted]}>
        <View style={[styles.priorityLine, { backgroundColor: getPriorityColor(item.priority) }]} />
        
        <TouchableOpacity 
          style={styles.taskMainContent} 
          onPress={() => toggleComplete(item)}
          activeOpacity={0.7}
        >
          <View style={styles.emojiContainer}>
            <Text style={styles.taskEmoji}>{item.mood || '✨'}</Text>
          </View>

          <View style={styles.taskTexts}>
            <Text style={[styles.taskTitle, item.completed && styles.strikeText]}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.taskSub}>{item.description || 'No description'}</Text>
          </View>
        </TouchableOpacity>

        {/* ACTION BUTTONS GROUP */}
        <View style={styles.actionGroup}>
          {/* EDIT BUTTON - Linked to EditTask Screen */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('EditTask', { task: item })} 
            style={styles.editIconBtn}
          >
            <Ionicons name="create-outline" size={20} color="#6366F1" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => toggleComplete(item)} style={styles.checkIcon}>
             <Ionicons 
              name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
              size={28} 
              color={item.completed ? "#10B981" : "#CBD5E1"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.topSection}>
        <SafeAreaView>
          <View style={styles.headerNav}>
            <View style={styles.userInfo}>
              <View style={styles.logoCircleSmall}>
                 <Image source={{ uri: LOGO_URL }} style={styles.miniLogo} />
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome back, 👋</Text>
                <Text style={styles.brandTitle}>TaskNest</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
                <Ionicons name="grid-outline" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.glassCard}>
            <View style={styles.glassRow}>
                <View>
                  <Text style={styles.glassLabel}>DAILY TARGET</Text>
                  <Text style={styles.glassValue}>{Math.round(progress * 100)}% <Text style={styles.doneText}>Done</Text></Text>
                </View>
                <View style={styles.statsIconBox}>
                  <Ionicons name="flash" size={20} color="#6366F1" />
                </View>
            </View>
            <View style={styles.fullBar}>
                <View style={[styles.fillBar, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.motivationQuote}>"Organize Today, Relax Tomorrow"</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.catContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 40}}>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setActiveCategory(cat);
                }}
                style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              >
                <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={activeCategory === 'All' ? tasks : tasks.filter(t => t.category === activeCategory)}
          renderItem={renderTask}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListHeaderComponent={<Text style={styles.sectionHeading}>Your Tasks</Text>}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={{fontSize: 50}}>🚀</Text>
              <Text style={styles.emptyTitle}>Clear Skies!</Text>
              <Text style={styles.emptySub}>No pending tasks found here.</Text>
            </View>
          }
        />
      </View>

      <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => navigation.navigate('AddTask')}>
        <Ionicons name="add" size={36} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const getPriorityColor = (p) => {
  if(p === 'High') return '#EF4444';
  if(p === 'Medium') return '#F59E0B';
  return '#10B981';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#162853' },
  topSection: { paddingHorizontal: 20, paddingBottom: 30, backgroundColor: '#0e1830' },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  logoCircleSmall: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFF', marginRight: 12, overflow: 'hidden', borderWidth: 2, borderColor: '#6366F1' },
  miniLogo: { width: '100%', height: '100%', resizeMode: 'cover' },
  welcomeText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  brandTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  settingsBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  
  glassCard: { backgroundColor: '#1E293B', borderRadius: 25, padding: 20, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)', marginTop: 10 },
  glassRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  glassLabel: { color: '#6366F1', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  glassValue: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  doneText: { fontSize: 14, color: '#94A3B8', fontWeight: '400' },
  statsIconBox: { width: 40, height: 40, backgroundColor: 'rgba(70, 72, 214, 0.1)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  fullBar: { height: 6, backgroundColor: '#3e597e', borderRadius: 3, marginVertical: 15, overflow: 'hidden' },
  fillBar: { height: '100%', backgroundColor: '#14db1e', borderRadius: 3 },
  motivationQuote: { color: '#64748B', fontSize: 11, fontStyle: 'italic', textAlign: 'center' },

  bottomSection: { flex: 1, backgroundColor: '#F8FAFC', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 20, paddingTop: 25 },
  catContainer: { marginBottom: 20 },
  catChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 12, backgroundColor: '#b1ccf0', marginRight: 10 },
  catChipActive: { backgroundColor: '#1b2c63' },
  catText: { color: '#3b5374', fontWeight: '700', fontSize: 13 },
  catTextActive: { color: '#FFF' },

  sectionHeading: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 15, marginLeft: 5 },
  taskWrapper: { marginBottom: 12 },
  taskCard: { 
    backgroundColor: '#b9c9df', 
    borderRadius: 20, 
    padding: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  taskCardCompleted: { opacity: 0.6, backgroundColor: '#bcbed8' },
  priorityLine: { width: 4, height: 30, borderRadius: 2, marginRight: 12 },
  taskMainContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  emojiContainer: { width: 45, height: 45, backgroundColor: '#07064d', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  taskEmoji: { fontSize: 20 },
  taskTexts: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  taskSub: { fontSize: 12, color: '#316dc0', marginTop: 2 },
  strikeText: { textDecorationLine: 'line-through' },
  
  actionGroup: { flexDirection: 'row', alignItems: 'center' },
  editIconBtn: { padding: 8, backgroundColor: '#99a8d6', borderRadius: 8, marginRight: 8 },
  checkIcon: { padding: 2 },

  fab: { position: 'absolute', bottom: 30, right: 20, width: 65, height: 65, borderRadius: 20, backgroundColor: '#1a1b5c', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#6366F1', shadowOpacity: 0.4, shadowRadius: 10 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#071122', marginTop: 15 },
  emptySub: { color: '#4f71a1', fontSize: 14, marginTop: 5 }
});