import React from 'react';
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
const cardWidth = (width - 60) / 2; // 60 = 20 (margin left) + 20 (margin right) + 20 (gap between cards)

export default function CarpetaDetalleScreen() {
  const router = useRouter();
  const { carpeta } = useLocalSearchParams();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // Obtener el nombre de la carpeta, por defecto "Carpeta"
  const nombreCarpeta = Array.isArray(carpeta) ? carpeta[0] : carpeta || 'Carpeta';

  // Contenido específico según la carpeta
  const getOutfitsForCarpeta = (nombre: string) => {
    switch (nombre.toLowerCase()) {
      case 'comidas':
        return [
          { id: 1, image: require('../assets/images/Carpeta_guardados/look1.png') },
          { id: 2, image: require('../assets/images/Carpeta_guardados/look2.png') },
          { id: 3, image: require('../assets/images/Carpeta_guardados/look3.png') },
          { id: 4, image: require('../assets/images/Carpeta_guardados/look4.png') },
          { id: 5, image: require('../assets/images/Carpeta_guardados/look5.png') },
          { id: 6, image: require('../assets/images/Carpeta_guardados/look6.png') },
        ];
      case 'trabajo':
        return [
          { id: 1, image: require('../assets/images/Carpeta_guardados/look7.png') },
          { id: 2, image: require('../assets/images/Carpeta_guardados/look8.png') },
          { id: 3, image: require('../assets/images/Carpeta_guardados/look9.png') },
          { id: 4, image: require('../assets/images/Carpeta_guardados/look1.png') },
          { id: 5, image: require('../assets/images/Carpeta_guardados/look2.png') },
          { id: 6, image: require('../assets/images/Carpeta_guardados/look3.png') },
        ];
      case 'salidas':
        return [
          { id: 1, image: require('../assets/images/Carpeta_guardados/look4.png') },
          { id: 2, image: require('../assets/images/Carpeta_guardados/look5.png') },
          { id: 3, image: require('../assets/images/Carpeta_guardados/look6.png') },
          { id: 4, image: require('../assets/images/Carpeta_guardados/look7.png') },
          { id: 5, image: require('../assets/images/Carpeta_guardados/look8.png') },
          { id: 6, image: require('../assets/images/Carpeta_guardados/look9.png') },
          { id: 7, image: require('../assets/images/Carpeta_guardados/look1.png') },
          { id: 8, image: require('../assets/images/Carpeta_guardados/look2.png') },
        ];
      default:
        // Para carpetas personalizadas, usar un conjunto aleatorio
        return [
          { id: 1, image: require('../assets/images/Carpeta_guardados/look1.png') },
          { id: 2, image: require('../assets/images/Carpeta_guardados/look2.png') },
          { id: 3, image: require('../assets/images/Carpeta_guardados/look3.png') },
          { id: 4, image: require('../assets/images/Carpeta_guardados/look4.png') },
        ];
    }
  };

  const outfits = getOutfitsForCarpeta(nombreCarpeta);

  const handleGoBack = () => {
    router.back();
  };

  const handleOutfitPress = (outfitId: number) => {
    console.log(`Outfit ${outfitId} presionado en carpeta ${nombreCarpeta}`);
    // Aquí puedes agregar la lógica para mostrar el detalle del outfit
  };

  // Componente para renderizar cada outfit
  const OutfitCard = ({ outfit }: { outfit: { id: number; image: any } }) => (
    <TouchableOpacity 
      style={styles.outfitCard} 
      onPress={() => handleOutfitPress(outfit.id)}
      activeOpacity={0.8}
    >
      <Image 
        source={outfit.image} 
        style={styles.outfitImage} 
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
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
            color="#363636" 
          />
        </TouchableOpacity>
        
        <Text style={styles.title}>{nombreCarpeta}</Text>
        
        {/* Espaciador para centrar el título */}
        <View style={styles.spacer} />
      </View>

      {/* Grid de outfits */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {outfits.map((outfit, index) => {
            if (index % 2 === 0) {
              const nextOutfit = outfits[index + 1];
              return (
                <View key={`row-${index}`} style={styles.row}>
                  <OutfitCard outfit={outfit} />
                  {nextOutfit && <OutfitCard outfit={nextOutfit} />}
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
    backgroundColor: '#FCF6F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FCF6F3',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(54, 54, 54, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#363636',
    fontFamily: 'Castio-Regular',
    textAlign: 'center',
    flex: 1,
  },
  spacer: {
    width: 40, // Mismo ancho que el botón de atrás para centrar perfectamente
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
  outfitCard: {
    width: cardWidth,
    height: cardWidth * 1.4, // Proporción rectangular
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
    elevation: 3, // Para Android
  },
  outfitImage: {
    width: '100%',
    height: '100%',
  },
}); 