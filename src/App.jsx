import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import ThemeHandler from "./Components/ThemeHandler";
import OfflineBanner from "./Components/PWA/OfflineBanner";
import InstallPrompt from "./Components/PWA/InstallPrompt";
import UpdatePrompt from "./Components/PWA/UpdatePrompt";

function App() {
  return (
    <BrowserRouter>
      <ThemeHandler />
      <OfflineBanner />
      <Routing />
      <InstallPrompt />
      <UpdatePrompt />
    </BrowserRouter>
  );
}

export default App;