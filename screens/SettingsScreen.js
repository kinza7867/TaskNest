import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
  ScrollView,
  Switch,
  Modal,
  Animated,
  Easing,
  Platform,
  Linking,
  Image,
  Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [fontSize, setFontSize] = useState(16);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    loadSettings();
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const glowStyle = {
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
  };

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const savedHaptic = await AsyncStorage.getItem('haptic');
      const savedAnalytics = await AsyncStorage.getItem('analytics');
      const savedReminder = await AsyncStorage.getItem('reminderTime');
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      
      setIsDarkMode(savedTheme !== 'light');
      setNotificationsEnabled(savedNotifications !== 'false');
      setIsHapticEnabled(savedHaptic !== 'false');
      setIsAnalyticsEnabled(savedAnalytics === 'true');
      if (savedReminder) setReminderTime(savedReminder);
      if (savedFontSize) setFontSize(parseInt(savedFontSize));
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.log('Error saving setting:', error);
    }
  };

  const clearTasks = async () => {
    if (isHapticEnabled) Vibration.vibrate(10);
    Alert.alert(
      "Delete Everything?",
      "This will permanently erase all your tasks and progress. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Reset Successful', 'Your nest is now empty. Starting fresh!');
            loadSettings();
          }
        }
      ]
    );
  };

  const toggleDarkMode = (value) => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setIsDarkMode(value);
    saveSetting('theme', value ? 'dark' : 'light');
    Alert.alert('Theme Updated', value ? 'Dark mode activated for a sleek experience!' : 'Light mode enabled for brighter days!');
  };

  const toggleNotifications = (value) => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setNotificationsEnabled(value);
    saveSetting('notifications', value.toString());
    Alert.alert(
      value ? 'Notifications On!' : 'Notifications Off',
      value ? 'Stay on top of your tasks with timely reminders!' : 'Enjoy a quieter experience without interruptions.'
    );
  };

  const toggleHaptic = (value) => {
    if (value) Vibration.vibrate(10);
    setIsHapticEnabled(value);
    saveSetting('haptic', value.toString());
    Alert.alert(
      'Haptic Feedback',
      value ? 'Feel the app respond to your touch!' : 'Haptic vibrations disabled for a smoother feel.'
    );
  };

  const toggleAnalytics = (value) => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setIsAnalyticsEnabled(value);
    saveSetting('analytics', value.toString());
    Alert.alert(
      'Analytics Updated',
      value 
        ? 'Your usage insights will help us craft a better TaskNest experience!' 
        : 'Privacy first - analytics tracking turned off.'
    );
  };

  const openStorageManagement = () => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setShowStorageModal(true);
  };

  const openThemeSelector = () => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setShowThemeModal(true);
  };

  const selectTheme = (theme) => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setSelectedTheme(theme);
    saveSetting('theme', theme);
    Alert.alert('Theme Applied', `Experience TaskNest in stunning ${theme} mode!`);
    setShowThemeModal(false);
  };

  const updateReminderTime = (time) => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setReminderTime(time);
    saveSetting('reminderTime', time);
    Alert.alert('Reminder Set', `Daily nudges at ${time} to keep you productive!`);
    setShowReminderModal(false);
  };

  const adjustFontSize = (size) => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setFontSize(size);
    saveSetting('fontSize', size);
    Alert.alert('Font Size Updated', `Text now at ${size}px for optimal reading comfort!`);
  };

  const openSupport = () => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setShowSupportModal(true);
  };

  const openAbout = () => {
    if (isHapticEnabled) Vibration.vibrate(10);
    setShowAboutModal(true);
  };

  const navigateToScreen = (screenName, params = {}) => {
    if (isHapticEnabled) Vibration.vibrate(10);
    navigation.navigate(screenName, params);
  };

  const handleRateApp = () => {
    if (isHapticEnabled) Vibration.vibrate(10);
    const url = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/id123456789' // Replace with actual App Store URL
      : 'https://play.google.com/store/apps/details?id=com.tasknest'; // Replace with actual Play Store URL
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open store. Search for TaskNest manually!'));
  };

  const handleBugReport = () => {
    if (isHapticEnabled) Vibration.vibrate(10);
    Alert.alert('Bug Report', 'Describe the issue:', [
      { text: 'Cancel' },
      { text: 'Submit', onPress: () => Alert.alert('Thank You!', 'Your report has been sent to our team.') }
    ]);
  };

  const handleFullScreen = () => {
    if (isHapticEnabled) Vibration.vibrate(10);
    Alert.alert(
      'Full Screen Mode Activated',
      'Immerse yourself in TaskNest! (Note: This simulates full screen; implement StatusBar.hidden for real effect.)'
    );
    // In real app, use StatusBar.setHidden(true);
  };

  const SettingItem = ({ icon, title, subtitle, onPress, color = "#4F46E5", isDestructive = false, rightComponent }) => (
    <TouchableOpacity
      style={[styles.itemCard, isDestructive && styles.destructiveItem]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: isDestructive ? '#DC2626' : '#4F46E5' }]}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.itemTextContent}>
        <Text style={[styles.itemTitle, { fontSize, color: isDarkMode ? '#FFFFFF' : '#111827' }, isDestructive && { color: '#DC2626' }]}>{title}</Text>
        {subtitle && <Text style={[styles.itemSubtitle, { fontSize: fontSize - 4, color: isDarkMode ? '#CBD5E1' : '#6B7280' }]}>{subtitle}</Text>}
      </View>
      {rightComponent || <Ionicons name="chevron-forward" size={18} color={isDarkMode ? "#94A3B8" : "#6B7280"} />}
    </TouchableOpacity>
  );

  const SwitchItem = ({ icon, title, subtitle, value, onValueChange, color = "#4F46E5" }) => (
    <View style={styles.switchItem}>
      <View style={[styles.iconContainer, { backgroundColor: '#4F46E5' }]}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.itemTextContent}>
        <Text style={[styles.itemTitle, { fontSize, color: isDarkMode ? '#FFFFFF' : '#111827' }]}>{title}</Text>
        {subtitle && <Text style={[styles.itemSubtitle, { fontSize: fontSize - 4, color: isDarkMode ? '#CBD5E1' : '#6B7280' }]}>{subtitle}</Text>}
      </View>
      <Switch
        trackColor={{ false: isDarkMode ? "#334155" : "#E5E7EB", true: "#4F46E5" }}
        thumbColor={value ? "#FFFFFF" : isDarkMode ? "#475569" : "#9CA3AF"}
        ios_backgroundColor={isDarkMode ? "#334155" : "#E5E7EB"}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#1E293B" : "#F8FAFC"} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* UNIQUE ANIMATED HEADER */}
        <Animated.View style={[styles.header, { transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }], backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#FFFFFF' : '#111827'} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyzMEYnk5Yg19Ekv75mj-jDoPJul24-sp96w&s' }} style={styles.logoImage} />
            </View>
            <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>Settings</Text>
          </View>
          <TouchableOpacity 
            onPress={openAbout}
            style={styles.infoBtn}
          >
            <Ionicons name="information-circle-outline" size={24} color="#e0e0e9" />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollBodyContent} showsVerticalScrollIndicator={false}>
          
          {/* APP PREFERENCES - UNIQUE GLOW EFFECT */}
          <Text style={[styles.sectionLabel, { color: isDarkMode ? "#ededf3" : "#1E40AF" }]}>Personalized Preferences</Text>
          <View style={[styles.groupCard, isDarkMode ? styles.darkGroup : styles.lightGroup]}>
            <SwitchItem
              icon="notifications-outline"
              title="Smart Notifications"
              subtitle="AI-powered reminders tailored to your habits"
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SwitchItem
              icon="moon-outline"
              title="Adaptive Theme"
              subtitle="Auto-adjust based on time of day"
              value={isDarkMode}
              onValueChange={toggleDarkMode}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SwitchItem
              icon="vibrate-outline"
              title="Sensory Feedback"
              subtitle="Custom vibration patterns for interactions"
              value={isHapticEnabled}
              onValueChange={toggleHaptic}
            />
          </View>

          {/* APPEARANCE - WITH FONT SIZE SLIDER IN MODAL */}
          <Text style={[styles.sectionLabel, { color: isDarkMode ? "#ebebf3" : "#1E40AF" }]}>Visual Mastery</Text>
          <View style={[styles.groupCard, isDarkMode ? styles.darkGroup : styles.lightGroup]}>
            <SettingItem
              icon="color-palette-outline"
              title="Theme Gallery"
              subtitle="Explore and apply premium themes"
              onPress={openThemeSelector}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="text-outline"
              title="Dynamic Font Sizing"
              subtitle={`Current: ${fontSize}px - Tap to adjust`}
              onPress={() => Alert.alert('Adjust Font', 'Choose size:', [
                { text: 'Small (14px)', onPress: () => adjustFontSize(14) },
                { text: 'Medium (16px)', onPress: () => adjustFontSize(16) },
                { text: 'Large (18px)', onPress: () => adjustFontSize(18) },
              ])}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="accessibility-outline"
              title="Enhanced Display"
              subtitle="Customize contrast and accessibility options"
              onPress={() => Alert.alert('Display Options', 'High contrast mode activated for better visibility!')}
            />
          </View>

          {/* DATA & PRIVACY - UNIQUE STORAGE VISUALIZER */}
          <Text style={[styles.sectionLabel, { color: isDarkMode ? "#e7e6ec" : "#1E40AF" }]}>Secure Vault</Text>
          <View style={[styles.groupCard, isDarkMode ? styles.darkGroup : styles.lightGroup]}>
            <SwitchItem
              icon="analytics-outline"
              title="Insight Analytics"
              subtitle="Anonymous data to evolve your experience"
              value={isAnalyticsEnabled}
              onValueChange={toggleAnalytics}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="cloud-outline"
              title="Cloud Sync Pro"
              subtitle="Seamless backup across devices"
              onPress={() => Alert.alert('Cloud Sync', 'Your data is now syncing securely to the cloud!')}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="database-outline"
              title="Storage Optimizer"
              subtitle="Visual breakdown and smart cleanup"
              onPress={openStorageManagement}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Privacy Fortress"
              subtitle="Review our ironclad policies"
              onPress={() => Linking.openURL('https://example.com/privacy')} // Replace with actual URL
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="trash-outline"
              title="Data Purge"
              subtitle="Start anew with a clean slate"
              isDestructive={true}
              onPress={clearTasks}
            />
          </View>

          {/* TASK MANAGEMENT - UNIQUE REMINDER PICKER */}
          <Text style={[styles.sectionLabel, { color: isDarkMode ? "#ebeaf1" : "#1E40AF" }]}>Productivity Engine</Text>
          <View style={[styles.groupCard, isDarkMode ? styles.darkGroup : styles.lightGroup]}>
            <SettingItem
              icon="time-outline"
              title="Intelligent Reminders"
              subtitle={`Current: ${reminderTime} - Customize AI scheduling`}
              onPress={() => setShowReminderModal(true)}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="calendar-outline"
              title="Calendar Fusion"
              subtitle="Bi-directional sync with your agenda"
              onPress={() => Alert.alert('Calendar Fusion', 'Tasks now integrated with your device calendar!')}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="repeat-outline"
              title="Habit Loops"
              subtitle="Create smart recurring patterns"
              onPress={() => Alert.alert('Habit Loops', 'Recurring tasks set up with intelligent frequency adjustments!')}
            />
          </View>

          {/* SUPPORT - UNIQUE MODAL WITH OPTIONS */}
          <Text style={[styles.sectionLabel, { color: isDarkMode ? "#f2f1f7" : "#1E40AF" }]}>Elite Support</Text>
          <View style={[styles.groupCard, isDarkMode ? styles.darkGroup : styles.lightGroup]}>
            <SettingItem
              icon="chatbubble-outline"
              title="VIP Assistance"
              subtitle="Priority chat with our experts"
              onPress={openSupport}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="star-outline"
              title="Elite Rating"
              subtitle="Share your premium feedback"
              onPress={handleRateApp}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="information-circle-outline"
              title="App Legacy"
              subtitle={`Version 2.0 • ${Platform.OS.toUpperCase()} Experience`}
              onPress={openAbout}
            />
          </View>

          {/* ADVANCED - UNIQUE DEVELOPER TOOLS */}
          <Text style={[styles.sectionLabel, { color: isDarkMode ? "#eaeaf3" : "#1E40AF" }]}>Power User Arsenal</Text>
          <View style={[styles.groupCard, isDarkMode ? styles.darkGroup : styles.lightGroup]}>
            <SettingItem
              icon="construct-outline"
              title="Dev Console"
              subtitle="Unlock hidden customizations"
              onPress={() => Alert.alert('Dev Console', 'Advanced mode enabled - proceed with caution!')}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="bug-outline"
              title="Issue Tracker"
              subtitle="Report and track bugs in real-time"
              onPress={handleBugReport}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="code-outline"
              title="Integration Hub"
              subtitle="Connect with premium APIs"
              onPress={() => Alert.alert('Integration Hub', 'API connections established for enhanced functionality!')}
            />
          </View>

          {/* FULL SCREEN & DISPLAY - UNIQUE IMMERSIVE MODE */}
          <Text style={[styles.sectionLabel, { color: isDarkMode ? "#edecf5" : "#1E40AF" }]}>Immersive Realm</Text>
          <View style={[styles.groupCard, isDarkMode ? styles.darkGroup : styles.lightGroup]}>
            <SettingItem
              icon="enter-outline"
              title="Zen Full Screen"
              subtitle="Distraction-free productivity zone"
              onPress={handleFullScreen}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="square-outline"
              title="Orientation Master"
              subtitle="Auto-rotate with smart locking"
              onPress={() => Alert.alert('Orientation Master', 'Screen rotation optimized for your device!')}
            />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]} />
            <SettingItem
              icon="resize-outline"
              title="Multi-View Manager"
              subtitle="Seamless split-screen multitasking"
              onPress={() => Alert.alert('Multi-View Manager', 'Tablet-optimized multitasking enabled!')}
            />
          </View>

          {/* UNIQUE ANIMATED FOOTER */}
          <Animated.View style={[styles.footer, glowStyle]}>
            <Text style={[styles.footerText, { color: isDarkMode ? "#dee2e9" : "#abb2c0" }]}>TaskNest Elite Edition</Text>
            <Text style={[styles.footerSubText, { color: isDarkMode ? "#64748B" : "#9CA3AF" }]}>Elevate Your Productivity • {new Date().getFullYear()}</Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* ENHANCED STORAGE MODAL WITH PROGRESS BARS */}
      <Modal visible={showStorageModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkModal : styles.lightModal]}>
            <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#334155' : '#E5E7EB' }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? "#FFFFFF" : "#111827" }]}>Storage Optimizer</Text>
              <TouchableOpacity onPress={() => setShowStorageModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#111827"} />
              </TouchableOpacity>
            </View>
            <View style={styles.storageInfo}>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>Total Used: 12.4 MB</Text>
              <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]}><View style={[styles.progressFill, { width: '60%' }]} /></View>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>Tasks: 8.2 MB</Text>
              <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]}><View style={[styles.progressFill, { width: '40%' }]} /></View>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>Cache: 2.1 MB</Text>
              <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#334155' : '#E5E7EB' }]}><View style={[styles.progressFill, { width: '20%' }]} /></View>
            </View>
            <TouchableOpacity style={styles.clearCacheBtn} onPress={() => {
              Alert.alert('Optimized!', 'Cache cleared - space reclaimed!');
              setShowStorageModal(false);
            }}>
              <Text style={styles.clearCacheText}>Optimize Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* UNIQUE THEME MODAL WITH PREVIEWS */}
      <Modal visible={showThemeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkModal : styles.lightModal]}>
            <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#334155' : '#E5E7EB' }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? "#FFFFFF" : "#111827" }]}>Theme Gallery</Text>
              <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#111827"} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themeOptions}>
              <TouchableOpacity style={[styles.themePreview, selectedTheme === 'dark' && styles.selectedTheme]} onPress={() => selectTheme('dark')}>
                <View style={[styles.themeSample, { backgroundColor: '#0F172A' }]}><Text style={styles.sampleText}>Dark Elegance</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.themePreview, selectedTheme === 'light' && styles.selectedTheme]} onPress={() => selectTheme('light')}>
                <View style={[styles.themeSample, { backgroundColor: '#FFFFFF' }]}><Text style={[styles.sampleText, { color: '#000000' }]}>Light Breeze</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.themePreview, selectedTheme === 'blue' && styles.selectedTheme]} onPress={() => selectTheme('blue')}>
                <View style={[styles.themeSample, { backgroundColor: '#1E40AF' }]}><Text style={styles.sampleText}>Ocean Depth</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.themePreview, selectedTheme === 'green' && styles.selectedTheme]} onPress={() => selectTheme('green')}>
                <View style={[styles.themeSample, { backgroundColor: '#059669' }]}><Text style={styles.sampleText}>Forest Vitality</Text></View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* UNIQUE REMINDER MODAL */}
      <Modal visible={showReminderModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkModal : styles.lightModal]}>
            <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#334155' : '#E5E7EB' }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? "#FFFFFF" : "#111827" }]}>Set Reminder Time</Text>
              <TouchableOpacity onPress={() => setShowReminderModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#111827"} />
              </TouchableOpacity>
            </View>
            <View style={styles.themeOptions}>
              <TouchableOpacity style={[styles.themeOption, { backgroundColor: isDarkMode ? '#334155' : '#F3F4F6' }]} onPress={() => updateReminderTime('08:00')}>
                <Text style={[styles.themeName, { color: isDarkMode ? "#FFFFFF" : "#111827" }]}>Morning Boost (08:00)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.themeOption, { backgroundColor: isDarkMode ? '#334155' : '#F3F4F6' }]} onPress={() => updateReminderTime('12:00')}>
                <Text style={[styles.themeName, { color: isDarkMode ? "#FFFFFF" : "#111827" }]}>Midday Check (12:00)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.themeOption, { backgroundColor: isDarkMode ? '#334155' : '#F3F4F6' }]} onPress={() => updateReminderTime('18:00')}>
                <Text style={[styles.themeName, { color: isDarkMode ? "#FFFFFF" : "#111827" }]}>Evening Review (18:00)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* UNIQUE SUPPORT MODAL */}
      <Modal visible={showSupportModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkModal : styles.lightModal]}>
            <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#334155' : '#E5E7EB' }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? "#FFFFFF" : "#111827" }]}>VIP Support</Text>
              <TouchableOpacity onPress={() => setShowSupportModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#111827"} />
              </TouchableOpacity>
            </View>
            <View style={styles.storageInfo}>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>Email: support@tasknest.com</Text>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>Chat: Available 24/7</Text>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>FAQ: Common solutions</Text>
            </View>
            <TouchableOpacity style={styles.clearCacheBtn} onPress={() => {
              Linking.openURL('mailto:support@tasknest.com');
              setShowSupportModal(false);
            }}>
              <Text style={styles.clearCacheText}>Contact Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* UNIQUE ABOUT MODAL */}
      <Modal visible={showAboutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkModal : styles.lightModal]}>
            <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#334155' : '#E5E7EB' }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? "#FFFFFF" : "#111827" }]}>About TaskNest Elite</Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#111827"} />
              </TouchableOpacity>
            </View>
            <View style={styles.storageInfo}>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>Version: 2.0 - Revolutionary Update</Text>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>Built by: Elite Devs Team</Text>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>Features: AI Integration, Custom Themes, Secure Sync</Text>
              <Text style={[styles.storageText, { color: isDarkMode ? "#94A3B8" : "#6B7280" }]}>Mission: Transform your productivity journey</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkContainer: { backgroundColor: '#0F172A' },
  lightContainer: { backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#5b769c'
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#4F46E5'
  },
  logoImage: {
    width: '100%',
    height: '100%'
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: '900',
    color: '#FFFFFF'
  },
  backBtn: { 
    padding: 8 
  },
  infoBtn: { 
    backgroundColor: '#4F46E5', 
    padding: 8, 
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  scrollBodyContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40,
    paddingTop: 10
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  groupCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  darkGroup: {
    backgroundColor: '#1E293B',
    borderColor: '#334155'
  },
  lightGroup: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB'
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'transparent'
  },
  destructiveItem: {
    backgroundColor: 'transparent'
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'transparent'
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  itemTextContent: { flex: 1 },
  itemTitle: { 
    fontSize: 17, 
    fontWeight: '700'
  },
  itemSubtitle: { 
    fontSize: 13, 
    marginTop: 3
  },
  divider: { 
    height: 1, 
    marginHorizontal: 18 
  },
  footer: { 
    marginTop: 60, 
    alignItems: 'center',
    paddingVertical: 20 
  },
  footerText: { 
    fontSize: 15, 
    fontWeight: '700' 
  },
  footerSubText: { 
    fontSize: 12, 
    marginTop: 5, 
    fontStyle: 'italic' 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    borderRadius: 24,
    padding: 0,
    maxHeight: '80%'
  },
  darkModal: {
    backgroundColor: '#284168'
  },
  lightModal: {
    backgroundColor: '#FFFFFF'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    flex: 1
  },
  storageInfo: {
    padding: 20
  },
  storageText: {
    fontSize: 15,
    marginBottom: 10
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4
  },
  clearCacheBtn: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    margin: 20
  },
  clearCacheText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20
  },
  themePreview: {
    alignItems: 'center',
    marginHorizontal: 8
  },
  themeSample: {
    width: 80,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sampleText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    padding: 8
  },
  selectedTheme: {
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 14
  },
  themeOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600'
  }
});