import React from 'react';
import { useAppContext, getBlockProgress } from '@/contexts/AppContext';
import OnboardingDashboard from './onboarding-dashboard';
import MainDashboard from './main-dashboard';

export default function HomeScreen() {
  const { state } = useAppContext();
  
  // Verificar el progreso del usuario
  const blockProgress = getBlockProgress(state);
  const allBlocksComplete = blockProgress.block1Complete && 
                          blockProgress.block2Complete && 
                          blockProgress.block3Complete;
  
  // Determinar si el usuario es nuevo o ya completó el onboarding
  const hasStartedOnboarding = blockProgress.block1Complete || 
                              state.questionnaireResponses.length > 0;
  
  // Lógica de ruteo:
  // 1. Si completó todos los bloques -> Dashboard principal
  // 2. Si no ha completado pero ya empezó -> Dashboard de onboarding
  // 3. Si es completamente nuevo -> Dashboard de onboarding
  
  if (allBlocksComplete) {
    // Usuario completó todo el onboarding -> Dashboard principal
    return <MainDashboard />;
  } else {
    // Usuario en proceso de onboarding o nuevo -> Dashboard de progreso
    return <OnboardingDashboard />;
  }
} 