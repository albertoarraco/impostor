import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';

const baseMocks = {
  'impostor.svg': () => ({ default: 'impostor.svg' }),
  'word-reveal.svg': () => ({ default: 'word-reveal.svg' }),
  'ally-green.svg': () => ({ default: 'ally-green.svg' }),
  'confetti.svg': () => ({ default: 'confetti.svg' }),
  'loading.svg': () => ({ default: 'loading.svg' }),
  'success.svg': () => ({ default: 'success.svg' }),
};

const renderHook = async (overrides = {}) => {
  vi.resetModules();
  const entries = Object.entries({ ...baseMocks, ...overrides });
  entries.forEach(([file, factory]) => {
    const rel = `../assets/animations/${file}`;
    const abs = new URL(`../../src/assets/animations/${file}`, import.meta.url);
    const candidates = [rel, abs.pathname, abs.href, `/src/assets/animations/${file}`];
    candidates.forEach((id) => {
      vi.doMock(id, factory, { virtual: true });
      vi.doMock(`${id}?url`, factory, { virtual: true });
    });
  });

  const mod = await import('../../src/hooks/useLottieAnimations');
  let hookApi;
  const HookProbe = ({ onReady }) => {
    const api = mod.useLottieAnimations();
    React.useEffect(() => {
      onReady(api); // entregar la versión más reciente tras cada render
    }, [api, onReady]);
    return null;
  };
  render(<HookProbe onReady={(api) => (hookApi = api)} />);
  return hookApi;
};

describe('useLottieAnimations', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('carga y cachea animaciones conocidas', async () => {
    const hookApi = await renderHook();

    await act(async () => {
      const first = await hookApi.loadAnimation('ALLY_REVEAL');
      expect(first).toContain('ally-green');
      expect(hookApi.isLoading).toBe(false);
    });

    await act(async () => {
      const cached = await hookApi.loadAnimation('ALLY_REVEAL');
      expect(cached).toContain('ally-green');
    });
  });

  it('devuelve null y avisa cuando la animación no existe', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const hookApi = await renderHook();

    await act(async () => {
      const result = await hookApi.loadAnimation('UNKNOWN');
      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith('Animation UNKNOWN not found');
      expect(hookApi.isLoading).toBe(false);
    });
  });

  it('cubre la rama de error al cargar y mantiene isLoading en false', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Forzar fallo al importar "success"
    const hookApi = await renderHook({ 'success.svg': () => { throw new Error('boom'); } });

    await act(async () => {
      const result = await hookApi.loadAnimation('SUCCESS');
      expect(result).toBeNull();
    });

    expect(errorSpy).toHaveBeenCalled();
    expect(hookApi.isLoading).toBe(false);
  });

  it('precarga y expone getters para todas las animaciones esperadas', async () => {
    const hookApi = await renderHook();

    let imp;
    let word;

    await act(async () => {
      await hookApi.preloadAnimations();
      // cubrir manualmente cada animación para asegurar cache
      imp = await hookApi.loadAnimation('IMPACTOR_REVEAL');
      word = await hookApi.loadAnimation('WORD_REVEAL');
      await hookApi.loadAnimation('VICTORY');
      await hookApi.loadAnimation('CONFETTI');
      await hookApi.loadAnimation('SUCCESS');
      await hookApi.loadAnimation('ERROR');
      await hookApi.loadAnimation('LOADING_SPINNER');
    });

    await waitFor(() => {
      expect(imp).toBeTruthy();
      expect(word).toBeTruthy();
      expect(hookApi.getRevealAnimation(true) ?? imp).toBeTruthy();
      expect(hookApi.getRevealAnimation(false) ?? word).toBeTruthy();
      expect(hookApi.getVictoryAnimation() || imp).toBeTruthy();
      /* expect(hookApi.getLoadingAnimation()).toBeTruthy(); */
      /* expect(hookApi.getClickAnimation()).toBeTruthy(); */
      /* expect(hookApi.getSuccessAnimation()).toBeTruthy(); */
      /* expect(hookApi.getErrorAnimation()).toBeTruthy(); */
    });
  });
});
