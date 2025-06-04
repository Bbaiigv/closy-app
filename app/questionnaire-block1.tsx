import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppContext } from '@/contexts/AppContext';

interface StyleQuestion {
  id: number;
  styleName: string;
  imagePath: any;
}

const { width, height } = Dimensions.get('window');

// Importar las imágenes de forma segura
const styleImages = {
  basica: require('../assets/Bloque1_onboarding/Basica.png'),
  boho: require('../assets/Bloque1_onboarding/Boho.png'),
  cayetanaMenos20: require('../assets/Bloque1_onboarding/Cayetana-20.png'),
  cayetanaMas20: require('../assets/Bloque1_onboarding/Cayetana_20.png'),
  formalClasica: require('../assets/Bloque1_onboarding/Formal_clasica.png'),
  modernaTrendy: require('../assets/Bloque1_onboarding/Moderna_trendy.png'),
  pija: require('../assets/Bloque1_onboarding/Pija.png'),
  sexy: require('../assets/Bloque1_onboarding/Sexy.png'),
  st: require('../assets/Bloque1_onboarding/ST.png'),
};

const styleQuestions: StyleQuestion[] = [
  {
    id: 1,
    styleName: 'Básica',
    imagePath: styleImages.basica,
  },
  {
    id: 2,
    styleName: 'Boho',
    imagePath: styleImages.boho,
  },
  {
    id: 3,
    styleName: 'Cayetana -20',
    imagePath: styleImages.cayetanaMenos20,
  },
  {
    id: 4,
    styleName: 'Cayetana +20',
    imagePath: styleImages.cayetanaMas20,
  },
  {
    id: 5,
    styleName: 'Formal Clásica',
    imagePath: styleImages.formalClasica,
  },
  {
    id: 6,
    styleName: 'Moderna Trendy',
    imagePath: styleImages.modernaTrendy,
  },
  {
    id: 7,
    styleName: 'Pija',
    imagePath: styleImages.pija,
  },
  {
    id: 8,
    styleName: 'Sexy',
    imagePath: styleImages.sexy,
  },
  {
    id: 9,
    styleName: 'ST',
    imagePath: styleImages.st,
  },
];

const responseOptions = [
  { value: 1, label: 'No me gusta nada', color: '#FAA6B5' },
  { value: 2, label: 'Me gusta poco', color: '#FAA6B5' },
  { value: 3, label: 'Me gusta', color: '#FAA6B5' },
  { value: 4, label: 'Me gusta mucho', color: '#FAA6B5' },
  { value: 5, label: 'Me encanta', color: '#FAA6B5' },
];

export default function QuestionnaireBlock1Screen() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../assets/fonts/Castio-Regular.ttf'),
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);

  const currentQuestion = styleQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === styleQuestions.length - 1;

  const handleResponseSelect = (responseValue: number): void => {
    setSelectedResponse(responseValue);
  };

  const handleNext = (): void => {
    if (selectedResponse === null) {
      Alert.alert('Selecciona una opción', 'Por favor, elige una respuesta antes de continuar.');
      return;
    }

    // Guardar la respuesta en el contexto global
    dispatch({
      type: 'ADD_QUESTIONNAIRE_RESPONSE',
      payload: {
        questionId: currentQuestion.id,
        response: selectedResponse,
        styleName: currentQuestion.styleName,
      },
    });

    if (isLastQuestion) {
      // Marcar onboarding como completado
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      
      Alert.alert(
        'Bloque 1 Completado',
        '¡Has completado el primer bloque del cuestionario! Tu perfil de estilo está listo.',
        [
          {
            text: 'Ver mi perfil',
            onPress: () => {
              router.push('/(tabs)');
            },
          },
        ]
      );
    } else {
      // Ir a la siguiente pregunta
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedResponse(null);
    }
  };

  const handleBack = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Recuperar la respuesta anterior si existe
      const previousQuestion = styleQuestions[currentQuestionIndex - 1];
      const previousResponse = state.questionnaireResponses.find(
        r => r.questionId === previousQuestion.id
      );
      setSelectedResponse(previousResponse?.response || null);
    } else {
      router.back();
    }
  };

  if (!fontsLoaded) {
    return null;
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
          {currentQuestionIndex + 1} de {styleQuestions.length}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Imagen del estilo */}
        <View style={styles.imageContainer}>
          <Image
            source={currentQuestion.imagePath}
            style={styles.styleImage}
            resizeMode="contain"
          />
        </View>

        {/* Pregunta */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>¿Qué te parece este estilo?</Text>
          <Text style={styles.styleNameText}>{currentQuestion.styleName}</Text>
        </View>

        {/* Opciones de respuesta */}
        <View style={styles.optionsContainer}>
          {responseOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                selectedResponse === option.value && styles.optionButtonSelected,
                { borderColor: option.color }
              ]}
              onPress={() => handleResponseSelect(option.value)}
            >
              <View style={[styles.optionIndicator, { backgroundColor: option.color }]} />
              <Text style={[
                styles.optionText,
                selectedResponse === option.value && styles.optionTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botón siguiente */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.nextButton, !selectedResponse && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={selectedResponse === null}
        >
          <Text style={[styles.nextButtonText, !selectedResponse && styles.nextButtonTextDisabled]}>
            {isLastQuestion ? 'Finalizar Bloque' : 'Siguiente'}
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    height: height * 0.4,
    justifyContent: 'center',
  },
  styleImage: {
    width: width * 0.8,
    height: '100%',
    borderRadius: 15,
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
  },
  styleNameText: {
    fontSize: 18,
    fontFamily: 'System',
    color: '#4D6F62',
    fontWeight: '600',
  },
  optionsContainer: {
    marginTop: 20,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionButtonSelected: {
    backgroundColor: '#f0f8ff',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  optionIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'System',
    color: '#333',
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#7A142C',
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
}); 