import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { useAlert } from '@/hooks/useAlert';
import { getFilteredTopStyles } from '@/utils/styleScoring';

interface OutfitQuestion {
  id: number;
  question: string;
  occasion: string;
}

interface TopStyle {
  styleName: string;
  imagePath: any;
  averageScore: number;
}

const { width, height } = Dimensions.get('window');

// Mapeo de estilos e imágenes por ocasión del SegundoCuestionario
const secondQuestionnaireImages = {
  // Día a día
  dia_a_dia: {
    basica: require('../assets/images/SegundoCuestionario/dia_a_dia_basica.png'),
    boho: require('../assets/images/SegundoCuestionario/dia_a_dia_boho.png'),
    cayetanaMenos20: require('../assets/images/SegundoCuestionario/dia_a_dia_caye-20.png'),
    cayetanaMas20: require('../assets/images/SegundoCuestionario/dia_a_dia_caye20.png'),
    formalClasica: require('../assets/images/SegundoCuestionario/dia_a_dia_formal.png'),
    modernaTrendy: require('../assets/images/SegundoCuestionario/dia_a_dia_trendy.png'),
    pija: require('../assets/images/SegundoCuestionario/dia_a_dia_pija.png'),
    sexy: require('../assets/images/SegundoCuestionario/dia_a_dia_sexy.png'),
    st: require('../assets/images/SegundoCuestionario/dia_a_dia_st.png'),
  },
  // Formal
  formal: {
    basica: require('../assets/images/SegundoCuestionario/formal_basica.png'),
    boho: require('../assets/images/SegundoCuestionario/formal_boho.png'),
    cayetanaMenos20: require('../assets/images/SegundoCuestionario/formal_caye-20.png'),
    cayetanaMas20: require('../assets/images/SegundoCuestionario/formal_caye20.png'),
    formalClasica: require('../assets/images/SegundoCuestionario/formal_formal.png'),
    modernaTrendy: require('../assets/images/SegundoCuestionario/formal_trendy.png'),
    pija: require('../assets/images/SegundoCuestionario/formal_pija.png'),
    sexy: require('../assets/images/SegundoCuestionario/formal_sexy.png'),
    st: require('../assets/images/SegundoCuestionario/formal_st.png'),
  },
  // Fiesta
  fiesta: {
    basica: require('../assets/images/SegundoCuestionario/fiesta_basica.png'),
    boho: require('../assets/images/SegundoCuestionario/fiesta_boho.png'),
    cayetanaMenos20: require('../assets/images/SegundoCuestionario/fiesta_caye-20.png'),
    cayetanaMas20: require('../assets/images/SegundoCuestionario/fiesta_caye20.png'),
    formalClasica: require('../assets/images/SegundoCuestionario/fiesta_formal.png'),
    modernaTrendy: require('../assets/images/SegundoCuestionario/fiesta_trendy.png'),
    pija: require('../assets/images/SegundoCuestionario/fiesta_pija.png'),
    sexy: require('../assets/images/SegundoCuestionario/fiesta_sexy.png'),
    st: require('../assets/images/SegundoCuestionario/fiesta_st.png'),
  }
};

// Mapeo de nombres de estilo a imágenes según la ocasión
const getImageForStyle = (styleName: string, occasion: string): any => {
  // Mapear ocasiones a las claves del objeto
  const occasionMap: { [key: string]: string } = {
    'día a día': 'dia_a_dia',
    'evento formal': 'formal',
    'salir de fiesta': 'fiesta'
  };

  const occasionKey = occasionMap[occasion] || 'dia_a_dia';
  const occasionImages = secondQuestionnaireImages[occasionKey as keyof typeof secondQuestionnaireImages];

  const styleMap: { [key: string]: any } = {
    'Básica': occasionImages.basica,
    'Boho': occasionImages.boho,
    'Cayetana -20': occasionImages.cayetanaMenos20,
    'Cayetana +20': occasionImages.cayetanaMas20,
    'Formal Clásica': occasionImages.formalClasica,
    'Moderna Trendy': occasionImages.modernaTrendy,
    'Pija': occasionImages.pija,
    'Sexy': occasionImages.sexy,
    'ST': occasionImages.st,
  };
  return styleMap[styleName] || occasionImages.basica;
};

