import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  StatusBar, 
  Dimensions,
  Easing,
  Image,
  ImageBackground
} from 'react-native';

const { width, height } = Dimensions.get('window');

// High-end assets
const BG_IMAGE = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop';
const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyzMEYnk5Yg19Ekv75mj-jDoPJul24-sp96w&s';

export default function SplashScreen({ navigation }) {
  // --- ANIMATION VALUES ---
  const masterFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const progressLine = useRef(new Animated.Value(0)).current;
  const bgMove = useRef(new Animated.Value(0)).current;
  
  // Particle system (12 dots)
  const particles = useRef([...Array(12)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // 1. Entrance Animation
    Animated.parallel([
      Animated.timing(masterFade, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 20, friction: 7, useNativeDriver: true }),
      Animated.timing(progressLine, { toValue: 1, duration: 3500, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    ]).start();

    // 2. Loop Background Motion
    Animated.loop(
      Animated.timing(bgMove, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // 3. Loop Particle "Twinkle & Float"
    particles.forEach((p, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.timing(p, { toValue: 1, duration: 2000 + (i * 100), useNativeDriver: true }),
          Animated.timing(p, { toValue: 0, duration: 2000 + (i * 100), useNativeDriver: true }),
        ])
      ).start();
    });

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // Background Drifting
  const bgTranslateX = bgMove.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* MOVING BACKGROUND */}
      <Animated.View style={[styles.bgWrapper, { transform: [{ translateX: bgTranslateX }] }]}>
        <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bgImage}>
          <View style={styles.overlay} />
        </ImageBackground>
      </Animated.View>

      {/* FLOATING PARTICLES */}
      {particles.map((p, i) => (
        <Animated.View 
          key={i}
          style={[
            styles.dot,
            {
              top: Math.random() * height,
              left: Math.random() * width,
              opacity: p,
              transform: [{ scale: p }]
            }
          ]}
        />
      ))}

      <Animated.View style={[styles.content, { opacity: masterFade }]}>
        
        {/* CIRCULAR LOGO CONTAINER */}
        <Animated.View style={[styles.logoCircle, { transform: [{ scale: logoScale }] }]}>
          <View style={styles.innerCircle}>
             <Image source={{ uri: LOGO_URL }} style={styles.logoImage} />
          </View>
          <View style={styles.haloEffect} />
        </Animated.View>

        <Text style={styles.brandText}>TASK<Text style={styles.accent}>NEST</Text></Text>
        
        {/* PROGRESS SECTION */}
        <View style={styles.loaderContainer}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { transform: [{ scaleX: progressLine }, { translateX: -70 }] }]} />
          </View>
          <Text style={styles.statusText}>OPTIMIZING NEST RESOURCES...</Text>
        </View>

      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.legal}>V 2.0.1 • POWERED BY AI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgWrapper: {
    ...StyleSheet.absoluteFillObject,
    width: width + 50, // Extra width for sliding motion
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#818CF8',
    borderRadius: 2,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  innerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFF',
    overflow: 'hidden', // Forces the logo into a circle
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
  },
  logoImage: {
    width: 110,
    height: 110,
    resizeMode: 'cover',
  },
  haloEffect: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  brandText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 4,
  },
  accent: {
    color: '#6366F1',
  },
  loaderContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  track: {
    width: 140,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    width: 140,
    height: '100%',
    backgroundColor: '#6366F1',
  },
  statusText: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 15,
    letterSpacing: 2,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  legal: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 10,
    letterSpacing: 1,
  }
});