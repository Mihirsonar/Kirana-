import { createRoot } from 'react-dom/client'
import './index.css'
import Routing from './Routing'
import { BrowserRouter } from "react-router-dom";
import { store } from './redux/Store'
import { Provider } from 'react-redux'
import { setCartItems } from './redux/Slice/CartSlice';


// const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
// store.dispatch(setCartItems(cartItems));

createRoot(document.getElementById('root')).render(
<Provider store={store}>
<BrowserRouter>
  <Routing/>
</BrowserRouter>
  </Provider>
)
