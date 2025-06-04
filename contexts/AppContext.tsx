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

export interface AppState {
  user: User | null;
  questionnaireResponses: QuestionnaireResponse[];
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
  | { type: 'SET_CURRENT_BLOCK'; payload: number }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET_APP' };

// Estado inicial
const initialState: AppState = {
  user: null,
  questionnaireResponses: [],
  currentQuestionnaireBlock: 1,
  isOnboardingCompleted: false,
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
      
      if (existingIndex >= 0) {
        // Actualizar respuesta existente
        const updatedResponses = [...state.questionnaireResponses];
        updatedResponses[existingIndex] = action.payload;
        return {
          ...state,
          questionnaireResponses: updatedResponses,
        };
      } else {
        // Agregar nueva respuesta
        return {
          ...state,
          questionnaireResponses: [...state.questionnaireResponses, action.payload],
        };
      }
    
    case 'SET_QUESTIONNAIRE_RESPONSES':
      return {
        ...state,
        questionnaireResponses: action.payload,
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