// Preguntas fijas para el bloque 2
const outfitQuestions: OutfitQuestion[] = [
  {
    id: 1,
    question: '¿Cuál de estos outfits te pondrías para el día a día?',
    occasion: 'día a día'
  },
  {
    id: 2,
    question: '¿Cuál de estos outfits te pondrías para un evento formal?',
    occasion: 'evento formal'
  },
  {
    id: 3,
    question: '¿Cuál de estos outfits te pondrías para salir de fiesta?',
    occasion: 'salir de fiesta'
  }
];

export default function QuestionnaireBlock2Screen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { showAlert } = useAlert();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../assets/fonts/Castio-Regular.ttf'),
  });

  const [topStyles, setTopStyles] = useState<TopStyle[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedStyleIndexes, setSelectedStyleIndexes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener los 4 mejores estilos del bloque anterior
    const getTopStyles = () => {
      const filteredStyles = getFilteredTopStyles(state.styleScores, {
        minScore: 2.5, // Reducimos un poco el mínimo para asegurar que tengamos 4 estilos
        maxResults: 4
      });

      if (filteredStyles.length < 3) {
        showAlert(
          'Bloque anterior incompleto',
          'Necesitas completar el primer bloque con al menos 3 estilos bien valorados antes de continuar.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      // Si hay menos de 4 estilos, completar con los mejores disponibles
      let stylesData = [...filteredStyles];

      // Si necesitamos más estilos para llegar a 4, añadir de los disponibles
      if (stylesData.length < 4) {
        const allStyles = state.styleScores
          .filter(style => !filteredStyles.some(fs => fs.styleName === style.styleName))
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, 4 - stylesData.length);

        stylesData = [...stylesData, ...allStyles];
      }

      setTopStyles(stylesData.map(style => ({
        styleName: style.styleName,
        imagePath: null, // Se asignará dinámicamente
        averageScore: style.averageScore
      })));
      setIsLoading(false);
    };

    getTopStyles();
  }, [state.styleScores]);

  const currentQuestion = outfitQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === outfitQuestions.length - 1;

  const handleStyleSelect = (styleIndex: number): void => {
    setSelectedStyleIndexes(prevSelected => {
      const isAlreadySelected = prevSelected.includes(styleIndex);
      
      if (isAlreadySelected) {
        // Deseleccionar: quitar del array
        return prevSelected.filter(index => index !== styleIndex);
      } else {
        // Seleccionar: agregar si no hemos llegado al límite de 3
        if (prevSelected.length < 3) {
          return [...prevSelected, styleIndex].sort();
        }
        return prevSelected; // No agregar si ya hay 3 seleccionados
      }
    });
  };

  const handleNext = (): void => {
    if (selectedStyleIndexes.length === 0) {
      showAlert('Selecciona al menos un outfit', 'Por favor, elige al menos un outfit antes de continuar.');
      return;
    }

    // Guardar múltiples respuestas en el contexto global
    selectedStyleIndexes.forEach((styleIndex, position) => {
      const selectedStyle = topStyles[styleIndex];
      
      dispatch({
        type: 'ADD_QUESTIONNAIRE_RESPONSE',
        payload: {
          questionId: currentQuestion.id * 1000 + styleIndex + 2000, // ID único para cada selección
          response: position + 1, // Orden de preferencia (1-3)
          styleName: `${selectedStyle.styleName} (${currentQuestion.occasion})`,
        },
      });
    });

    if (isLastQuestion) {
      showAlert(
        'Bloque 2 Completado',
        '¡Excelente! Has completado la selección de outfits por ocasión. ¿Quieres continuar con la selección de marcas?',
        [
          {
            text: 'Ir a marcas',
            onPress: () => {
              router.push('./questionnaire-block3');
            },
          },
          {
            text: 'Ver perfil',
            onPress: () => {
              router.push('/(tabs)');
            },
          },
        ]
      );
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedStyleIndexes([]);
    }
  };

  const handleBack = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedStyleIndexes([]);
    } else {
      router.back();
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Preparando tu selección de outfits...</Text>
      </View>
    );
  }

  if (topStyles.length < 3) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>
          No hay suficientes estilos evaluados. Completa el bloque anterior.
        </Text>
        <TouchableOpacity style={styles.backToHomeButton} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.backToHomeButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      {/* Header con progreso */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} de {outfitQuestions.length}
        </Text>
        
        <Text style={styles.blockLabel}>Bloque 2</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Pregunta */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          <Text style={styles.occasionText}>Ocasión: {currentQuestion.occasion}</Text>
          
          {/* Contador de selecciones */}
          <View style={styles.selectionCounter}>
            <Text style={styles.counterText}>
              {selectedStyleIndexes.length}/3 outfits seleccionados
            </Text>
            {selectedStyleIndexes.length > 0 && (
              <Text style={styles.counterSubtext}>
                {3 - selectedStyleIndexes.length > 0 
                  ? `Puedes seleccionar ${3 - selectedStyleIndexes.length} más` 
                  : 'Máximo alcanzado'}
              </Text>
            )}
          </View>
        </View>

        {/* Grid de imágenes de estilos */}
        <View style={styles.stylesGrid}>
          {topStyles.map((style, index) => (
            <TouchableOpacity
              key={`${style.styleName}-${index}`}
              style={[
                styles.styleCard,
                selectedStyleIndexes.includes(index) && styles.styleCardSelected,
                selectedStyleIndexes.length >= 3 && !selectedStyleIndexes.includes(index) && styles.styleCardDisabled
              ]}
              onPress={() => handleStyleSelect(index)}
              disabled={selectedStyleIndexes.length >= 3 && !selectedStyleIndexes.includes(index)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={getImageForStyle(style.styleName, currentQuestion.occasion)}
                  style={styles.styleImage}
                  resizeMode="cover"
                />
                {selectedStyleIndexes.includes(index) && (
                  <View style={styles.selectedOverlay}>
                    <Text style={styles.selectedText}>✓</Text>
                    <Text style={styles.selectionOrder}>
                      {selectedStyleIndexes.indexOf(index) + 1}
                    </Text>
                  </View>
                )}
                {selectedStyleIndexes.length >= 3 && !selectedStyleIndexes.includes(index) && (
                  <View style={styles.disabledOverlay} />
                )}
              </View>
              <View style={styles.styleInfo}>
                <Text style={styles.styleName}>{style.styleName}</Text>
                <Text style={styles.styleScore}>
                  {style.averageScore}/5 ⭐
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Instrucciones */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Selecciona entre 1 y 3 outfits que te gusten para esta ocasión
          </Text>
          <Text style={styles.instructionsSubtext}>
            Toca una imagen para seleccionar/deseleccionar
          </Text>
        </View>
      </ScrollView>

      {/* Botón siguiente */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.nextButton, selectedStyleIndexes.length === 0 && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={selectedStyleIndexes.length === 0}
        >
          <Text style={[styles.nextButtonText, selectedStyleIndexes.length === 0 && styles.nextButtonTextDisabled]}>
            {isLastQuestion ? 'Finalizar Bloque 2' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#7A142C',
    fontFamily: 'System',
  },
  progressText: {
    fontSize: 16,
    color: '#7A142C',
    fontFamily: 'System',
    fontWeight: '600',
  },
  blockLabel: {
    fontSize: 14,
    color: '#4D6F62',
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  questionText: {
    fontSize: 22,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  occasionText: {
    fontSize: 16,
    fontFamily: 'System',
    color: '#4D6F62',
    fontStyle: 'italic',
  },
  stylesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 15,
  },
  styleCard: {
    width: (width - 55) / 2, // 2 columns with spacing
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  styleCardSelected: {
    borderColor: '#7A142C',
    shadowOpacity: 0.2,
    elevation: 6,
  },
  styleCardDisabled: {
    borderColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    height: height * 0.25,
  },
  styleImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(122, 20, 44, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  selectionOrder: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  styleInfo: {
    paddingTop: 10,
    alignItems: 'center',
  },
  styleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A142C',
    textAlign: 'center',
    marginBottom: 4,
  },
  styleScore: {
    fontSize: 12,
    color: '#4D6F62',
  },
  instructionsContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FAA6B5',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  instructionsSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#4D6F62',
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
  nextButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#FCF6F3',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
  loadingText: {
    fontSize: 18,
    color: '#7A142C',
    fontFamily: 'Castio-Regular',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backToHomeButton: {
    backgroundColor: '#4D6F62',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  backToHomeButtonText: {
    color: '#FCF6F3',
    fontSize: 16,
    fontWeight: '600',
  },
  selectionCounter: {
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  counterText: {
    fontSize: 16,
    color: '#7A142C',
    fontWeight: '600',
    marginBottom: 4,
  },
  counterSubtext: {
    fontSize: 12,
    color: '#4D6F62',
    fontStyle: 'italic',
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(204, 204, 204, 0.5)',
  },
}); 