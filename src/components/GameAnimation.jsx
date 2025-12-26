import { useEffect, useState } from 'react';
import SVGAnimation from './SVGAnimation';
import { useLottieAnimations } from '../hooks/useLottieAnimations';
import './GameAnimation.css';

const GameAnimation = ({ 
  type, 
  trigger, 
  onComplete, 
  className = '', 
  width = '200px', 
  height = '200px',
  autoPlay = true 
}) => {
  const { getAnimation, loadAnimation, preloadAnimations } = useLottieAnimations();
  const [animationPath, setAnimationPath] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mapeo de tipos de animación a archivos SVG
  const animationMap = {
    // Revelación
    'impostor-reveal': 'IMPACTOR_REVEAL',
    'word-reveal': 'WORD_REVEAL',
    'mystery-reveal': 'WORD_REVEAL',
    
    // Celebración
    'victory': 'VICTORY',
    'confetti': 'CONFETTI',
    'fireworks': 'FIREWORKS',
    'celebration': 'CONFETTI',
    
    // Loading
    'loading': 'LOADING_SPINNER',
    'thinking': 'THINKING',
    'searching': 'LOADING_SPINNER',
    
    // UI
    'button-click': 'BUTTON_CLICK',
    'card-flip': 'CARD_FLIP',
    'success': 'SUCCESS',
    'error': 'ERROR',
    'warning': 'SUCCESS',
    
    // Temáticos
    'detective': 'DETECTIVE',
    'spy': 'SPY',
    'mystery': 'MYSTERY',
    'shadow': 'SPY',
    'magnifying-glass': 'DETECTIVE',
    
    // Acciones
    'running': 'LOADING_SPINNER',
    'hiding': 'MYSTERY',
    'searching-player': 'LOADING_SPINNER',
    'found': 'SUCCESS',
  };

  useEffect(() => {
    // Precargar animaciones básicas al montar el componente
    preloadAnimations();
  }, [preloadAnimations]);

  useEffect(() => {
    const animationKey = animationMap[type];
    if (!animationKey) return;

    const loadAndSetAnimation = async () => {
      try {
        const path = await loadAnimation(animationKey);
        setAnimationPath(path);
      } catch (error) {
        console.error(`Error loading animation ${type}:`, error);
      }
    };

    loadAndSetAnimation();
  }, [type, loadAnimation]);

  useEffect(() => {
    if (trigger && animationPath && autoPlay) {
      setIsPlaying(true);
    }
  }, [trigger, animationPath, autoPlay]);

  const handleAnimationComplete = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!animationPath) {
    return (
      <div 
        className={`game-animation game-animation--loading ${className}`}
        style={{ width, height }}
      >
        <div className="game-animation__placeholder">
          <div className="game-animation__spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`game-animation game-animation--${type} ${className}`}>
      <SVGAnimation
        animationPath={animationPath}
        loop={type === 'loading' || type === 'thinking' || type === 'confetti'}
        autoplay={isPlaying}
        width={width}
        height={height}
        onComplete={handleAnimationComplete}
        trigger={trigger}
        className={`game-animation__svg`}
      />
    </div>
  );
};

export default GameAnimation;
