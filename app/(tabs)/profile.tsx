import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useAppContext } from '@/contexts/AppContext';
import CustomTabBar from '@/components/dashboard/CustomTabBar';

export default function ProfileScreen() {
  const { state } = useAppContext();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const displayName = state.user?.name || 'Usuario';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons 
              name="account-circle" 
              size={80} 
              color="#7A142C" 
            />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.subtitle}>Tu perfil de estilo personalizado</Text>
        </View>

        {/* Estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{state.styleScores.length}</Text>
            <Text style={styles.statLabel}>Estilos Evaluados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {state.styleScores.filter(s => s.averageScore >= 4).length}
            </Text>
            <Text style={styles.statLabel}>Estilos Favoritos</Text>
          </View>
        </View>

        {/* Contenido temporal */}
        <View style={styles.comingSoon}>
          <MaterialCommunityIcons 
            name="account-settings" 
            size={60} 
            color="#FAA6B5" 
          />
          <Text style={styles.comingSoonTitle}>¡Próximamente!</Text>
          <Text style={styles.comingSoonMessage}>
            Configuración de perfil, historial de actividad y mucho más
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
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    marginTop: 20,
    marginBottom: 15,
  },
  comingSoonMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 