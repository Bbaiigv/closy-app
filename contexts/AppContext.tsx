import { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos para el estado global
export interface User {
  name: string;
  email: string;
  province: string;
  age: string;
  isLoggedIn: boolean;
}

export interface QuestionnaireResponse {
  questionId: number;
  response: number;
  styleName: string;
}

export interface StyleScore {
  styleName: string;
  totalScore: number;
  responseCount: number;
  averageScore: number;
}

export interface AppState {
  user: User | null;
  questionnaireResponses: QuestionnaireResponse[];
  styleScores: StyleScore[];
  currentQuestionnaireBlock: number;
  isOnboardingCompleted: boolean;
}

// Tipos para las acciones
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGIN_USER'; payload: { email: string } }
  | { type: 'LOGOUT_USER' }
  | { type: 'ADD_QUESTIONNAIRE_RESPONSE'; payload: QuestionnaireResponse }
  | { type: 'SET_QUESTIONNAIRE_RESPONSES'; payload: QuestionnaireResponse[] }
  | { type: 'UPDATE_STYLE_SCORES'; payload: StyleScore[] }
  | { type: 'SET_CURRENT_BLOCK'; payload: number }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET_APP' };

// Estado inicial
const initialState: AppState = {
  user: null,
  questionnaireResponses: [],
  styleScores: [],
  currentQuestionnaireBlock: 1,
  isOnboardingCompleted: false,
};

// Función para calcular puntuaciones por estilo
const calculateStyleScores = (responses: QuestionnaireResponse[]): StyleScore[] => {
  const scoreMap = new Map<string, { total: number; count: number }>();
  
  responses.forEach(response => {
    const current = scoreMap.get(response.styleName) || { total: 0, count: 0 };
    scoreMap.set(response.styleName, {
      total: current.total + response.response,
      count: current.count + 1
    });
  });
  
  return Array.from(scoreMap.entries()).map(([styleName, { total, count }]) => ({
    styleName,
    totalScore: total,
    responseCount: count,
    averageScore: Number((total / count).toFixed(2))
  })).sort((a, b) => b.averageScore - a.averageScore);
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    
    case 'LOGIN_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, isLoggedIn: true } : null,
      };
    
    case 'LOGOUT_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, isLoggedIn: false } : null,
      };
    
    case 'ADD_QUESTIONNAIRE_RESPONSE':
      const existingIndex = state.questionnaireResponses.findIndex(
        r => r.questionId === action.payload.questionId
      );
      
      let updatedResponses: QuestionnaireResponse[];
      if (existingIndex >= 0) {
        // Actualizar respuesta existente
        updatedResponses = [...state.questionnaireResponses];
        updatedResponses[existingIndex] = action.payload;
      } else {
        // Agregar nueva respuesta
        updatedResponses = [...state.questionnaireResponses, action.payload];
      }
      
      // Calcular las puntuaciones actualizadas
      const updatedStyleScores = calculateStyleScores(updatedResponses);
      
      return {
        ...state,
        questionnaireResponses: updatedResponses,
        styleScores: updatedStyleScores,
      };
    
    case 'SET_QUESTIONNAIRE_RESPONSES':
      const newStyleScores = calculateStyleScores(action.payload);
      return {
        ...state,
        questionnaireResponses: action.payload,
        styleScores: newStyleScores,
      };
    
    case 'UPDATE_STYLE_SCORES':
      return {
        ...state,
        styleScores: action.payload,
      };
    
    case 'SET_CURRENT_BLOCK':
      return {
        ...state,
        currentQuestionnaireBlock: action.payload,
      };
    
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        isOnboardingCompleted: true,
      };
    
    case 'RESET_APP':
      return initialState;
    
    default:
      return state;
  }
}

// Contexto
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe ser usado dentro de AppProvider');
  }
  return context;
}

// Funciones helper para trabajar con puntuaciones
export const getTopStyles = (styleScores: StyleScore[], minScore: number = 3, limit: number = 5): StyleScore[] => {
  return styleScores
    .filter(style => style.averageScore >= minScore)
    .slice(0, limit);
};

export const getStyleByName = (styleScores: StyleScore[], styleName: string): StyleScore | undefined => {
  return styleScores.find(style => style.styleName === styleName);
};

export const getStyleRanking = (styleScores: StyleScore[]): StyleScore[] => {
  return [...styleScores].sort((a, b) => b.averageScore - a.averageScore);
}; 