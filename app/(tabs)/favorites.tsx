import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import CustomTabBar from '@/components/dashboard/CustomTabBar';

export default function CalendarScreen() {
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Planifica tus outfits y eventos</Text>
        </View>

        {/* Contenido temporal */}
        <View style={styles.emptyState}>
          <MaterialCommunityIcons 
            name="calendar-outline" 
            size={80} 
            color="#FAA6B5" 
          />
          <Text style={styles.emptyTitle}>¡Próximamente!</Text>
          <Text style={styles.emptyMessage}>
            Aquí podrás planificar tus outfits según eventos y fechas especiales
          </Text>
        </View>
      </ScrollView>
      
      {/* Footer personalizado */}
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F3',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Espacio para el tab bar
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    marginTop: 20,
    marginBottom: 15,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 