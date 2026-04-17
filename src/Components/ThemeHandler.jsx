import { useEffect } from "react";
import { useSelector } from "react-redux";

function ThemeHandler() {
  const darkMode = useSelector((state) => state.theme.darkmode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return null;
}

export default ThemeHandler;