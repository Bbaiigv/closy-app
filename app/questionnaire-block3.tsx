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
  Image,
  Animated,
} from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { useAlert } from '@/hooks/useAlert';
import { 
  getTop3StylesForBrands, 
  getBrandsForStyle, 
  validateBrandSelection,
  getUnifiedBrandsForTopStyles,
  validateUnifiedBrandSelection,
  calculateBrandScores,
  BrandWithScore
} from '@/utils/styleScoring';

interface BrandQuestion {
  id: number;
  styleName: string;
  availableBrands: string[];
}

interface LookElement {
  id: string;
  name: string;
  image: any;
  displayName: string;
}

interface SubcategoryOption {
  id: string;
  name: string;
  image: any;
  displayName: string;
  styleMapping?: string[]; // Para zapatos y capa que se mapean a estilos
}

interface SubcategoryQuestion {
  category: string;
  categoryDisplayName: string;
  options: SubcategoryOption[];
  selectionType: 'single' | 'multiple'; // single para accesorios/base, multiple para zapatos/capa
  maxSelections?: number;
}

const lookElements: LookElement[] = [
  {
    id: 'zapatos',
    name: 'zapatos',
    image: require('../assets/images/TercerCuestionario/zapatos.png'),
    displayName: 'Zapatos'
  },
  {
    id: 'accesorios',
    name: 'accesorios', 
    image: require('../assets/images/TercerCuestionario/accesorios.png'),
    displayName: 'Accesorios'
  },
  {
    id: 'base',
    name: 'base',
    image: require('../assets/images/TercerCuestionario/base.png'),
    displayName: 'Base'
  },
  {
    id: 'capaExterior',
    name: 'capaExterior',
    image: require('../assets/images/TercerCuestionario/capaExterior.png'),
    displayName: 'Capa Exterior'
  }
];

// Mapeo de estilos a imágenes de zapatos
const zapatosStyleMapping: { [key: string]: string } = {
  'Boho': 'boho',
  'Formal': 'formal', 
  'Trendy': 'trendy',
  'Básica': 'basica',
  'Sexy': 'sexy',
  'Streetwear': 'streetwear',
  'Pija': 'pija',
  'Caye-20': 'caye-20'
};

// Mapeo de estilos a imágenes de capa exterior
const capaStyleMapping: { [key: string]: string } = {
  'Boho': 'boho',
  'Formal': 'formal-Caye20-Pija-Sexy',
  'Trendy': 'basica-ST-Trendy',
  'Básica': 'basica-ST-Trendy',
  'Streetwear': 'basica-ST-Trendy',
  'Pija': 'pija-Formal',
  'Caye-20': 'caye-20-Pija'
};

