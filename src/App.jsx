import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ThemeHandler from "./Components/ThemeHandler";
function App() {

  return (
    <BrowserRouter>
    <ThemeHandler />
      <Routing />
    </BrowserRouter>
  );
}

export default App;