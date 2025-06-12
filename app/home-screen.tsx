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

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const functionalities = [
    { 
      id: 'inspirarte',
      title: 'Inspirarte', 
      image: require('../assets/images/pagina_home/h-inspirarte.png'),
      onPress: () => Alert.alert('¡Próximamente!', 'Funcionalidad de inspiración en desarrollo')
    },
    { 
      id: 'comprar',
      title: 'Comprar', 
      image: require('../assets/images/pagina_home/h-comprar.png'),
      onPress: () => Alert.alert('¡Próximamente!', 'Funcionalidad de compras en desarrollo')
    },
    { 
      id: 'asesorarte',
      title: 'Asesorarte', 
      image: require('../assets/images/pagina_home/h-asesorarte.png'),
      onPress: () => Alert.alert('¡Próximamente!', 'Funcionalidad de asesoramiento en desarrollo')
    },
    { 
      id: 'combinar',
      title: 'Combinar', 
      image: require('../assets/images/pagina_home/h-combinar.png'),
      onPress: () => Alert.alert('¡Próximamente!', 'Funcionalidad de combinaciones en desarrollo')
    },
    { 
      id: 'planificar',
      title: 'Planificar', 
      image: require('../assets/images/pagina_home/h-planificar.png'),
      onPress: () => router.push('/(tabs)/favorites')
    },
    { 
      id: 'armario',
      title: 'Armario', 
      image: require('../assets/images/pagina_home/h-armario.png'),
      onPress: () => router.push('/(tabs)/explore')
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      Alert.alert('Mensaje enviado', `Rose ha recibido tu mensaje: "${message}"`);
      setMessage('');
    }
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
        <Image source={image} style={styles.functionalityImage} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.greeting}>Hola, soy Rose</Text>
        </View>

        {/* Bloque de Chat con Rose */}
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
              <Text style={styles.chatQuestion}>¿Con qué puedo ayudarte hoy?</Text>
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
                size={20} 
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F3',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  greeting: {
    fontSize: 24,
    fontFamily: 'Castio-Regular',
    color: '#333',
    fontWeight: '600',
  },
  chatContainer: {
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    marginBottom: 40,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7A9B8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatQuestion: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Castio-Regular',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  sendButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FAA6B5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  functionalitiesContainer: {
    paddingHorizontal: 20,
  },
  functionalitiesTitle: {
    fontSize: 28,
    fontFamily: 'Castio-Regular',
    color: '#333',
    fontWeight: '600',
    marginBottom: 20,
  },
  functionalitiesGrid: {
    gap: 15,
  },
  functionalitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  functionalityCard: {
    flex: 1,
    backgroundColor: '#FAA6B5',
    borderRadius: 20,
    height: 180,
    overflow: 'hidden',
    position: 'relative',
  },
  cardTitleContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Castio-Regular',
    color: 'white',
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  functionalityImage: {
    width: '100%',
    height: '100%',
  },
}); 