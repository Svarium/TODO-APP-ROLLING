import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <AuthProvider>
        {/* TaskProvider */}
            <App />
            <Toaster position="top-right" reverseOrder={false}/>
        {/* TaskProvider */}
      </AuthProvider>          
    </BrowserRouter>   
,
)
