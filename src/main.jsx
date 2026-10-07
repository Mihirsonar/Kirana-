import { createRoot } from 'react-dom/client'
import './index.css'
import Routing from './Routing'
import { BrowserRouter } from "react-router-dom";
import { store } from './redux/Store'
import { Provider } from 'react-redux'
import { setCartItems } from './redux/Slice/CartSlice';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
)
