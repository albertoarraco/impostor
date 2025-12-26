import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RevealFlow from '../../src/features/lobby/reveal-flow';

const baseProps = {
  currentPlayer: { name: 'Ana', role: 'Impostor' },
  revealed: false,
  onReveal: vi.fn(),
  onNext: vi.fn(),
  isLast: false,
};

describe('RevealFlow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('muestra estado oculto y permite revelar', () => {
    render(<RevealFlow {...baseProps} />);
    expect(screen.getByText(/Solo el jugador actual debe mirar/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /Mostrar palabra/i });
    expect(btn).toBeEnabled();

    act(() => {
      fireEvent.click(btn);
    });

    expect(baseProps.onReveal).toHaveBeenCalled();
    // avanza timers para limpiar flags
    act(() => {
      vi.runAllTimers();
    });
  });

  it('renderiza vista revelada e invoca onNext', () => {
    render(<RevealFlow {...baseProps} revealed={true} />);
    expect(screen.getByText(/Impostor/i)).toBeInTheDocument();
    const nextBtn = screen.getByRole('button', { name: /Siguiente jugador/i });
    fireEvent.click(nextBtn);
    expect(baseProps.onNext).toHaveBeenCalled();
  });

  it('usa etiqueta de último cuando es el último jugador', () => {
    render(<RevealFlow {...baseProps} revealed={true} isLast={true} />);
    expect(screen.getByText(/Último/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Empezar partida/i })).toBeInTheDocument();
  });
});
