import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { 
  categorizeStylesByPreference, 
  getScoreStatistics,
  generateNextBlockRecommendations 
} from '@/utils/styleScoring';

export default function HomeScreen() {
  const { state } = useAppContext();
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const styleCategories = categorizeStylesByPreference(state.styleScores);
  const statistics = getScoreStatistics(state.styleScores);
  const recommendations = generateNextBlockRecommendations(state.styleScores);

  const renderStyleCategory = (title: string, styleList: any[], emoji: string, color: string) => {
    if (styleList.length === 0) return null;
    
    return (
      <View style={[styles.categoryContainer, { borderLeftColor: color }]}>
        <Text style={styles.categoryTitle}>{emoji} {title}</Text>
        {styleList.slice(0, 3).map((style, index) => (
          <Text key={style.styleName} style={styles.styleItem}>
            • {style.styleName} ({style.averageScore}/5 ⭐)
          </Text>
        ))}
        {styleList.length > 3 && (
          <Text style={styles.moreText}>+{styleList.length - 3} más...</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          ¡Hola {state.user?.name || 'Hermosa'}! 🌸
        </Text>
        <Text style={styles.subtitleText}>Tu estilo único te está esperando</Text>
      </View>

      {state.styleScores.length > 0 ? (
        <>
          {/* Estadísticas generales */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>📊 Tu Perfil de Estilo</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{statistics.totalStyles}</Text>
                <Text style={styles.statLabel}>Estilos evaluados</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{statistics.averageScore}</Text>
                <Text style={styles.statLabel}>Puntuación promedio</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{statistics.totalResponses}</Text>
                <Text style={styles.statLabel}>Respuestas totales</Text>
              </View>
            </View>
          </View>

          {/* Categorías de estilos */}
          <View style={styles.preferencesContainer}>
            <Text style={styles.sectionTitle}>💖 Tus Preferencias</Text>
            {renderStyleCategory('Me encanta', styleCategories.loved, '😍', '#FF6B9D')}
            {renderStyleCategory('Me gusta mucho', styleCategories.liked, '😊', '#4ECDC4')}
            {renderStyleCategory('Me gusta', styleCategories.neutral, '🙂', '#45B7D1')}
            {renderStyleCategory('No me convence', styleCategories.disliked, '😐', '#96CEB4')}
          </View>

          {/* Recomendaciones */}
          {recommendations.recommendedStyles.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.sectionTitle}>🎯 Recomendación Personal</Text>
              <Text style={styles.recommendationText}>
                {recommendations.recommendation}
              </Text>
            </View>
          )}

          {/* Marcas favoritas si las hay */}
          {state.brandResponses.length > 0 && (
            <View style={styles.brandsContainer}>
              <Text style={styles.sectionTitle}>🏷️ Tus Marcas Favoritas</Text>
              {state.brandResponses.map((brandResponse, index) => (
                <View key={brandResponse.styleId} style={styles.brandStyleGroup}>
                  <Text style={styles.brandStyleTitle}>{brandResponse.styleName}</Text>
                  <View style={styles.brandsList}>
                    {brandResponse.selectedBrands.map((brand, brandIndex) => (
                      <View key={`${brand}-${brandIndex}`} style={styles.brandTag}>
                        <Text style={styles.brandTagText}>{brand}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>¡Comienza tu viaje de estilo! ✨</Text>
          <Text style={styles.emptyText}>
            Completa el cuestionario para descubrir tu perfil de estilo único
          </Text>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.push('/questionnaire-block1')}
          >
            <Text style={styles.startButtonText}>Comenzar Cuestionario</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón para próximo bloque si está disponible */}
      {state.styleScores.length > 0 && (
        <View style={styles.actionContainer}>
          {state.brandResponses.length === 0 ? (
            <TouchableOpacity 
              style={styles.nextBlockButton}
              onPress={() => {
                // Decidir si ir al bloque 2 o 3 según lo que haya completado
                const hasBlock2Responses = state.questionnaireResponses.some(r => r.questionId > 2000);
                if (hasBlock2Responses) {
                  router.push('/questionnaire-block3' as any);
                } else {
                  router.push('/questionnaire-block2');
                }
              }}
            >
              <Text style={styles.nextBlockButtonText}>
                {state.questionnaireResponses.some(r => r.questionId > 2000) 
                  ? 'Continuar a Marcas' 
                  : 'Continuar al Siguiente Bloque'}
              </Text>
              <Text style={styles.nextBlockSubtext}>
                {state.questionnaireResponses.some(r => r.questionId > 2000)
                  ? 'Selecciona tus marcas favoritas para cada estilo'
                  : `Exploraremos ${recommendations.recommendedStyles.length} estilos seleccionados para ti`}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedContainer}>
              <Text style={styles.completedTitle}>🎉 ¡Perfil Completado!</Text>
              <Text style={styles.completedText}>
                Has completado todos los cuestionarios. Tu perfil de estilo está listo.
              </Text>
            </View>
          )}
        </View>
      )}
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
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#4D6F62',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7A142C',
    marginBottom: 15,
  },
  statsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7A142C',
  },
  statLabel: {
    fontSize: 12,
    color: '#4D6F62',
    textAlign: 'center',
    marginTop: 4,
  },
  preferencesContainer: {
    margin: 20,
    marginTop: 0,
  },
  categoryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A142C',
    marginBottom: 8,
  },
  styleItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  moreText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  recommendationsContainer: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FAA6B5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  emptyState: {
    margin: 20,
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#4D6F62',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#FAA6B5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#7A142C',
    fontSize: 16,
    fontWeight: '600',
  },
  actionContainer: {
    margin: 20,
    marginTop: 0,
  },
  nextBlockButton: {
    backgroundColor: '#4D6F62',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  nextBlockButtonText: {
    color: '#FCF6F3',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  nextBlockSubtext: {
    color: '#FCF6F3',
    fontSize: 14,
    opacity: 0.9,
    textAlign: 'center',
  },
  brandsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brandStyleGroup: {
    marginBottom: 15,
  },
  brandStyleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A142C',
    marginBottom: 8,
  },
  brandsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  brandTag: {
    backgroundColor: '#FAA6B5',
    padding: 8,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  brandTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A142C',
  },
  completedContainer: {
    margin: 20,
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedTitle: {
    fontSize: 22,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    textAlign: 'center',
    marginBottom: 10,
  },
  completedText: {
    fontSize: 16,
    color: '#4D6F62',
    textAlign: 'center',
    marginBottom: 20,
  },
});
