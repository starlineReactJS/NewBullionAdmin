import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { AuthProvider } from './context/AuthContext.jsx';
import "../src/assets/css/global.css"

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider><App /></AuthProvider>
  </Provider>
);
