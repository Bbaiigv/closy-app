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

      {/* Título */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    height: 160,
    marginHorizontal: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 6,
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Castio-Regular',
    color: '#333',
    fontWeight: '600',
  },
}); 