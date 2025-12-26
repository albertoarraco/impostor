import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import './LottieAnimation.css';

const LottieAnimation = ({ 
  animationData, 
  loop = true, 
  autoplay = true, 
  className = '', 
  width = '100%', 
  height = '100%',
  speed = 1,
  onComplete,
  onLoopComplete 
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    // Limpiar animación anterior si existe
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    // Crear nueva animación
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        progressiveLoad: true,
        hideOnTransparent: true,
      }
    });

    // Configurar velocidad
    animationRef.current.setSpeed(speed);

    // Event listeners
    if (onComplete) {
      animationRef.current.addEventListener('complete', onComplete);
    }
    
    if (onLoopComplete) {
      animationRef.current.addEventListener('loopComplete', onLoopComplete);
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.removeEventListener('complete', onComplete);
        animationRef.current.removeEventListener('loopComplete', onLoopComplete);
        animationRef.current.destroy();
      }
    };
  }, [animationData, loop, autoplay, speed, onComplete, onLoopComplete]);

  // Métodos de control
  const play = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  const pause = () => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const stop = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  const goToFrame = (frame) => {
    if (animationRef.current) {
      animationRef.current.goToAndStop(frame, true);
    }
  };

  // Exponer métodos al componente
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.play = play;
      containerRef.current.pause = pause;
      containerRef.current.stop = stop;
      containerRef.current.goToFrame = goToFrame;
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`lottie-animation ${className}`}
      style={{ width, height }}
      data-testid="lottie-animation"
    />
  );
};

export default LottieAnimation;
