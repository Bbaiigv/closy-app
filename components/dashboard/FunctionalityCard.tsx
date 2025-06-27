import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

interface FunctionalityCardProps {
  title: string;
  iconName: string;
  backgroundColor: string;
  onPress: () => void;
  children?: React.ReactNode;
}

export default function FunctionalityCard({ 
  title, 
  iconName, 
  backgroundColor, 
  onPress,
  children 
}: FunctionalityCardProps) {
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Título en esquina superior derecha */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Contenido personalizado (imagen/placeholder) */}
      <View style={styles.contentArea}>
        {children || (
          <View style={styles.placeholderContent}>
            <MaterialCommunityIcons 
              name={iconName as any} 
              size={40} 
              color="rgba(255,255,255,0.8)" 
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    height: 160,
    marginHorizontal: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Castio-Regular',
    color: 'white',
    fontWeight: 'bold',
  },
}); 