// Opciones para cada categoría
const subcategoryQuestions: { [key: string]: SubcategoryQuestion } = {
  accesorios: {
    category: 'accesorios',
    categoryDisplayName: 'Accesorios',
    selectionType: 'single',
    options: [
      {
        id: 'bisuteria',
        name: 'bisuteria',
        image: require('../assets/images/TercerCuestionario/accesorios/bisuteria.png'),
        displayName: 'Bisutería'
      },
      {
        id: 'bolsos',
        name: 'bolsos',
        image: require('../assets/images/TercerCuestionario/accesorios/bolsos.png'),
        displayName: 'Bolsos'
      },
      {
        id: 'otro',
        name: 'otro',
        image: require('../assets/images/TercerCuestionario/accesorios/otro.png'),
        displayName: 'Otros'
      }
    ]
  },
  base: {
    category: 'base',
    categoryDisplayName: 'Base',
    selectionType: 'single',
    options: [
      {
        id: 'vestidos',
        name: 'vestidos',
        image: require('../assets/images/TercerCuestionario/Base/Vestidos.png'),
        displayName: 'Vestidos'
      },
      {
        id: 'pantalones',
        name: 'pantalones',
        image: require('../assets/images/TercerCuestionario/Base/pantalones.png'),
        displayName: 'Pantalones'
      },
      {
        id: 'partesArriba',
        name: 'partesArriba',
        image: require('../assets/images/TercerCuestionario/Base/partesArriba.png'),
        displayName: 'Partes de Arriba'
      }
    ]
  },
  zapatos: {
    category: 'zapatos',
    categoryDisplayName: 'Zapatos',
    selectionType: 'multiple',
    maxSelections: 3,
    options: [
      {
        id: 'boho',
        name: 'boho',
        image: require('../assets/images/TercerCuestionario/zapatos/boho.png'),
        displayName: 'Boho',
        styleMapping: ['Boho']
      },
      {
        id: 'formal',
        name: 'formal',
        image: require('../assets/images/TercerCuestionario/zapatos/formal.png'),
        displayName: 'Formal',
        styleMapping: ['Formal Clásica']
      },
      {
        id: 'trendy',
        name: 'trendy',
        image: require('../assets/images/TercerCuestionario/zapatos/trendy.png'),
        displayName: 'Trendy',
        styleMapping: ['Moderna Trendy']
      },
      {
        id: 'basica',
        name: 'basica',
        image: require('../assets/images/TercerCuestionario/zapatos/basica.png'),
        displayName: 'Básica',
        styleMapping: ['Básica']
      },
      {
        id: 'sexy',
        name: 'sexy',
        image: require('../assets/images/TercerCuestionario/zapatos/sexy.png'),
        displayName: 'Sexy',
        styleMapping: ['Sexy']
      },
      {
        id: 'streetwear',
        name: 'streetwear',
        image: require('../assets/images/TercerCuestionario/zapatos/streetwear.png'),
        displayName: 'Streetwear',
        styleMapping: ['ST']
      },
      {
        id: 'pija',
        name: 'pija',
        image: require('../assets/images/TercerCuestionario/zapatos/pija.png'),
        displayName: 'Pija',
        styleMapping: ['Pija']
      },
      {
        id: 'caye-20',
        name: 'caye-20',
        image: require('../assets/images/TercerCuestionario/zapatos/caye-20.png'),
        displayName: 'Caye-20',
        styleMapping: ['Cayetana -20']
      },
      {
        id: 'caye20',
        name: 'caye20',
        image: require('../assets/images/TercerCuestionario/zapatos/caye-20.png'),
        displayName: 'Caye+20',
        styleMapping: ['Cayetana +20']
      }
    ]
  },
  capaExterior: {
    category: 'capaExterior',
    categoryDisplayName: 'Capa Exterior',
    selectionType: 'multiple',
    maxSelections: 3,
    options: [
      {
        id: 'boho',
        name: 'boho',
        image: require('../assets/images/TercerCuestionario/capa/boho.png'),
        displayName: 'Boho',
        styleMapping: ['Boho']
      },
      {
        id: 'formal-caye20-pija-sexy',
        name: 'formal-caye20-pija-sexy',
        image: require('../assets/images/TercerCuestionario/capa/formal-Caye20-Pija-Sexy.png'),
        displayName: 'Formal/Elegante',
        styleMapping: ['Formal Clásica', 'Cayetana -20', 'Cayetana +20', 'Pija', 'Sexy']
      },
      {
        id: 'basica-st-trendy',
        name: 'basica-st-trendy',
        image: require('../assets/images/TercerCuestionario/capa/basica-ST-Trendy.png'),
        displayName: 'Básica/Trendy',
        styleMapping: ['Básica', 'ST', 'Moderna Trendy']
      },
      {
        id: 'pija-formal',
        name: 'pija-formal',
        image: require('../assets/images/TercerCuestionario/capa/pija-Formal.png'),
        displayName: 'Pija/Formal',
        styleMapping: ['Pija', 'Formal Clásica']
      },
      {
        id: 'caye20-formal',
        name: 'caye20-formal',
        image: require('../assets/images/TercerCuestionario/capa/caye20-Formal.png'),
        displayName: 'Caye-20/Formal',
        styleMapping: ['Cayetana -20', 'Cayetana +20', 'Formal Clásica']
      },
      {
        id: 'caye-20-pija',
        name: 'caye-20-pija',
        image: require('../assets/images/TercerCuestionario/capa/caye-20-Pija.png'),
        displayName: 'Caye-20/Pija',
        styleMapping: ['Cayetana -20', 'Cayetana +20', 'Pija']
      }
    ]
  }
};

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

  const [unifiedBrands, setUnifiedBrands] = useState<BrandWithScore[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [topStylesInfo, setTopStylesInfo] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados deprecated para retrocompatibilidad
  const [brandQuestions, setBrandQuestions] = useState<BrandQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Estados para la pregunta de elementos del look
  const [showLookPriorityQuestion, setShowLookPriorityQuestion] = useState(false);
  const [lookPriorities, setLookPriorities] = useState<{[key: string]: number}>({});
  const [animatedValues] = useState(() => 
    lookElements.reduce((acc, element) => {
      acc[element.id] = new Animated.Value(1);
      return acc;
    }, {} as {[key: string]: Animated.Value})
  );
  
  // Estados para los subcuestionarios
  const [showSubcategoryQuestions, setShowSubcategoryQuestions] = useState(false);
  const [currentSubcategoryIndex, setCurrentSubcategoryIndex] = useState(0);
  const [subcategoryOrder, setSubcategoryOrder] = useState<string[]>([]);
  const [subcategorySelections, setSubcategorySelections] = useState<{[key: string]: string[]}>({});
  const [subcategoryAnimatedValues] = useState(() => 
    Object.keys(subcategoryQuestions).reduce((acc, category) => {
      acc[category] = subcategoryQuestions[category].options.reduce((optAcc, option) => {
        optAcc[option.id] = new Animated.Value(1);
        return optAcc;
      }, {} as {[key: string]: Animated.Value});
      return acc;
    }, {} as {[key: string]: {[key: string]: Animated.Value}})
  );

  useEffect(() => {
    // Generar marcas unificadas basadas en los top 3 estilos
    const generateUnifiedBrands = () => {
      // Verificar que el usuario haya completado los bloques anteriores
      if (state.styleScores.length === 0) {
        showAlert(
          'Bloques anteriores incompletos',
          'Necesitas completar los bloques 1 y 2 antes de continuar.',
          [{ text: 'Ir al Bloque 1', onPress: () => router.push('./questionnaire-block1') }]
        );
        return;
      }

      // Verificar que haya respuestas del bloque 2 (IDs > 2000)
      const block2Responses = state.questionnaireResponses.filter(r => r.questionId > 2000);
      if (block2Responses.length === 0) {
        showAlert(
          'Bloque 2 incompleto',
          'Necesitas completar el bloque 2 antes de continuar.',
          [{ text: 'Ir al Bloque 2', onPress: () => router.push('./questionnaire-block2') }]
        );
        return;
      }

      const brandsWithScore = getUnifiedBrandsForTopStyles(state.questionnaireResponses);
      
      if (brandsWithScore.length === 0) {
        showAlert(
          'Error en datos',
          'No se pudieron generar marcas. Verifica que hayas completado los bloques anteriores correctamente.',
          [{ text: 'Ir al Bloque 2', onPress: () => router.push('./questionnaire-block2') }]
        );
        return;
      }

      const top3Styles = getTop3StylesForBrands(state.questionnaireResponses);
      const styleNames = top3Styles.map(style => style.styleName);

      setUnifiedBrands(brandsWithScore);
      setTopStylesInfo(styleNames);
      setIsLoading(false);
    };

    generateUnifiedBrands();
  }, [state.questionnaireResponses]);

  const handleUnifiedBrandToggle = (brand: string): void => {
    setSelectedBrands(prevSelected => {
      const isAlreadySelected = prevSelected.includes(brand);
      
      if (isAlreadySelected) {
        // Deseleccionar
        return prevSelected.filter(b => b !== brand);
      } else {
        // Seleccionar si no hemos llegado al límite de 5
        if (prevSelected.length < 5) {
          return [...prevSelected, brand];
        }
        return prevSelected;
      }
    });
  };

  const handleUnifiedBrandsSubmit = (): void => {
    const validation = validateUnifiedBrandSelection(selectedBrands, unifiedBrands);
    
    if (!validation.isValid) {
      showAlert('Selección no válida', validation.message);
      return;
    }

    // Calcular puntuaciones de las marcas seleccionadas
    const brandScores = calculateBrandScores(selectedBrands, unifiedBrands);

    // Guardar la respuesta unificada de marcas
    dispatch({
      type: 'ADD_UNIFIED_BRAND_RESPONSE',
      payload: {
        selectedBrands,
        brandScores,
        topStyles: topStylesInfo,
        timestamp: Date.now(),
      },
    });

        // Convertir puntuaciones de marcas en puntos de estilo
    // Sistema: Si marca vale X puntos, cada estilo de esa marca recibe X puntos
    brandScores.forEach((brandScore) => {
      const pointsPerStyle = brandScore.finalScore; // Los puntos que indica cada marca
      
      brandScore.styles.forEach((styleName) => {
        dispatch({
          type: 'ADD_QUESTIONNAIRE_RESPONSE',
          payload: {
            questionId: 35000 + Date.now() + Math.random(), // ID único para cada estilo de cada marca
            response: pointsPerStyle, // Cada estilo recibe todos los puntos de la marca
            styleName: styleName,
          },
        });
      });
    });

    // Continuar a la pregunta de prioridades del look
    setShowLookPriorityQuestion(true);
  };

  const handleBack = (): void => {
    router.back();
  };

  const getBrandColor = (brand: string): string => {
    return brandColors[brand] || '#7A142C';
  };

  const handleLookElementPress = (elementId: string): void => {
    const currentPriority = lookPriorities[elementId];
    const nextPriorityNumber = Object.keys(lookPriorities).length + 1;
    
    if (currentPriority) {
      // Ya está seleccionado, remover y ajustar prioridades
      const newPriorities = { ...lookPriorities };
      delete newPriorities[elementId];
      
      // Reajustar números de prioridad
      Object.keys(newPriorities).forEach(key => {
        if (newPriorities[key] > currentPriority) {
          newPriorities[key] -= 1;
        }
      });
      
      setLookPriorities(newPriorities);
      
      // Animar salida
      Animated.sequence([
        Animated.timing(animatedValues[elementId], {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[elementId], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else if (nextPriorityNumber <= 4) {
      // Agregar nueva prioridad
      setLookPriorities(prev => ({
        ...prev,
        [elementId]: nextPriorityNumber
      }));
      
      // Animar selección
      Animated.sequence([
        Animated.timing(animatedValues[elementId], {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[elementId], {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[elementId], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  // Función para obtener las mejores opciones basadas en puntuaciones acumuladas
  const getBestOptionsForCategory = (category: string, maxOptions: number = 3): SubcategoryOption[] => {
    const categoryConfig = subcategoryQuestions[category];
    if (!categoryConfig) {
      return [];
    }

    // Para categorías con selección única, devolver todas las opciones
    if (categoryConfig.selectionType === 'single') {
      return categoryConfig.options;
    }

    const styleScores = state.styleScores;
    
    // Calcular puntuación para cada opción basada en los estilos acumulados
    const optionsWithScores = categoryConfig.options.map(option => {
      let totalScore = 0;
      let matchCount = 0;
      
      if (option.styleMapping) {
        option.styleMapping.forEach(styleName => {
          const styleScore = styleScores.find(s => s.styleName === styleName);
          if (styleScore) {
            totalScore += styleScore.averageScore;
            matchCount++;
          }
        });
      }
      
      return {
        ...option,
        calculatedScore: matchCount > 0 ? totalScore / matchCount : 0
      };
    });

    // Ordenar por puntuación descendente y tomar las mejores
    return optionsWithScores
      .sort((a, b) => b.calculatedScore - a.calculatedScore)
      .slice(0, maxOptions)
      .map(({ calculatedScore, ...option }) => option);
  };



  const handleFinishPriorities = (): void => {
    if (Object.keys(lookPriorities).length !== 4) {
      showAlert(
        'Selección incompleta',
        'Por favor, ordena todos los elementos del look del 1 al 4 según tu preferencia.'
      );
      return;
    }

    // Guardar las prioridades del look
    dispatch({
      type: 'ADD_LOOK_PRIORITIES',
      payload: {
        priorities: lookPriorities,
        timestamp: Date.now(),
      },
    });

    // Crear orden de subcategorías basado en las prioridades
    const orderedCategories = [1, 2, 3, 4].map(priority => {
      const categoryId = Object.keys(lookPriorities).find(
        key => lookPriorities[key] === priority
      );
      return categoryId;
    }).filter(Boolean) as string[];

    setSubcategoryOrder(orderedCategories);
    setShowLookPriorityQuestion(false);
    setShowSubcategoryQuestions(true);
    setCurrentSubcategoryIndex(0);
  };

  const handleSubcategorySelection = (categoryId: string, optionId: string): void => {
    const categoryConfig = subcategoryQuestions[categoryId];
    const currentSelections = subcategorySelections[categoryId] || [];
    
    if (categoryConfig.selectionType === 'single') {
      // Para selección única, reemplazar
      setSubcategorySelections(prev => ({
        ...prev,
        [categoryId]: [optionId]
      }));
    } else {
      // Para selección múltiple
      const isSelected = currentSelections.includes(optionId);
      let newSelections: string[];
      
      if (isSelected) {
        newSelections = currentSelections.filter(id => id !== optionId);
      } else {
        const maxSelections = categoryConfig.maxSelections || 3;
        if (currentSelections.length < maxSelections) {
          newSelections = [...currentSelections, optionId];
        } else {
          return; // No agregar más si ya llegó al límite
        }
      }
      
      setSubcategorySelections(prev => ({
        ...prev,
        [categoryId]: newSelections
      }));
    }

    // Animar selección
    const animatedValue = subcategoryAnimatedValues[categoryId]?.[optionId];
    if (animatedValue) {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  const handleNextSubcategory = (): void => {
    const currentCategory = subcategoryOrder[currentSubcategoryIndex];
    const categoryConfig = subcategoryQuestions[currentCategory];
    const currentSelections = subcategorySelections[currentCategory] || [];
    
    // Validar selección
    if (categoryConfig.selectionType === 'single' && currentSelections.length === 0) {
      showAlert('Selección requerida', 'Por favor, selecciona una opción antes de continuar.');
      return;
    }
    
    if (categoryConfig.selectionType === 'multiple' && currentSelections.length === 0) {
      showAlert('Selección requerida', 'Por favor, selecciona al menos una opción antes de continuar.');
      return;
    }

    // Guardar respuesta en el contexto
    dispatch({
      type: 'ADD_SUBCATEGORY_RESPONSE',
      payload: {
        category: currentCategory,
        selections: currentSelections,
        timestamp: Date.now(),
      },
    });

    // Convertir selecciones en puntos de estilo
    currentSelections.forEach((optionId) => {
      const option = categoryConfig.options.find(opt => opt.id === optionId);
      if (option && option.styleMapping) {
        // Determinar puntos según la categoría
        let pointsPerStyle = 0;
        if (currentCategory === 'zapatos') {
          pointsPerStyle = 2; // Zapatos suman 2 puntos
        } else if (currentCategory === 'capaExterior') {
          pointsPerStyle = 1; // Capas suman 1 punto
        }
        // accesorios y base no suman puntos a estilos específicos

        if (pointsPerStyle > 0) {
          // Para zapatos: 2 puntos para cada estilo mapeado
          // Para capas: 1 punto para cada estilo mapeado
          option.styleMapping.forEach((styleName) => {
            dispatch({
              type: 'ADD_QUESTIONNAIRE_RESPONSE',
              payload: {
                questionId: 30000 + Date.now() + Math.random(), // ID único para cada estilo de cada subcategoría
                response: pointsPerStyle, // Puntos fijos por categoría
                styleName: styleName,
              },
            });
          });
        }
      }
    });

    // Avanzar al siguiente subcuestionario o finalizar
    if (currentSubcategoryIndex < subcategoryOrder.length - 1) {
      setCurrentSubcategoryIndex(currentSubcategoryIndex + 1);
    } else {
      // Todos los subcuestionarios completados - Marcar onboarding completo
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      dispatch({ type: 'SET_CURRENT_BLOCK', payload: 4 }); // Indicar que todo está completo
      
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
    }
  };

  const handleBackSubcategory = (): void => {
    if (currentSubcategoryIndex > 0) {
      setCurrentSubcategoryIndex(currentSubcategoryIndex - 1);
    } else {
      setShowSubcategoryQuestions(false);
      setShowLookPriorityQuestion(true);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Preparando tu selección de marcas...</Text>
      </View>
    );
  }

  if (unifiedBrands.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>
          No se pudieron generar marcas. Completa los bloques anteriores.
        </Text>
        <TouchableOpacity style={styles.backToHomeButton} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.backToHomeButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Mostrar la pregunta de prioridades del look
  if (showLookPriorityQuestion) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#FCF6F3" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowLookPriorityQuestion(false)}>
            <Text style={styles.backButtonText}>← Atrás</Text>
          </TouchableOpacity>
          
          <Text style={styles.progressText}>Pregunta Final</Text>
          <Text style={styles.blockLabel}>Bloque 3</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {/* Pregunta principal */}
          <View style={styles.lookQuestionContainer}>
            <Text style={styles.lookQuestionTitle}>
              ¿Qué es más importante para ti en tu look?
            </Text>
            <Text style={styles.lookQuestionSubtitle}>
              Ordena del 1 al 4 según tu preferencia (1 = más importante)
            </Text>
            
            {/* Contador de selecciones */}
            <View style={styles.priorityCounter}>
              <Text style={styles.priorityCounterText}>
                {Object.keys(lookPriorities).length}/4 elementos ordenados
              </Text>
              {Object.keys(lookPriorities).length > 0 && (
                <Text style={styles.priorityCounterSubtext}>
                  {Object.keys(lookPriorities).length < 4 
                    ? `Faltan ${4 - Object.keys(lookPriorities).length} elementos`
                    : '¡Perfecto! Todos los elementos ordenados'}
                </Text>
              )}
            </View>
          </View>

          {/* Grid de elementos del look */}
          <View style={styles.lookElementsGrid}>
            {lookElements.map((element) => {
              const priority = lookPriorities[element.id];
              const isSelected = priority !== undefined;
              
              return (
                <Animated.View
                  key={element.id}
                  style={[
                    styles.lookElementCard,
                    isSelected && styles.lookElementCardSelected,
                    { transform: [{ scale: animatedValues[element.id] }] }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.lookElementContent}
                    onPress={() => handleLookElementPress(element.id)}
                    activeOpacity={0.8}
                  >
                    {/* Imagen del elemento */}
                    <View style={styles.lookElementImageContainer}>
                      <Image 
                        source={element.image} 
                        style={styles.lookElementImage}
                        resizeMode="cover"
                      />
                      {/* Overlay con gradiente para mejor legibilidad */}
                      <View style={styles.lookElementImageOverlay} />
                    </View>
                    
                    {/* Contenido del elemento */}
                    <View style={styles.lookElementInfo}>
                      <Text style={[
                        styles.lookElementName,
                        isSelected && styles.lookElementNameSelected
                      ]}>
                        {element.displayName}
                      </Text>
                      
                      {/* Indicador de prioridad */}
                      {isSelected && (
                        <View style={styles.priorityBadge}>
                          <Text style={styles.priorityBadgeText}>{priority}</Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Efecto de brillo cuando está seleccionado */}
                    {isSelected && <View style={styles.sparkleEffect} />}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Resumen de selecciones */}
          {Object.keys(lookPriorities).length > 0 && (
            <View style={styles.prioritySummary}>
              <Text style={styles.prioritySummaryTitle}>Tu orden de preferencia:</Text>
              {[1, 2, 3, 4].map(priority => {
                const elementId = Object.keys(lookPriorities).find(
                  key => lookPriorities[key] === priority
                );
                const element = lookElements.find(el => el.id === elementId);
                
                if (!element) return null;
                
                return (
                  <View key={priority} style={styles.prioritySummaryItem}>
                    <View style={styles.prioritySummaryNumber}>
                      <Text style={styles.prioritySummaryNumberText}>{priority}</Text>
                    </View>
                    <Text style={styles.prioritySummaryText}>{element.displayName}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Instrucciones */}
          <View style={styles.lookInstructionsContainer}>
            <Text style={styles.lookInstructionsText}>
              Toca cada elemento para establecer el orden de importancia
            </Text>
            <Text style={styles.lookInstructionsSubtext}>
              Puedes tocar de nuevo para cambiar el orden
            </Text>
          </View>
        </ScrollView>

        {/* Botón finalizar */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[
              styles.finishButton, 
              Object.keys(lookPriorities).length !== 4 && styles.finishButtonDisabled
            ]}
            onPress={handleFinishPriorities}
            disabled={Object.keys(lookPriorities).length !== 4}
          >
            <Text style={[
              styles.finishButtonText,
              Object.keys(lookPriorities).length !== 4 && styles.finishButtonTextDisabled
            ]}>
              ✨ Finalizar Cuestionario ✨
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Mostrar subcuestionarios
  if (showSubcategoryQuestions && subcategoryOrder.length > 0) {
    const currentCategory = subcategoryOrder[currentSubcategoryIndex];
    const categoryConfig = subcategoryQuestions[currentCategory];
    const availableOptions = getBestOptionsForCategory(currentCategory);
    const currentSelections = subcategorySelections[currentCategory] || [];
    const isLastSubcategory = currentSubcategoryIndex === subcategoryOrder.length - 1;

    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#FCF6F3" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackSubcategory}>
            <Text style={styles.backButtonText}>← Atrás</Text>
          </TouchableOpacity>
          
          <Text style={styles.progressText}>
            {currentSubcategoryIndex + 1} de {subcategoryOrder.length}
          </Text>
          <Text style={styles.blockLabel}>Subcategorías</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {/* Pregunta del subcuestionario */}
          <View style={styles.subcategoryQuestionContainer}>
            <Text style={styles.subcategoryQuestionTitle}>
              {categoryConfig.selectionType === 'single' 
                ? `¿Qué tipo de ${categoryConfig.categoryDisplayName.toLowerCase()} prefieres?`
                : `¿Cuáles son tus ${categoryConfig.categoryDisplayName.toLowerCase()} favoritos?`
              }
            </Text>
            <Text style={styles.subcategoryQuestionSubtitle}>
              Categoría: {categoryConfig.categoryDisplayName}
            </Text>
            
            {/* Indicador de prioridad */}
            <View style={styles.priorityIndicator}>
              <Text style={styles.priorityIndicatorText}>
                Prioridad #{currentSubcategoryIndex + 1} en tu look
              </Text>
            </View>
            
            {/* Contador de selecciones */}
            <View style={styles.subcategoryCounter}>
                <Text style={styles.subcategoryCounterText}>
                {categoryConfig.selectionType === 'single' 
                  ? (currentSelections.length > 0 ? '1/1 seleccionado' : 'Selecciona una opción')
                  : `${currentSelections.length}/${categoryConfig.maxSelections || 3} seleccionados`
                      }
                    </Text>
            </View>
          </View>

          {/* Lista vertical de opciones */}
          <View style={styles.subcategoryOptionsList}>
            {availableOptions.map((option) => {
              const isSelected = currentSelections.includes(option.id);
              const isDisabled = categoryConfig.selectionType === 'multiple' && 
                                 currentSelections.length >= (categoryConfig.maxSelections || 3) && 
                                 !isSelected;
              
              return (
                <Animated.View
                  key={option.id}
                  style={[
                    styles.subcategoryOptionCard,
                    isSelected && styles.subcategoryOptionCardSelected,
                    isDisabled && styles.subcategoryOptionCardDisabled,
                    { transform: [{ scale: subcategoryAnimatedValues[currentCategory]?.[option.id] || new Animated.Value(1) }] }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.subcategoryOptionContent}
                    onPress={() => handleSubcategorySelection(currentCategory, option.id)}
                    disabled={isDisabled}
                    activeOpacity={0.8}
                  >
                    {/* Imagen de la opción */}
                    <View style={styles.subcategoryOptionImageContainer}>
                      <Image 
                        source={option.image} 
                        style={styles.subcategoryOptionImage}
                        resizeMode="cover"
                      />
                    </View>
                    
                    {/* Nombre de la opción */}
                      <Text style={[
                        styles.subcategoryOptionName,
                        isSelected && styles.subcategoryOptionNameSelected
                      ]}>
                        {option.displayName}
                      </Text>
                      
                      {/* Indicador de selección */}
                      {isSelected && (
                        <View style={styles.subcategorySelectedBadge}>
                          <Text style={styles.subcategorySelectedBadgeText}>✓</Text>
                        </View>
                      )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>


        </ScrollView>

        {/* Botón siguiente */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[
              styles.subcategoryNextButton, 
              currentSelections.length === 0 && styles.subcategoryNextButtonDisabled
            ]}
            onPress={handleNextSubcategory}
            disabled={currentSelections.length === 0}
          >
            <Text style={[
              styles.subcategoryNextButtonText,
              currentSelections.length === 0 && styles.subcategoryNextButtonTextDisabled
            ]}>
              {isLastSubcategory ? '✨ Finalizar Cuestionario ✨' : `Siguiente: ${subcategoryOrder[currentSubcategoryIndex + 1] ? subcategoryQuestions[subcategoryOrder[currentSubcategoryIndex + 1]]?.categoryDisplayName : 'Siguiente'}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        
        <Text style={styles.progressText}>
          Marcas Favoritas
        </Text>
        
        <Text style={styles.blockLabel}>Bloque 3</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Pregunta unificada */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            ¿Cuáles son tus marcas favoritas?
          </Text>
          <Text style={styles.styleLabel}>
            Basado en tus estilos preferidos: {topStylesInfo.join(', ')}
          </Text>
          
          {/* Contador de selecciones */}
          <View style={styles.selectionCounter}>
            <Text style={styles.counterText}>
              {selectedBrands.length}/5 marcas seleccionadas
            </Text>
            {selectedBrands.length > 0 && (
              <Text style={styles.counterSubtext}>
                {selectedBrands.length < 2 
                  ? `Necesitas al menos ${2 - selectedBrands.length} más` 
                  : selectedBrands.length < 5 
                    ? `Puedes seleccionar ${5 - selectedBrands.length} más`
                    : 'Máximo alcanzado'}
              </Text>
            )}
          </View>
        </View>

        {/* Información sobre puntuaciones */}
        <View style={styles.brandScoreInfo}>
          <Text style={styles.brandScoreInfoTitle}>
            ✨ Sistema de Puntuación Inteligente
          </Text>
          <Text style={styles.brandScoreInfoText}>
            Las marcas están organizadas por puntuación: Las únicas en tu estilo valen más puntos que las que aparecen en múltiples estilos.
          </Text>
        </View>

        {/* Grid de marcas unificadas */}
        <View style={styles.brandsGrid}>
          {unifiedBrands.map((brandData, index) => (
            <TouchableOpacity
              key={`${brandData.brandName}-${index}`}
              style={[
                styles.brandCard,
                selectedBrands.includes(brandData.brandName) && styles.brandCardSelected,
                selectedBrands.length >= 5 && !selectedBrands.includes(brandData.brandName) && styles.brandCardDisabled
              ]}
              onPress={() => handleUnifiedBrandToggle(brandData.brandName)}
              disabled={selectedBrands.length >= 5 && !selectedBrands.includes(brandData.brandName)}
            >
              <View style={[styles.brandIcon, { backgroundColor: getBrandColor(brandData.brandName) }]}>
                <Text style={styles.brandInitials}>
                  {brandData.brandName.split(' ').map((word: string) => word[0]).join('').toUpperCase()}
                </Text>
              </View>
              <Text style={[
                styles.brandName,
                selectedBrands.includes(brandData.brandName) && styles.brandNameSelected
              ]}>
                {brandData.brandName}
              </Text>
              
              {/* Indicador de puntuación */}
              <View style={[styles.scoreBadge, { backgroundColor: brandData.score === 3 ? '#FFD700' : brandData.score === 2 ? '#C0C0C0' : '#CD7F32' }]}>
                <Text style={styles.scoreBadgeText}>{brandData.score}pts</Text>
              </View>
              
              {/* Información de estilos */}
              <Text style={styles.brandStyles}>
                {brandData.styles.slice(0, 2).join(', ')}
                {brandData.styles.length > 2 && '...'}
              </Text>
              
              {selectedBrands.includes(brandData.brandName) && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Resumen de selecciones */}
        {selectedBrands.length > 0 && (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionSummaryTitle}>
              Tu selección actual:
            </Text>
            <View style={styles.selectionList}>
              {selectedBrands.map((brandName, index) => {
                const brandData = unifiedBrands.find(b => b.brandName === brandName);
                return (
                  <View key={brandName} style={styles.selectionItem}>
                    <View style={styles.selectionNumber}>
                      <Text style={styles.selectionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.selectionText}>{brandName}</Text>
                    {brandData && (
                      <Text style={styles.selectionScore}>({brandData.score}pts)</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Instrucciones */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Selecciona entre 2 y 5 marcas que más te gusten
          </Text>
          <Text style={styles.instructionsSubtext}>
            Las marcas con mayor puntuación son más específicas de tus estilos favoritos
          </Text>
        </View>
      </ScrollView>

      {/* Botón siguiente */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.nextButton, selectedBrands.length < 2 && styles.nextButtonDisabled]} 
          onPress={handleUnifiedBrandsSubmit}
          disabled={selectedBrands.length < 2}
        >
          <Text style={[styles.nextButtonText, selectedBrands.length < 2 && styles.nextButtonTextDisabled]}>
            Continuar con Look
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
  lookQuestionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  lookQuestionTitle: {
    fontSize: 22,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  lookQuestionSubtitle: {
    fontSize: 16,
    fontFamily: 'System',
    color: '#4D6F62',
    textAlign: 'center',
    marginBottom: 15,
  },
  priorityCounter: {
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
  priorityCounterText: {
    fontSize: 16,
    color: '#7A142C',
    fontWeight: '600',
    marginBottom: 4,
  },
  priorityCounterSubtext: {
    fontSize: 12,
    color: '#4D6F62',
    fontStyle: 'italic',
  },
  lookElementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  lookElementCard: {
    width: (width - 70) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
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
    marginBottom: 15,
  },
  lookElementCardSelected: {
    borderColor: '#7A142C',
    shadowOpacity: 0.3,
    elevation: 8,
    backgroundColor: '#f8f9fa',
  },
  lookElementContent: {
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  lookElementImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },
  lookElementImage: {
    width: '100%',
    height: '100%',
  },
  lookElementImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  lookElementInfo: {
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  lookElementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  lookElementNameSelected: {
    color: '#7A142C',
  },
  priorityBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#7A142C',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  priorityBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sparkleEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 20,
  },
  prioritySummary: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FAA6B5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  prioritySummaryTitle: {
    fontSize: 18,
    color: '#7A142C',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 15,
  },
  prioritySummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  prioritySummaryNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#7A142C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  prioritySummaryNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  prioritySummaryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  lookInstructionsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FAA6B5',
  },
  lookInstructionsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 5,
  },
  lookInstructionsSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  finishButton: {
    backgroundColor: '#7A142C',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  finishButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  finishButtonText: {
    color: '#FCF6F3',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  finishButtonTextDisabled: {
    color: '#999',
  },

  subcategoryQuestionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  subcategoryQuestionTitle: {
    fontSize: 22,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  subcategoryQuestionSubtitle: {
    fontSize: 16,
    fontFamily: 'System',
    color: '#4D6F62',
    textAlign: 'center',
    marginBottom: 15,
  },
  priorityIndicator: {
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
  priorityIndicatorText: {
    fontSize: 16,
    color: '#7A142C',
    fontWeight: '600',
    marginBottom: 4,
  },
  subcategoryCounter: {
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
  subcategoryCounterText: {
    fontSize: 16,
    color: '#7A142C',
    fontWeight: '600',
    marginBottom: 4,
  },
  subcategoryCounterSubtext: {
    fontSize: 12,
    color: '#4D6F62',
    fontStyle: 'italic',
  },
  subcategoryOptionsList: {
    marginTop: 30,
    gap: 15,
  },
  subcategoryOptionCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
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
    marginBottom: 15,
  },
  subcategoryOptionCardSelected: {
    borderColor: '#7A142C',
    shadowOpacity: 0.3,
    elevation: 8,
    backgroundColor: '#f8f9fa',
  },
  subcategoryOptionCardDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  subcategoryOptionContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  subcategoryOptionImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 20,
    position: 'relative',
  },
  subcategoryOptionImage: {
    width: '100%',
    height: '100%',
  },

  subcategoryOptionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  subcategoryOptionNameSelected: {
    color: '#7A142C',
  },

  subcategorySelectedBadge: {
    backgroundColor: '#7A142C',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcategorySelectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  subcategoryNextButton: {
    backgroundColor: '#7A142C',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  subcategoryNextButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  subcategoryNextButtonText: {
    color: '#FCF6F3',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  subcategoryNextButtonTextDisabled: {
    color: '#999',
  },
  brandScoreInfo: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FAA6B5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  brandScoreInfoTitle: {
    fontSize: 18,
    color: '#7A142C',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
  },
  brandScoreInfoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  scoreBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 35,
  },
  scoreBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  brandStyles: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
    lineHeight: 14,
  },
  selectionSummary: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FAA6B5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectionSummaryTitle: {
    fontSize: 18,
    color: '#7A142C',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 15,
  },
  selectionList: {
    flexDirection: 'column',
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  selectionNumber: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#7A142C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectionNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectionScore: {
    fontSize: 14,
    color: '#4D6F62',
    fontWeight: '600',
    marginLeft: 8,
  },
}); 