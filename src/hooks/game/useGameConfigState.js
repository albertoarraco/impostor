import { useState } from "react";

function useGameConfigState() {
  const [step, setStep] = useState("home");
  const [configTab, setConfigTab] = useState("game"); // game | words | transfer
  const [names, setNames] = useState([""]);
  const [impostors, setImpostors] = useState(1);
  const [randomImpostors, setRandomImpostors] = useState(false);
  const [wordCategory, setWordCategory] = useState("basicas");
  const [customCategories, setCustomCategories] = useState({});
  const [extraWords, setExtraWords] = useState({});
  const [importError, setImportError] = useState("");

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
