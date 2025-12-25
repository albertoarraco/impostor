import { useEffect, useState } from "react";

const ALLOWED_STEPS = ["home", "lobby", "config", "history"];

function useGameConfigState() {
  const [step, setStep] = useState(() => {
    if (typeof window === "undefined") return "home";
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step");
    return ALLOWED_STEPS.includes(stepParam) ? stepParam : "home";
  });
  const [configTab, setConfigTab] = useState("game"); // game | words | transfer
  const [names, setNames] = useState([""]);
  const [impostors, setImpostors] = useState(1);
  const [randomImpostors, setRandomImpostors] = useState(false);
  const [wordCategory, setWordCategory] = useState("basicas");
  const [customCategories, setCustomCategories] = useState({});
  const [extraWords, setExtraWords] = useState({});
  const [importError, setImportError] = useState("");

  // Sincroniza step en URL y limpia tab previo
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (ALLOWED_STEPS.includes(step)) {
      url.searchParams.set("step", step);
    } else {
      url.searchParams.delete("step");
    }
    url.searchParams.delete("tab");
    window.history.replaceState({}, "", url.toString());
  }, [step]);

  return {
    step,
    setStep,
    configTab,
    setConfigTab,
    names,
    setNames,
    impostors,
    setImpostors,
    randomImpostors,
    setRandomImpostors,
    wordCategory,
    setWordCategory,
    customCategories,
    setCustomCategories,
    extraWords,
    setExtraWords,
    importError,
    setImportError,
  };
}

export default useGameConfigState;
