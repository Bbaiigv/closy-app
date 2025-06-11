import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import CustomTabBar from '@/components/dashboard/CustomTabBar';

export default function ArmarioScreen() {
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="hanger" 
            size={48} 
            color="#7A142C"
          />
          <Text style={styles.headerTitle}>Mi Armario</Text>
          <Text style={styles.headerSubtitle}>
            Organiza y gestiona tu colección de ropa
          </Text>
        </View>

        {/* Contenido temporal */}
        <View style={styles.contentContainer}>
          <View style={styles.placeholderCard}>
            <MaterialCommunityIcons 
              name="hanger" 
              size={80} 
              color="rgba(122, 20, 44, 0.6)"
            />
            <Text style={styles.placeholderTitle}>
              Próximamente
            </Text>
            <Text style={styles.placeholderText}>
              Aquí podrás gestionar toda tu ropa, crear outfits y organizar tu armario digital
            </Text>
          </View>
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
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  placeholderCard: {
    backgroundColor: 'rgba(250, 166, 181, 0.1)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(122, 20, 44, 0.1)',
    borderStyle: 'dashed',
  },
  placeholderTitle: {
    fontSize: 24,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    marginTop: 20,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 