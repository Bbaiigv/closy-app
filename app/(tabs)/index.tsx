import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Dimensions,
  Alert,
  ImageSourcePropType
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useAppContext, getBlockProgress } from '@/contexts/AppContext';
import OnboardingDashboard from './onboarding-dashboard';
import MainDashboard from './main-dashboard';
import CustomTabBar from '@/components/dashboard/CustomTabBar';

const { width } = Dimensions.get('window');

// Componente de pantalla principal mejorada
function ImprovedHomeScreen() {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { state } = useAppContext();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
    'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const functionalities = [
    { 
      id: 'inspirarte',
      title: 'Inspirarte', 
      image: require('../../assets/images/pagina_home/h-inspirarte.png'),
      onPress: () => router.push('/guardados')
    },
    { 
      id: 'comprar',
      title: 'Comprar', 
      image: require('../../assets/images/pagina_home/h-comprar.png'),
      onPress: () => router.push('/wishlist')
    },
    { 
      id: 'asesorarte',
      title: 'Asesorarte', 
      image: require('../../assets/images/pagina_home/h-asesorarte.png'),
      onPress: () => Alert.alert('¡Próximamente!', 'Funcionalidad de asesoramiento en desarrollo')
    },
    { 
      id: 'combinar',
      title: 'Combinar', 
      image: require('../../assets/images/pagina_home/h-combinar.png'),
      onPress: () => Alert.alert('¡Próximamente!', 'Funcionalidad de combinaciones en desarrollo')
    },
    { 
      id: 'planificar',
      title: 'Planificar', 
      image: require('../../assets/images/pagina_home/h-planificar.png'),
      onPress: () => router.push('/(tabs)/calendar')
    },
    { 
      id: 'armario',
      title: 'Armario', 
      image: require('../../assets/images/pagina_home/h-armario.png'),
      onPress: () => router.push('/(tabs)/armario')
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      Alert.alert('Mensaje enviado', `Rose ha recibido tu mensaje: "${message}"`);
      setMessage('');
    }
  };

  const getPersonalizedWelcomeMessage = () => {
    return 'Encantada de conocerte, ¿quieres empezar?';
  };

  const FunctionalityCard = ({ title, image, onPress }: { 
    title: string; 
    image: ImageSourcePropType; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity style={styles.functionalityCard} onPress={onPress}>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        <Image source={image} style={styles.functionalityImage} resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header con Logo y Saludo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <MaterialCommunityIcons 
                name="circle-outline" 
                size={30} 
                color="white" 
              />
            </View>
            <Text style={styles.logoText}>Closy</Text>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hola, soy Rose</Text>
          </View>
        </View>

        {/* Bloque de Chat con Rose - Versión Mejorada */}
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons 
                name="account" 
                size={35} 
                color="white" 
              />
            </View>
            <View style={styles.chatTextContainer}>
              <Text style={styles.chatQuestion}>{getPersonalizedWelcomeMessage()}</Text>
            </View>
          </View>
          
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Mensaje"
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSendMessage}
            >
              <MaterialCommunityIcons 
                name="send" 
                size={16} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid de Funcionalidades */}
        <View style={styles.functionalitiesContainer}>
          <Text style={styles.functionalitiesTitle}>Funcionalidades</Text>
          
          <View style={styles.functionalitiesGrid}>
            {functionalities.map((item, index) => {
              if (index % 2 === 0) {
                const nextItem = functionalities[index + 1];
                return (
                  <View key={`row-${index}`} style={styles.functionalitiesRow}>
                    <FunctionalityCard
                      title={item.title}
                      image={item.image}
                      onPress={item.onPress}
                    />
                    {nextItem && (
                      <FunctionalityCard
                        title={nextItem.title}
                        image={nextItem.image}
                        onPress={nextItem.onPress}
                      />
                    )}
                  </View>
                );
              }
              return null;
            })}
          </View>
        </View>
      </ScrollView>
      
      {/* Barra de navegación inferior */}
      <CustomTabBar />
    </View>
  );
}

export default function HomeScreen() {
  const { state } = useAppContext();
  
  // 🚧 MODO DESARROLLO - Cambiar a false para volver al flujo normal de producción
  const DEVELOPMENT_MODE = true;
  
  // Si estamos en modo desarrollo, mostrar directamente ImprovedHomeScreen
  if (DEVELOPMENT_MODE) {
    console.log('🚧 MODO DESARROLLO ACTIVO - Saltando onboarding');
    return <ImprovedHomeScreen />;
  }
  
  // ✅ CÓDIGO ORIGINAL DE PRODUCCIÓN - Se mantiene intacto
  // Verificar el progreso del usuario
  const blockProgress = getBlockProgress(state);
  const allBlocksComplete = blockProgress.block1Complete && 
                          blockProgress.block2Complete && 
                          blockProgress.block3Complete;
  
  // Determinar si el usuario es nuevo o ya completó el onboarding
  const hasStartedOnboarding = blockProgress.block1Complete || 
                              state.questionnaireResponses.length > 0;
  
  // Lógica de ruteo:
  // 1. Si completó todos los bloques -> Nueva pantalla principal mejorada
  // 2. Si no ha completado pero ya empezó -> Dashboard de onboarding
  // 3. Si es completamente nuevo -> Dashboard de onboarding
  
  if (allBlocksComplete) {
    // Usuario completó todo el onboarding -> Nueva pantalla principal mejorada
    return <ImprovedHomeScreen />;
  } else {
    // Usuario en proceso de onboarding o nuevo -> Dashboard de progreso
    return <OnboardingDashboard />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F3',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Espacio para la barra de navegación
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7A142C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 36,
    fontFamily: 'Castio-Regular',
    color: '#FAA6B5',
    fontWeight: 'bold',
  },
  greetingContainer: {
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Castio-Regular',
    color: '#333',
    fontWeight: '600',
  },
  chatContainer: {
    marginHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7A9B8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatQuestion: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Helvetica',
    lineHeight: 22,
    flexWrap: 'wrap',
    fontWeight: '500',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
    fontWeight: '400',
  },
  sendButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FAA6B5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  functionalitiesContainer: {
    paddingHorizontal: 20,
  },
  functionalitiesTitle: {
    fontSize: 20,
    fontFamily: 'Castio-Regular',
    color: '#828282',
    fontWeight: '500',
    marginBottom: 16,
  },
  functionalitiesGrid: {
    gap: 16,
  },
  functionalitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  functionalityCard: {
    flex: 1,
    backgroundColor: '#ffaec5',
    borderRadius: 16,
    height: 160,
    overflow: 'hidden',
    position: 'relative',
  },
  cardTitleContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Castio-Regular',
    color: 'white',
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  functionalityImage: {
    width: '100%',
    height: '100%',
  },
}); 