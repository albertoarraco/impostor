import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import SVGAnimation from '../../src/components/SVGAnimation';

describe('SVGAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('dispara animación al recibir trigger y limpia bandera', () => {
    const { getByAltText } = render(
      <SVGAnimation animationPath="/anim.svg" trigger autoplay />
    );

    const img = getByAltText('Animation');
    expect(img.className).toContain('playing');

    // simulate load to finish animation
    act(() => {
      fireEvent.load(img);
    });
    expect(img.className).not.toContain('playing');
  });

  it('ejecuta onComplete cuando no hay loop y maneja error mostrando fallback', () => {
    const onComplete = vi.fn();
    const { getByAltText, rerender, container } = render(
      <SVGAnimation animationPath="/anim.svg" trigger autoplay loop={false} onComplete={onComplete} />
    );

    const img = getByAltText('Animation');
    act(() => {
      fireEvent.load(img);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);

    // provoke error
    act(() => {
      fireEvent.error(img);
    });

    // Rerender to reflect error state
    rerender(
      <SVGAnimation animationPath="/anim.svg" trigger={false} autoplay={false} loop={false} onComplete={onComplete} />
    );
    expect(container.querySelector('.svg-animation__fallback')).toBeInTheDocument();
    expect(container.querySelector('.svg-animation__spinner')).toBeInTheDocument();
  });
});
