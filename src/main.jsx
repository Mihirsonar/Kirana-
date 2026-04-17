import { createRoot } from 'react-dom/client'
import './index.css'
import Routing from './Routing'
import { BrowserRouter } from "react-router-dom";
import { store } from './redux/Store'
import { Provider } from 'react-redux'
import { setCartItems } from './redux/Slice/CartSlice';
import App from './App';
import ThemeHandler from './Components/ThemeHandler';

createRoot(document.getElementById('root')).render(
<Provider store={store}>
<ThemeHandler />
<App/>
  </Provider>
)
