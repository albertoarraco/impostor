import { useState, useCallback } from 'react';

// Import dinámicos de los archivos SVG
const loadSVG = (name) => {
  const svgModules = {
    'IMPACTOR_REVEAL': () => import('../assets/animations/impostor.svg'),
    'WORD_REVEAL': () => import('../assets/animations/word-reveal.svg'),
    'ALLY_REVEAL': () => import('../assets/animations/ally-green.svg'),
    'VICTORY': () => import('../assets/animations/success.svg'),
    'CONFETTI': () => import('../assets/animations/confetti.svg'),
    'FIREWORKS': () => import('../assets/animations/confetti.svg'),
    'LOADING_SPINNER': () => import('../assets/animations/loading.svg'),
    'THINKING': () => import('../assets/animations/loading.svg'),
    'BUTTON_CLICK': () => import('../assets/animations/success.svg'),
    'CARD_FLIP': () => import('../assets/animations/word-reveal.svg'),
    'SUCCESS': () => import('../assets/animations/success.svg'),
    'ERROR': () => import('../assets/animations/impostor.svg'),
    'DETECTIVE': () => import('../assets/animations/word-reveal.svg'),
    'SPY': () => import('../assets/animations/impostor.svg'),
    'MYSTERY': () => import('../assets/animations/loading.svg'),
  };
  
  return svgModules[name];
};

export const useLottieAnimations = () => {
  const [loadedAnimations, setLoadedAnimations] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Cargar animación dinámicamente
  const loadAnimation = useCallback(async (animationName) => {
    if (loadedAnimations[animationName]) {
      return loadedAnimations[animationName];
    }

    setIsLoading(true);
    
    try {
      const svgLoader = loadSVG(animationName);
      if (!svgLoader) {
        console.warn(`Animation ${animationName} not found`);
        return null;
      }
      
      const svgModule = await svgLoader();
      const svgPath = svgModule.default;
      
      setLoadedAnimations(prev => ({
        ...prev,
        [animationName]: svgPath
      }));
      
      return svgPath;
    } catch (error) {
      console.error(`Error loading animation ${animationName}:`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadedAnimations]);

  // Precargar todas las animaciones
  const preloadAnimations = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const animationNames = [
        'IMPACTOR_REVEAL', 'WORD_REVEAL', 'ALLY_REVEAL', 'VICTORY', 'CONFETTI',
        'LOADING_SPINNER', 'SUCCESS', 'ERROR'
      ];
      
      const loadPromises = animationNames.map(name => loadAnimation(name));
      await Promise.allSettled(loadPromises);
    } catch (error) {
      console.error('Error preloading animations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadAnimation]);

  // Obtener animación específica
  const getAnimation = useCallback((animationName) => {
    return loadedAnimations[animationName] || null;
  }, [loadedAnimations]);

  // Animaciones para diferentes estados del juego
  const getRevealAnimation = useCallback((isImpostor) => {
    return isImpostor ? getAnimation('IMPACTOR_REVEAL') : getAnimation('WORD_REVEAL');
  }, [getAnimation]);

  const getVictoryAnimation = useCallback(() => {
    return getAnimation('VICTORY') || getAnimation('CONFETTI') || getAnimation('FIREWORKS');
  }, [getAnimation]);

  const getLoadingAnimation = useCallback(() => {
    return getAnimation('LOADING_SPINNER') || getAnimation('THINKING');
  }, [getAnimation]);

  const getClickAnimation = useCallback(() => {
    return getAnimation('BUTTON_CLICK');
  }, [getAnimation]);

  const getSuccessAnimation = useCallback(() => {
    return getAnimation('SUCCESS');
  }, [getAnimation]);

  const getErrorAnimation = useCallback(() => {
    return getAnimation('ERROR');
  }, [getAnimation]);

  return {
    loadedAnimations,
    isLoading,
    loadAnimation,
    preloadAnimations,
    getAnimation,
    getRevealAnimation,
    getVictoryAnimation,
    getLoadingAnimation,
    getClickAnimation,
    getSuccessAnimation,
    getErrorAnimation,
  };
};

export default useLottieAnimations;
