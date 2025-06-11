import React from 'react';
import { StyleSheet, ScrollView, View, Text, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useAppContext, getBlockProgress } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import PersonalizedHeader from '@/components/dashboard/PersonalizedHeader';
import ChatAssistant from '@/components/dashboard/ChatAssistant';
import FunctionalityCard from '@/components/dashboard/FunctionalityCard';
import CustomTabBar from '@/components/dashboard/CustomTabBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { state } = useAppContext();
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const blockProgress = getBlockProgress(state);
  const allBlocksComplete = blockProgress.block1Complete && blockProgress.block2Complete && blockProgress.block3Complete;

  // Funciones para las tarjetas de funcionalidad
  const handleInspirarte = () => {
    if (!allBlocksComplete) {
      Alert.alert(
        'Completa tu perfil',
        'Termina todos los cuestionarios para obtener recomendaciones personalizadas',
        [{ text: 'OK', onPress: () => router.push('./questionnaire-block1') }]
      );
      return;
    }
    Alert.alert('¡Próximamente!', 'Esta funcionalidad estará disponible pronto');
  };

  const handleComprar = () => {
    if (!allBlocksComplete) {
      Alert.alert(
        'Completa tu perfil',
        'Termina todos los cuestionarios para ver productos personalizados',
        [{ text: 'OK', onPress: () => router.push('./questionnaire-block1') }]
      );
      return;
    }
    Alert.alert('¡Próximamente!', 'Esta funcionalidad estará disponible pronto');
  };

  const handleAsesorarte = () => {
    if (!allBlocksComplete) {
      Alert.alert(
        'Completa tu perfil',
        'Termina todos los cuestionarios para obtener asesoramiento personalizado',
        [{ text: 'OK', onPress: () => router.push('./questionnaire-block1') }]
      );
      return;
    }
    Alert.alert('¡Próximamente!', 'Esta funcionalidad estará disponible pronto');
  };

  const handleCombinar = () => {
    if (!allBlocksComplete) {
      Alert.alert(
        'Completa tu perfil',
        'Termina todos los cuestionarios para combinar outfits personalizados',
        [{ text: 'OK', onPress: () => router.push('./questionnaire-block1') }]
      );
      return;
    }
    Alert.alert('¡Próximamente!', 'Esta funcionalidad estará disponible pronto');
  };

  // Contenido placeholder para las tarjetas (se reemplazará con imágenes)
  const PlaceholderContent = ({ iconName, color }: { iconName: string; color: string }) => (
    <View style={styles.placeholderContainer}>
      <MaterialCommunityIcons 
        name={iconName as any} 
        size={50} 
        color={color} 
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header personalizado */}
        <PersonalizedHeader />

        {/* Chat Assistant */}
        <ChatAssistant />

        {/* Título de funcionalidades */}
        <View style={styles.functionalitiesHeader}>
          <Text style={styles.functionalitiesTitle}>Funcionalidades</Text>
        </View>

        {/* Grid de funcionalidades 2x2 */}
        <View style={styles.functionalitiesGrid}>
          {/* Primera fila */}
          <View style={styles.functionalitiesRow}>
            <FunctionalityCard
              title="Inspirarte"
              iconName="lightbulb-outline"
              backgroundColor="#FAA6B5"
              onPress={handleInspirarte}
            >
              <PlaceholderContent iconName="lightbulb-outline" color="rgba(255,255,255,0.8)" />
            </FunctionalityCard>

            <FunctionalityCard
              title="Comprar"
              iconName="shopping"
              backgroundColor="#FAA6B5"
              onPress={handleComprar}
            >
              <PlaceholderContent iconName="shopping" color="rgba(255,255,255,0.8)" />
            </FunctionalityCard>
          </View>

          {/* Segunda fila */}
          <View style={styles.functionalitiesRow}>
            <FunctionalityCard
              title="Asesorarte"
              iconName="account-tie"
              backgroundColor="#FAA6B5"
              onPress={handleAsesorarte}
            >
              <PlaceholderContent iconName="account-tie" color="rgba(255,255,255,0.8)" />
            </FunctionalityCard>

            <FunctionalityCard
              title="Combinar"
              iconName="palette"
              backgroundColor="#FAA6B5"
              onPress={handleCombinar}
            >
              <PlaceholderContent iconName="palette" color="rgba(255,255,255,0.8)" />
            </FunctionalityCard>
          </View>
        </View>

        {/* Indicador de progreso si no ha completado todo */}
        {!allBlocksComplete && (
          <View style={styles.progressIndicator}>
            <MaterialCommunityIcons 
              name="information" 
              size={24} 
              color="#7A142C" 
            />
            <Text style={styles.progressText}>
              ¡Completa todos los cuestionarios para desbloquear todas las funcionalidades!
            </Text>
          </View>
        )}
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
  functionalitiesHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  functionalitiesTitle: {
    fontSize: 28,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    fontWeight: '600',
  },
  functionalitiesGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  functionalitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressIndicator: {
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
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
  progressText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
}); 