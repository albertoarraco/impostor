import { useEffect, useRef, useState } from 'react';
import './SVGAnimation.css';

const SVGAnimation = ({ 
  animationPath, 
  loop = true, 
  autoplay = true, 
  className = '', 
  width = '100px', 
  height = '100px',
  onComplete,
  trigger 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    if (trigger && autoplay) {
      setIsPlaying(true);
      // Reiniciar la animación SVG
      if (svgRef.current) {
        const svg = svgRef.current;
        svg.style.display = 'none';
        setTimeout(() => {
          svg.style.display = 'block';
        }, 10);
      }
    }
  }, [trigger, autoplay]);

  const handleAnimationEnd = () => {
    setIsPlaying(false);
    if (onComplete && !loop) {
      onComplete();
    }
  };

  const handleError = () => {
    setHasError(true);
    console.warn(`Failed to load animation: ${animationPath}`);
  };

  if (hasError) {
    return (
      <div 
        className={`svg-animation svg-animation--error ${className}`}
        style={{ width, height }}
      >
        <div className="svg-animation__fallback">
          <div className="svg-animation__spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`svg-animation ${className}`}
      style={{ width, height }}
    >
      <img
        ref={svgRef}
        src={animationPath}
        alt="Animation"
        className={`svg-animation__image ${isPlaying ? 'playing' : ''}`}
        onLoad={handleAnimationEnd}
        onError={handleError}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default SVGAnimation;
