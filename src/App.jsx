import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const darkMode = useSelector((state) => state.theme.darkmode);

useEffect(() => {
  document.documentElement.classList.toggle("dark", darkMode);
}, [darkMode]);

  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default App;