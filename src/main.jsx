import { createRoot } from 'react-dom/client'
import './index.css'
import Routing from './Routing'
import { BrowserRouter } from "react-router-dom";
import { store } from './redux/Store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
<Provider store={store}>
<BrowserRouter>
  <Routing/>
</BrowserRouter>
  </Provider>
)
