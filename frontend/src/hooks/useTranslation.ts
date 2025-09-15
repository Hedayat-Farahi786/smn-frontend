import { useState, useEffect } from "react";
import { t, addLanguageChangeListener, getLanguage } from "../i18n";

export const useTranslation = () => {
  const [, setForceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = addLanguageChangeListener(() => {
      setForceUpdate({});
    });

    return unsubscribe;
  }, []);

  return {
    t,
    currentLanguage: getLanguage(),
  };
};
