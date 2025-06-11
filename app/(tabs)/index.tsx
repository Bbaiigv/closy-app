import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { useAppContext, getBlockProgress, getStyleScoresSummary } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { 
  categorizeStylesByPreference, 
  getScoreStatistics,
  generateNextBlockRecommendations 
} from '@/utils/styleScoring';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image } from 'react-native';

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

  const styleCategories = categorizeStylesByPreference(state.styleScores);
  const statistics = getScoreStatistics(state.styleScores);
  const recommendations = generateNextBlockRecommendations(state.styleScores);

  const blockProgress = getBlockProgress(state);
  const stylesSummary = getStyleScoresSummary(state.styleScores);

  const navigateToBlock = (blockNumber: number) => {
    switch (blockNumber) {
      case 1:
        router.push('./questionnaire-block1');
        break;
      case 2:
        if (blockProgress.block1Complete) {
          router.push('./questionnaire-block2');
        } else {
          alert('Completa el Bloque 1 primero');
        }
        break;
      case 3:
        if (blockProgress.block1Complete && blockProgress.block2Complete) {
          router.push('./questionnaire-block3');
        } else {
          alert('Completa los bloques anteriores primero');
        }
        break;
    }
  };

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
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
      <View style={styles.header}>
          <Text style={styles.title}>Tu Perfil de Estilo</Text>
          <Text style={styles.subtitle}>Descubre tu estilo personal</Text>
      </View>

        {/* Progreso de Cuestionarios */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>📊 Progreso de Cuestionarios</Text>
          
          <View style={styles.progressContainer}>
            {/* Bloque 1 */}
            <TouchableOpacity 
              style={[
                styles.blockCard,
                blockProgress.block1Complete && styles.blockCardComplete
              ]}
              onPress={() => navigateToBlock(1)}
            >
              <View style={styles.blockHeader}>
                <Text style={styles.blockNumber}>1</Text>
                <View style={[
                  styles.blockStatus,
                  { backgroundColor: blockProgress.block1Complete ? '#4CAF50' : '#FFC107' }
                ]}>
                  <Text style={styles.blockStatusText}>
                    {blockProgress.block1Complete ? '✓' : '○'}
                  </Text>
                </View>
              </View>
              <Text style={styles.blockTitle}>Evaluación de Estilos</Text>
              <Text style={styles.blockDescription}>
                {blockProgress.block1Complete 
                  ? `${stylesSummary.totalStyles} estilos evaluados`
                  : 'Evalúa diferentes estilos'}
              </Text>
            </TouchableOpacity>

            {/* Bloque 2 */}
            <TouchableOpacity 
              style={[
                styles.blockCard,
                blockProgress.block2Complete && styles.blockCardComplete,
                !blockProgress.block1Complete && styles.blockCardDisabled
              ]}
              onPress={() => navigateToBlock(2)}
              disabled={!blockProgress.block1Complete}
            >
              <View style={styles.blockHeader}>
                <Text style={[
                  styles.blockNumber,
                  !blockProgress.block1Complete && styles.blockNumberDisabled
                ]}>2</Text>
                <View style={[
                  styles.blockStatus,
                  { backgroundColor: blockProgress.block2Complete ? '#4CAF50' : blockProgress.block1Complete ? '#FFC107' : '#CCC' }
                ]}>
                  <Text style={styles.blockStatusText}>
                    {blockProgress.block2Complete ? '✓' : blockProgress.block1Complete ? '○' : '×'}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.blockTitle,
                !blockProgress.block1Complete && styles.blockTitleDisabled
              ]}>Outfits por Ocasión</Text>
              <Text style={[
                styles.blockDescription,
                !blockProgress.block1Complete && styles.blockDescriptionDisabled
              ]}>
                {blockProgress.block2Complete 
                  ? 'Outfits seleccionados'
                  : 'Elige outfits para diferentes ocasiones'}
              </Text>
            </TouchableOpacity>

            {/* Bloque 3 */}
            <TouchableOpacity 
              style={[
                styles.blockCard,
                blockProgress.block3Complete && styles.blockCardComplete,
                (!blockProgress.block1Complete || !blockProgress.block2Complete) && styles.blockCardDisabled
              ]}
              onPress={() => navigateToBlock(3)}
              disabled={!blockProgress.block1Complete || !blockProgress.block2Complete}
            >
              <View style={styles.blockHeader}>
                <Text style={[
                  styles.blockNumber,
                  (!blockProgress.block1Complete || !blockProgress.block2Complete) && styles.blockNumberDisabled
                ]}>3</Text>
                <View style={[
                  styles.blockStatus,
                  { backgroundColor: blockProgress.block3Complete ? '#4CAF50' : 
                    (blockProgress.block1Complete && blockProgress.block2Complete) ? '#FFC107' : '#CCC' }
                ]}>
                  <Text style={styles.blockStatusText}>
                    {blockProgress.block3Complete ? '✓' : 
                     (blockProgress.block1Complete && blockProgress.block2Complete) ? '○' : '×'}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.blockTitle,
                (!blockProgress.block1Complete || !blockProgress.block2Complete) && styles.blockTitleDisabled
              ]}>Marcas y Preferencias</Text>
              <Text style={[
                styles.blockDescription,
                (!blockProgress.block1Complete || !blockProgress.block2Complete) && styles.blockDescriptionDisabled
              ]}>
                {blockProgress.block3Complete 
                  ? 'Perfil completo'
                  : 'Selecciona marcas y prioridades'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Progreso general */}
          <View style={styles.overallProgress}>
            <Text style={styles.overallProgressText}>
              Progreso Total: {(blockProgress.block1Complete ? 1 : 0) + 
                              (blockProgress.block2Complete ? 1 : 0) + 
                              (blockProgress.block3Complete ? 1 : 0)}/3 bloques completados
            </Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressBarFill,
                { width: `${((blockProgress.block1Complete ? 1 : 0) + 
                            (blockProgress.block2Complete ? 1 : 0) + 
                            (blockProgress.block3Complete ? 1 : 0)) * 33.33}%` }
              ]} />
            </View>
          </View>
        </View>

        {/* Resumen de Puntuaciones */}
        {blockProgress.block1Complete && (
          <View style={styles.scoresSection}>
            <Text style={styles.sectionTitle}>⭐ Resumen de Puntuaciones</Text>
            
            <View style={styles.scoresSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Estilos Evaluados</Text>
                <Text style={styles.summaryValue}>{stylesSummary.totalStyles}</Text>
          </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Puntuación Promedio</Text>
                <Text style={styles.summaryValue}>{stylesSummary.averageScore} pts</Text>
          </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Estilos Favoritos</Text>
                <Text style={styles.summaryValue}>{stylesSummary.topStylesCount}</Text>
              </View>
            </View>

            {/* DEBUG: Acumulación de Puntos por Estilo */}
            <View style={[styles.categoryContainer, { backgroundColor: '#f8f9fa', marginTop: 20 }]}>
              <Text style={[styles.categoryTitle, { color: '#dc3545' }]}>🔧 DEBUG - Acumulación de Puntos (Top 4)</Text>
              {state.styleScores.slice(0, 4).map((style, index) => {
                // Separar respuestas por bloque - nombres ya son consistentes
                const block1Responses = state.questionnaireResponses.filter(r => 
                  r.styleName === style.styleName && r.questionId < 2000
                );
                const block2Responses = state.questionnaireResponses.filter(r => 
                  r.styleName === style.styleName && r.questionId >= 2000 && r.questionId < 30000
                );
                const block3Responses = state.questionnaireResponses.filter(r => 
                  r.styleName === style.styleName && r.questionId >= 30000
                );
                
                const block1Score = block1Responses.reduce((sum, r) => sum + r.response, 0);
                const block2Score = block2Responses.reduce((sum, r) => sum + r.response, 0);
                const block3Score = block3Responses.reduce((sum, r) => sum + r.response, 0);
                const block1Count = block1Responses.length;
                const block2Count = block2Responses.length;
                const block3Count = block3Responses.length;
                
                return (
                  <View key={style.styleName} style={{ marginBottom: 15, padding: 10, backgroundColor: '#fff', borderRadius: 8 }}>
                    <Text style={[styles.styleItem, { fontWeight: '600', marginBottom: 8 }]}>
                      {index + 1}. {style.styleName} - {style.averageScore} pts ⭐
                    </Text>
                    
                    <Text style={[styles.moreText, { marginBottom: 4 }]}>
                      📝 Bloque 1: {block1Score} pts ({block1Count} respuestas)
                    </Text>
                    
                    {block2Count > 0 && (
                      <Text style={[styles.moreText, { marginBottom: 4 }]}>
                        🎯 Bloque 2: {block2Score} pts ({block2Count} selecciones)
                      </Text>
                    )}
                    
                    {block3Count > 0 && (
                      <Text style={[styles.moreText, { marginBottom: 4 }]}>
                        🏷️ Bloque 3: {block3Score} pts ({block3Count} elementos)
                      </Text>
                    )}
                    
                    <Text style={[styles.moreText, { fontWeight: '600', color: '#28a745' }]}>
                      💯 Total: {style.totalScore} pts ({style.responseCount} respuestas)
                    </Text>
                    
                    {/* Lista de respuestas individuales para debugging */}
                    <Text style={[styles.moreText, { fontSize: 10, color: '#6c757d', marginTop: 4 }]}>
                      Respuestas: {[...block1Responses, ...block2Responses, ...block3Responses].map(r => `${r.response}pts`).join(', ')}
                    </Text>
                    
                    {/* Barra visual simple - proporcional al máximo posible */}
                    <View style={{ marginTop: 5, height: 6, backgroundColor: '#e9ecef', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ 
                        height: '100%', 
                        backgroundColor: style.averageScore >= 8 ? '#28a745' : style.averageScore >= 5 ? '#ffc107' : '#6c757d',
                        width: `${Math.min((style.averageScore / 15) * 100, 100)}%` // Máximo estimado de 15 puntos
                      }} />
                    </View>
                  </View>
                );
              })}
              
              <Text style={[styles.moreText, { fontStyle: 'italic', textAlign: 'center', marginTop: 10 }]}>
                * Esta sección es temporal para desarrollo - se quitará en producción
              </Text>
            </View>

            {/* Top 3 estilos */}
            {stylesSummary.topStyles.length > 0 && (
              <View style={styles.topStyles}>
                <Text style={styles.topStylesTitle}>Tus Estilos Favoritos:</Text>
                {stylesSummary.topStyles.map((style, index) => (
                  <View key={style.styleName} style={styles.topStyleItem}>
                    <Text style={styles.topStyleRank}>{index + 1}.</Text>
                    <Text style={styles.topStyleName}>{style.styleName}</Text>
                    <Text style={styles.topStyleScore}>{style.averageScore} pts ⭐</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

        {/* Llamada a la acción */}
        {!blockProgress.overallProgress && (
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>
              {blockProgress.currentBlock === 1 ? 'Comienza tu perfil de estilo' :
               blockProgress.currentBlock === 2 ? 'Continúa con outfits por ocasión' :
               'Completa tu perfil con marcas'}
            </Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigateToBlock(blockProgress.currentBlock)}
            >
              <Text style={styles.ctaButtonText}>
                {blockProgress.currentBlock === 1 ? 'Comenzar Bloque 1' :
                 blockProgress.currentBlock === 2 ? 'Ir al Bloque 2' :
                 'Ir al Bloque 3'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Perfil completo */}
        {blockProgress.overallProgress && (
          <View style={styles.completeSection}>
            <Text style={styles.completeTitle}>¡Perfil Completo! 🎉</Text>
            <Text style={styles.completeDescription}>
              Has completado todos los cuestionarios. Tu perfil de estilo personalizado está listo.
              </Text>
            </View>
          )}
      </ScrollView>
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
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
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
  title: {
    fontSize: 28,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
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
  progressSection: {
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  blockCard: {
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
  blockCardComplete: {
    borderColor: '#4CAF50',
  },
  blockCardDisabled: {
    borderColor: '#CCC',
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  blockNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A142C',
  },
  blockNumberDisabled: {
    color: '#CCC',
  },
  blockStatus: {
    padding: 4,
    borderRadius: 15,
    marginLeft: 8,
  },
  blockStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A142C',
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A142C',
    marginBottom: 4,
  },
  blockTitleDisabled: {
    color: '#CCC',
  },
  blockDescription: {
    fontSize: 12,
    color: '#4D6F62',
    textAlign: 'center',
  },
  blockDescriptionDisabled: {
    color: '#CCC',
  },
  overallProgress: {
    marginTop: 20,
    alignItems: 'center',
  },
  overallProgressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A142C',
    marginBottom: 8,
  },
  progressBar: {
    width: '80%',
    height: 20,
    backgroundColor: '#CCC',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  scoresSection: {
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
  scoresSummary: {
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A142C',
  },
  summaryValue: {
    fontSize: 14,
    color: '#4D6F62',
  },
  topStyles: {
    marginTop: 20,
  },
  topStylesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A142C',
    marginBottom: 8,
  },
  topStyleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  topStyleRank: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A142C',
    marginRight: 8,
  },
  topStyleName: {
    fontSize: 14,
    color: '#333',
  },
  topStyleScore: {
    fontSize: 12,
    color: '#4D6F62',
  },
  ctaSection: {
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
  ctaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A142C',
    marginBottom: 8,
  },
  ctaButton: {
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
  ctaButtonText: {
    color: '#FCF6F3',
    fontSize: 18,
    fontWeight: '600',
  },
  completeSection: {
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
  completeTitle: {
    fontSize: 22,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    textAlign: 'center',
    marginBottom: 10,
  },
  completeDescription: {
    fontSize: 16,
    color: '#4D6F62',
    textAlign: 'center',
    marginBottom: 20,
  },
});
