import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { useAlert } from '@/hooks/useAlert';
import { 
  getTop3StylesForBrands, 
  getBrandsForStyle, 
  validateBrandSelection 
} from '@/utils/styleScoring';

interface BrandQuestion {
  id: number;
  styleName: string;
  availableBrands: string[];
}

const { width, height } = Dimensions.get('window');

// Colores para las marcas (para hacer la UI más atractiva)
const brandColors: { [key: string]: string } = {
  'Zara': '#1e1e1e',
  'Mango': '#ff6b35',
  'H&M': '#e50000',
  'Pull & Bear': '#4a90e2',
  'Bershka': '#ff6b9d',
  'Stradivarius': '#9013fe',
  'Massimo Dutti': '#8b4513',
  'Scalpers': '#2e8b57',
  'Ralph Lauren': '#002147',
  'Sézane': '#d4af37',
  'Ese o Ese': '#ff69b4',
  'Eseoese': '#ff69b4',
  'Asos': '#000',
  'Urban Outfitter': '#2c5f2d',
  'Renatta & Go': '#ff1493',
  'Nicoli': '#8a2be2',
  'Noon': '#ffa500'
};

export default function QuestionnaireBlock3Screen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { showAlert } = useAlert();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../assets/fonts/Castio-Regular.ttf'),
  });

  const [brandQuestions, setBrandQuestions] = useState<BrandQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener los 3 mejores estilos y crear preguntas de marcas
    const generateBrandQuestions = () => {
      const top3Styles = getTop3StylesForBrands(state.questionnaireResponses);
      
      if (top3Styles.length < 2) {
        showAlert(
          'Cuestionarios previos incompletos',
          'Necesitas completar los bloques anteriores antes de continuar.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      const questions: BrandQuestion[] = top3Styles.map((style, index) => ({
        id: index + 1,
        styleName: style.styleName,
        availableBrands: getBrandsForStyle(style.styleName)
      }));

      setBrandQuestions(questions);
      setIsLoading(false);
    };

    generateBrandQuestions();
  }, [state.questionnaireResponses]);

  const currentQuestion = brandQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === brandQuestions.length - 1;

  const handleBrandToggle = (brand: string): void => {
    setSelectedBrands(prevSelected => {
      const isAlreadySelected = prevSelected.includes(brand);
      
      if (isAlreadySelected) {
        // Deseleccionar
        return prevSelected.filter(b => b !== brand);
      } else {
        // Seleccionar si no hemos llegado al límite de 3
        if (prevSelected.length < 3) {
          return [...prevSelected, brand];
        }
        return prevSelected;
      }
    });
  };

  const handleNext = (): void => {
    const validation = validateBrandSelection(selectedBrands, currentQuestion.availableBrands);
    
    if (!validation.isValid) {
      showAlert('Selección no válida', validation.message);
      return;
    }

    // Guardar la respuesta de marcas
    dispatch({
      type: 'ADD_BRAND_RESPONSE',
      payload: {
        styleId: `${currentQuestion.styleName}-${currentQuestion.id}`,
        styleName: currentQuestion.styleName,
        selectedBrands: selectedBrands,
        questionId: currentQuestion.id + 3000, // Offset para bloque 3
      },
    });

    if (isLastQuestion) {
      showAlert(
        'Cuestionario Completado',
        '¡Felicidades! Has completado todo el proceso. Tu perfil de estilo personalizado está listo.',
        [
          {
            text: 'Ver mi perfil completo',
            onPress: () => {
              router.push('/(tabs)');
            },
          },
        ]
      );
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedBrands([]);
    }
  };

  const handleBack = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedBrands([]);
    } else {
      router.back();
    }
  };

  const getBrandColor = (brand: string): string => {
    return brandColors[brand] || '#7A142C';
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Preparando tu selección de marcas...</Text>
      </View>
    );
  }

  if (brandQuestions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>
          No se pudieron generar preguntas de marcas. Completa los bloques anteriores.
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
          {currentQuestionIndex + 1} de {brandQuestions.length}
        </Text>
        
        <Text style={styles.blockLabel}>Bloque 3</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Pregunta */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            ¿Qué marcas te gustan para el estilo {currentQuestion.styleName}?
          </Text>
          <Text style={styles.styleLabel}>Estilo: {currentQuestion.styleName}</Text>
          
          {/* Contador de selecciones */}
          <View style={styles.selectionCounter}>
            <Text style={styles.counterText}>
              {selectedBrands.length}/3 marcas seleccionadas
            </Text>
            {selectedBrands.length > 0 && (
              <Text style={styles.counterSubtext}>
                {selectedBrands.length < 2 
                  ? `Necesitas al menos ${2 - selectedBrands.length} más` 
                  : selectedBrands.length < 3 
                    ? `Puedes seleccionar ${3 - selectedBrands.length} más`
                    : 'Máximo alcanzado'}
              </Text>
            )}
          </View>
        </View>

        {/* Grid de marcas */}
        <View style={styles.brandsGrid}>
          {currentQuestion.availableBrands.map((brand, index) => (
            <TouchableOpacity
              key={`${brand}-${index}`}
              style={[
                styles.brandCard,
                selectedBrands.includes(brand) && styles.brandCardSelected,
                selectedBrands.length >= 3 && !selectedBrands.includes(brand) && styles.brandCardDisabled
              ]}
              onPress={() => handleBrandToggle(brand)}
              disabled={selectedBrands.length >= 3 && !selectedBrands.includes(brand)}
            >
              <View style={[styles.brandIcon, { backgroundColor: getBrandColor(brand) }]}>
                <Text style={styles.brandInitials}>
                  {brand.split(' ').map(word => word[0]).join('').toUpperCase()}
                </Text>
              </View>
              <Text style={[
                styles.brandName,
                selectedBrands.includes(brand) && styles.brandNameSelected
              ]}>
                {brand}
              </Text>
              {selectedBrands.includes(brand) && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Instrucciones */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Selecciona entre 2 y 3 marcas que te gusten para este estilo
          </Text>
          <Text style={styles.instructionsSubtext}>
            Toca una marca para seleccionar/deseleccionar
          </Text>
        </View>
      </ScrollView>

      {/* Botón siguiente */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.nextButton, selectedBrands.length < 2 && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={selectedBrands.length < 2}
        >
          <Text style={[styles.nextButtonText, selectedBrands.length < 2 && styles.nextButtonTextDisabled]}>
            {isLastQuestion ? 'Finalizar Cuestionario' : 'Siguiente Estilo'}
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
  styleLabel: {
    fontSize: 18,
    fontFamily: 'System',
    color: '#4D6F62',
    fontWeight: '600',
    marginBottom: 15,
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
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  brandCard: {
    width: (width - 70) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  brandCardSelected: {
    borderColor: '#7A142C',
    shadowOpacity: 0.2,
    elevation: 8,
    backgroundColor: '#f8f9fa',
  },
  brandCardDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  brandIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  brandNameSelected: {
    color: '#7A142C',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#7A142C',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FAA6B5',
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 5,
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
}); 