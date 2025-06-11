import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { useAppContext } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

interface PersonalizedHeaderProps {
  userName?: string;
}

export default function PersonalizedHeader({ userName }: PersonalizedHeaderProps) {
  const { state } = useAppContext();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const displayName = userName || state.user?.name || 'Rose';

  return (
    <View style={styles.container}>
      {/* Logo Closy */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoSymbol}>C</Text>
        </View>
        <Text style={styles.logoText}>Closy</Text>
      </View>

      {/* Saludo personalizado */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hola, soy {displayName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FCF6F3',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7A142C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FCF6F3',
    fontFamily: 'Castio-Regular',
  },
  logoText: {
    fontSize: 28,
    fontFamily: 'Castio-Regular',
    color: '#FAA6B5',
  },
  greetingContainer: {
    alignItems: 'flex-start',
  },
  greetingText: {
    fontSize: 32,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    fontWeight: '600',
  },
}); 