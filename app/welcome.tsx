import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../assets/fonts/Castio-Regular.ttf'),
  });

  const handleRegister = () => {
    // Navegar a la página de registro
    router.push('/register');
  };

  const handleLogin = () => {
    // Navegar a la página de login
    router.push('/login');
  };

  if (!fontsLoaded) {
    return null; // O un loading spinner
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      {/* Texto Closy */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Closy</Text>
      </View>

      {/* Header con logo */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/Images/Logo_beige.png')} 
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      {/* Imagen central del collage */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/images/Images/Collage_inicio.png')} 
          style={styles.collageImage}
          resizeMode="contain"
        />
      </View>

      {/* Botones de registro e ingreso */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]} 
          onPress={handleRegister}
        >
          <Text style={[styles.buttonText, styles.registerButtonText]}>Registrate</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.loginButton]} 
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, styles.loginButtonText]}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F3',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  titleText: {
    fontSize: 36,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLogo: {
    width: 100,
    height: 50,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  collageImage: {
    width: width * 0.95,
    height: height * 0.55,
    borderRadius: 20,
  },
  buttonsContainer: {
    paddingBottom: 30,
    gap: 15,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 25,
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
  registerButton: {
    backgroundColor: '#FAA6B5',
  },
  loginButton: {
    backgroundColor: '#4D6F62',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Castio-Regular',
  },
  registerButtonText: {
    color: '#FFFFFF',
  },
  loginButtonText: {
    color: '#FFFFFF',
  },
}); 