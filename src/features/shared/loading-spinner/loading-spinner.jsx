import React from 'react';
import './loading-spinner.css';

function LoadingSpinner({ message = "Cargando...", variant = "bounce" }) {
  const getContainerClass = () => {
    const baseClass = "loading-container";
    return variant !== "bounce" ? `${baseClass} ${variant}` : baseClass;
  };

  const getSpinnerMarkup = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
        );
      case "wheel":
        return (
          <div className="spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
        );
      default: // bounce
        return (
          <div className="spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
        );
    }
  };

  return (
    <div className="panel">
      <div className={getContainerClass()}>
        {getSpinnerMarkup()}
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
