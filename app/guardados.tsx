import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

type TabType = 'guardados' | 'wishlist' | 'armario';

export default function GuardadosScreen() {
  const router = useRouter();
  const { selectionMode, selectedDate } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('guardados');
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // Determinar si estamos en modo selección
  const isSelectionMode = selectionMode === 'true';

  // Array de looks disponibles para guardados
  const guardadosLooks = [
    { id: 1, image: require('../assets/images/Carpeta_guardados/look1.png') },
    { id: 2, image: require('../assets/images/Carpeta_guardados/look2.png') },
    { id: 3, image: require('../assets/images/Carpeta_guardados/look3.png') },
    { id: 4, image: require('../assets/images/Carpeta_guardados/look4.png') },
    { id: 5, image: require('../assets/images/Carpeta_guardados/look5.png') },
    { id: 6, image: require('../assets/images/Carpeta_guardados/look6.png') },
    { id: 7, image: require('../assets/images/Carpeta_guardados/look7.png') },
    { id: 8, image: require('../assets/images/Carpeta_guardados/look8.png') },
    { id: 9, image: require('../assets/images/Carpeta_guardados/look9.png') },
  ];

  // Array de looks para wishlist (usando diferentes imágenes)
  const wishlistLooks = [
    { id: 1, image: require('../assets/images/Carpeta_guardados/look2.png') },
    { id: 2, image: require('../assets/images/Carpeta_guardados/look4.png') },
    { id: 3, image: require('../assets/images/Carpeta_guardados/look6.png') },
    { id: 4, image: require('../assets/images/Carpeta_guardados/look8.png') },
  ];

  // Array de looks para armario (usando diferentes imágenes)
  const armarioLooks = [
    { id: 1, image: require('../assets/images/Carpeta_guardados/look1.png') },
    { id: 2, image: require('../assets/images/Carpeta_guardados/look3.png') },
    { id: 3, image: require('../assets/images/Carpeta_guardados/look5.png') },
    { id: 4, image: require('../assets/images/Carpeta_guardados/look7.png') },
    { id: 5, image: require('../assets/images/Carpeta_guardados/look9.png') },
  ];

  const getCurrentLooks = () => {
    switch (activeTab) {
      case 'guardados':
        return guardadosLooks;
      case 'wishlist':
        return wishlistLooks;
      case 'armario':
        return armarioLooks;
      default:
        return guardadosLooks;
    }
  };

  const getTabTitle = () => {
    if (isSelectionMode) {
      return 'Seleccionar Look';
    }
    switch (activeTab) {
      case 'guardados':
        return 'Guardados';
      case 'wishlist':
        return 'Wishlist';
      case 'armario':
        return 'Armario';
      default:
        return 'Guardados';
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleLookPress = (lookId: number) => {
    if (isSelectionMode && selectedDate) {
      // Encontrar el look seleccionado
      const allLooks = [...guardadosLooks, ...wishlistLooks, ...armarioLooks];
      const selectedLook = allLooks.find(look => look.id === lookId);
      
      if (selectedLook) {
        // Navegar de vuelta al calendario con los datos del look seleccionado
        router.push({
          pathname: '/(tabs)/calendar',
          params: {
            selectedLookId: lookId.toString(),
            selectedLookImage: selectedLook.image,
            targetDate: selectedDate
          }
        });
      }
    } else {
      console.log(`Look ${lookId} presionado en ${activeTab}`);
    }
  };

  // Componente para renderizar cada look
  const LookCard = ({ look }: { look: { id: number; image: any } }) => (
    <TouchableOpacity 
      style={[
        styles.lookCard,
        isSelectionMode && styles.selectableLookCard
      ]} 
      onPress={() => handleLookPress(look.id)}
      activeOpacity={0.8}
    >
      <Image 
        source={look.image} 
        style={styles.lookImage} 
        resizeMode="cover"
      />
      {isSelectionMode && (
        <View style={styles.selectionOverlay}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={24} 
            color="#4CAF50" 
          />
        </View>
      )}
    </TouchableOpacity>
  );

  // Componente para renderizar los tabs
  const TabButton = ({ 
    title, 
    tabKey, 
    isActive, 
    onPress 
  }: { 
    title: string; 
    tabKey: TabType; 
    isActive: boolean; 
    onPress: () => void;
  }) => (
    <TouchableOpacity 
      style={[styles.tabButton, isActive && styles.activeTabButton]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFF5F2" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
        
        <Text style={styles.title}>{getTabTitle()}</Text>
        
        <View style={styles.spacer} />
      </View>

      {/* Indicador de modo selección */}
      {isSelectionMode && (
        <View style={styles.selectionModeIndicator}>
          <MaterialCommunityIcons 
            name="information" 
            size={16} 
            color="#4CAF50" 
          />
          <Text style={styles.selectionModeText}>
            Selecciona un look para el {selectedDate}
          </Text>
        </View>
      )}

      {/* Tabs - solo mostrar si no estamos en modo selección */}
      {!isSelectionMode && (
        <>
          <View style={styles.tabsContainer}>
            <TabButton 
              title="Guardados" 
              tabKey="guardados" 
              isActive={activeTab === 'guardados'} 
              onPress={() => setActiveTab('guardados')}
            />
            <TabButton 
              title="Wishlist" 
              tabKey="wishlist" 
              isActive={activeTab === 'wishlist'} 
              onPress={() => setActiveTab('wishlist')}
            />
            <TabButton 
              title="Armario" 
              tabKey="armario" 
              isActive={activeTab === 'armario'} 
              onPress={() => setActiveTab('armario')}
            />
          </View>

          {/* Botón activo destacado */}
          <View style={styles.activeIndicatorContainer}>
            <TouchableOpacity style={styles.activeIndicator}>
              <Text style={styles.activeIndicatorText}>Comidas</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Grid de looks */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {getCurrentLooks().map((look, index) => {
            if (index % 2 === 0) {
              const nextLook = getCurrentLooks()[index + 1];
              return (
                <View key={`row-${index}`} style={styles.row}>
                  <LookCard look={look} />
                  {nextLook && <LookCard look={nextLook} />}
                </View>
              );
            }
            return null;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFF5F2',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Castio-Regular',
    textAlign: 'center',
    flex: 1,
  },
  spacer: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF5F2',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Castio-Regular',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  activeIndicatorContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFF5F2',
  },
  activeIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: '#7A9B8A',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeIndicatorText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Castio-Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  grid: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  lookCard: {
    width: cardWidth,
    height: cardWidth * 1.4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lookImage: {
    width: '100%',
    height: '100%',
  },
  selectionModeIndicator: {
    padding: 10,
    backgroundColor: '#FFF5F2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionModeText: {
    color: '#4CAF50',
    fontSize: 14,
    fontFamily: 'Castio-Regular',
    marginLeft: 5,
  },
  selectableLookCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
}); 