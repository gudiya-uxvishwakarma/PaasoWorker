import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Text,
} from 'react-native';
import COLORS from '../constants/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const circleScale1 = useRef(new Animated.Value(0)).current;
  const circleScale2 = useRef(new Animated.Value(0)).current;
  const circleScale3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 8,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]),
      // Pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ),
    ]).start();

    // Expanding circles animation
    Animated.stagger(200, [
      Animated.loop(
        Animated.timing(circleScale1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        })
      ),
      Animated.loop(
        Animated.timing(circleScale2, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        })
      ),
      Animated.loop(
        Animated.timing(circleScale3, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        })
      ),
    ]).start();

    // Text fade in
    setTimeout(() => {
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    }, 400);

    // Progress bar animation - 3 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    }).start();

    // Navigate to main app after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const rotate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const circle1Opacity = circleScale1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  const circle2Opacity = circleScale2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0],
  });

  const circle3Opacity = circleScale3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0],
  });

  return (
    <View style={styles.container}>
      {/* Animated background circles */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: circleScale1 }],
            opacity: circle1Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          {
            transform: [{ scale: circleScale2 }],
            opacity: circle2Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle3,
          {
            transform: [{ scale: circleScale3 }],
            opacity: circle3Opacity,
          },
        ]}
      />

      {/* Logo container with glow effect */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: fadeAnim,
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }, { rotate }],
          },
        ]}
      >
        <View style={styles.glowContainer}>
          <View style={styles.glow} />
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
      </Animated.View>

      {/* App name */}
      <Animated.View style={[styles.textContainer, { opacity: textFadeAnim }]}>
        <Text style={styles.appName}>Paaso</Text>
        <Text style={styles.tagline}>Find Work, Build Future</Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>
        <Animated.Text style={[styles.loadingText, { opacity: textFadeAnim }]}>
          Loading your workspace...
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: COLORS.secondary,
  },
  circle2: {
    backgroundColor: COLORS.accent,
  },
  circle3: {
    backgroundColor: COLORS.secondaryLight,
  },
  logoWrapper: {
    marginBottom: 40,
  },
  glowContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: COLORS.secondary,
    opacity: 0.12,
  },
  logoContainer: {
    width: width * 0.45,
    height: width * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: width * 0.225,
    padding: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 80,
  },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.white,
    marginTop: 8,
    letterSpacing: 1,
    opacity: 0.85,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.12,
    width: width * 0.7,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 13,
    color: COLORS.white,
    fontWeight: '500',
    opacity: 0.75,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
