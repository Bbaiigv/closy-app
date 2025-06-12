import React from 'react';
import { StyleSheet, ScrollView, View, Text, Alert, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useAppContext, getBlockProgress } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import PersonalizedHeader from '@/components/dashboard/PersonalizedHeader';
import ChatAssistant from '@/components/dashboard/ChatAssistant';
import FunctionalityCard from '@/components/dashboard/FunctionalityCard';
import CustomTabBar from '@/components/dashboard/CustomTabBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

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

  const handlePlanificar = () => {
    if (!allBlocksComplete) {
      Alert.alert(
        'Completa tu perfil',
        'Termina todos los cuestionarios para planificar tus outfits',
        [{ text: 'OK', onPress: () => router.push('./questionnaire-block1') }]
      );
      return;
    }
    // Navegar a la página de calendario cuando esté disponible
    router.push('./favorites');
  };

  const handleArmario = () => {
    if (!allBlocksComplete) {
      Alert.alert(
        'Completa tu perfil',
        'Termina todos los cuestionarios para acceder a tu armario personalizado',
        [{ text: 'OK', onPress: () => router.push('./questionnaire-block1') }]
      );
      return;
    }
    // Navegar a la página de armario
    router.push('./explore');
  };

  // Componente para mostrar las imágenes
  const FunctionalityImage = ({ imagePath }: { imagePath: ImageSourcePropType }) => (
    <View style={styles.imageContainer}>
      <Image 
        source={imagePath} 
        style={styles.functionalityImage}
        resizeMode="contain"
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

        {/* Grid de funcionalidades 2x3 */}
        <View style={styles.functionalitiesGrid}>
          {/* Primera fila */}
          <View style={styles.functionalitiesRow}>
            <FunctionalityCard
              title="Inspirarte"
              iconName="lightbulb-outline"
              backgroundColor="#FAA6B5"
              onPress={handleInspirarte}
            >
              <FunctionalityImage imagePath={require('../../assets/images/pagina_home/h-inspirarte.png')} />
            </FunctionalityCard>

            <FunctionalityCard
              title="Comprar"
              iconName="shopping"
              backgroundColor="#FAA6B5"
              onPress={handleComprar}
            >
              <FunctionalityImage imagePath={require('../../assets/images/pagina_home/h-comprar.png')} />
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
              <FunctionalityImage imagePath={require('../../assets/images/pagina_home/h-asesorarte.png')} />
            </FunctionalityCard>

            <FunctionalityCard
              title="Combinar"
              iconName="palette"
              backgroundColor="#FAA6B5"
              onPress={handleCombinar}
            >
              <FunctionalityImage imagePath={require('../../assets/images/pagina_home/h-combinar.png')} />
            </FunctionalityCard>
          </View>

          {/* Tercera fila */}
          <View style={styles.functionalitiesRow}>
            <FunctionalityCard
              title="Planificar"
              iconName="calendar"
              backgroundColor="#FAA6B5"
              onPress={handlePlanificar}
            >
              <FunctionalityImage imagePath={require('../../assets/images/pagina_home/h-planificar.png')} />
            </FunctionalityCard>

            <FunctionalityCard
              title="Armario"
              iconName="wardrobe"
              backgroundColor="#FAA6B5"
              onPress={handleArmario}
            >
              <FunctionalityImage imagePath={require('../../assets/images/pagina_home/h-armario.png')} />
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
    marginBottom: 15,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    padding: 8,
    minHeight: 120,
  },
  functionalityImage: {
    width: '100%',
    height: '100%',
    minHeight: 100,
    borderRadius: 12,
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