import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { state } = useAppContext();
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const getTopStyles = () => {
    return state.questionnaireResponses
      .filter(response => response.response >= 4) // Solo respuestas de 4 o 5
      .sort((a, b) => b.response - a.response)
      .slice(0, 3);
  };

  const topStyles = getTopStyles();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          ¡Hola {state.user?.name || 'Hermosa'}! 🌸
        </Text>
        <Text style={styles.subtitleText}>Tu estilo único te está esperando</Text>
      </View>

      {state.isOnboardingCompleted && topStyles.length > 0 ? (
        <View style={styles.styleSection}>
          <Text style={styles.sectionTitle}>Tus estilos favoritos</Text>
          {topStyles.map((style) => (
            <View key={style.questionId} style={styles.styleCard}>
              <Text style={styles.styleName}>{style.styleName}</Text>
              <Text style={styles.styleRating}>
                {'❤️'.repeat(style.response)}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noDataSection}>
          <Text style={styles.noDataText}>
            ¡Completa tu cuestionario para descubrir tu estilo único!
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/discover-style')}
          >
            <Text style={styles.ctaButtonText}>Comenzar cuestionario</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Explorar nuevos looks</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Mi guardarropa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F3',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  styleSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    marginBottom: 15,
    textAlign: 'center',
  },
  styleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#FAA6B5',
    borderRadius: 10,
  },
  styleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  styleRating: {
    fontSize: 18,
  },
  noDataSection: {
    margin: 20,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
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
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: '#FAA6B5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsSection: {
    margin: 20,
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#4D6F62',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
