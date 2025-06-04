import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/welcome');
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#FAA6B5" translucent />
      <View style={styles.splashContainer}>
        <Image 
          source={require('../assets/images/Images/Logo_beige.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAA6B5',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#FAA6B5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  logo: {
    width: Math.min(width * 0.7, 350), // Máximo 70% del ancho o 350px
    height: Math.min(height * 0.4, 280), // Máximo 40% del alto o 280px
    minWidth: 200,
    minHeight: 150,
  },
}); 