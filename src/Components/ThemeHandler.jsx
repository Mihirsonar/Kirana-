import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../redux/Slice/ThemeSlice";

function ThemeHandler() {
  const darkMode = useSelector((state) => state.theme.darkmode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "theme" && e.newValue) {
        dispatch(setTheme(e.newValue === "dark"));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  return null;
}

export default ThemeHandler;