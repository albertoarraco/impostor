import { useMemo } from "react";
import categories from "../../data/words";

function useGameDerived({ names, impostors, randomImpostors, customCategories, extraWords }) {
  const baseLabels = useMemo(
    () => ({
      basicas: "Básicas",
      viajes: "Viajes",
      comida: "Comida",
      tecnologia: "Tecnología",
      acciones: "Acciones",
      series: "Series y pelis",
      animales: "Animales",
      profesiones: "Profesiones",
      deportes: "Deportes",
      instrumentos: "Instrumentos",
    }),
    []
  );

  const availableCategories = useMemo(() => {
    const merged = { ...categories };
    Object.entries(customCategories).forEach(([key, words]) => {
      merged[key] = words || [];
    });
    Object.entries(extraWords).forEach(([key, words]) => {
      merged[key] = [...(merged[key] || []), ...(words || [])];
    });
    return merged;
  }, [customCategories, extraWords]);

  const categoryLabels = useMemo(() => {
    const custom = Object.keys(customCategories).reduce((acc, key) => {
      acc[key] = key;
      return acc;
    }, {});
    return { ...baseLabels, ...custom };
  }, [baseLabels, customCategories]);

  const baseWordCounts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(categories).map(([k, v]) => [k, v.length || 0])
      ),
    []
  );

  const baseCategoryOptions = useMemo(() => {
    const baseKeys = Object.keys(categories);
    const options = baseKeys.map((key) => ({
      key,
      label: baseLabels[key] || key,
    }));
    options.push({ key: "random", label: "Aleatorio" });
    return options;
  }, [baseLabels]);

  const customCategoryOptions = useMemo(() => {
    const customKeys = Object.keys(customCategories);
    return customKeys.map((key) => ({
      key,
      label: baseLabels[key] || key,
    }));
  }, [baseLabels, customCategories]);

  const allWords = useMemo(
    () => Object.values(availableCategories).flat(),
    [availableCategories]
  );

  const cleanNames = useMemo(
    () => names.map((n) => n.trim()).filter((n) => n.length > 0),
    [names]
  );
  const maxImpostors = Math.max(1, cleanNames.length - 1);
  const safeImpostors = Math.min(impostors, maxImpostors);
  const canStart = useMemo(
    () => cleanNames.length > 1 && safeImpostors > 0,
    [cleanNames, safeImpostors]
  );

  return {
    baseLabels,
    availableCategories,
    categoryLabels,
    baseWordCounts,
    baseCategoryOptions,
    customCategoryOptions,
    allWords,
    cleanNames,
    maxImpostors,
    safeImpostors,
    canStart,
  };
}

export default useGameDerived;
