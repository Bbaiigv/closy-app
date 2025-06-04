import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function DiscoverStyleScreen() {
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../assets/fonts/Castio-Regular.ttf'),
  });

  // Valores animados
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Animación de entrada
    opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
    
    // Animación de escala continua (efecto de respiración)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, // infinito
      false
    );
  }, [opacity, scale, translateY]);

  // Estilos animados
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  const handleStartDiscover = () => {
    router.push('/questionnaire-block1');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#4D6F62" />
      
      {/* Texto principal */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Descubre el estilo que te hace única</Text>
      </View>

      {/* Imagen central animada */}
      <View style={styles.imageContainer}>
        <Animated.View style={animatedImageStyle}>
          <Image 
            source={require('../assets/images/Images/Descubre-estilo.jpg')} 
            style={styles.discoverImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Botón comenzar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartDiscover}>
          <Text style={styles.startButtonText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D6F62',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 32,
    fontFamily: 'Castio-Regular',
    color: '#FCF6F3',
    textAlign: 'center',
    lineHeight: 38,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  discoverImage: {
    width: width * 0.85,
    height: height * 0.5,
    borderRadius: 20,
  },
  buttonContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#FAA6B5',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 6,
    minWidth: 200,
  },
  startButtonText: {
    color: '#FCF6F3',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'System',
  },
}); 