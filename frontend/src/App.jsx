import {Route, Routes, Navigate} from 'react-router-dom';
import NavBar from './components/NavBar';
import { useAuth } from './context/AuthContext';
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import VerifyEmail from "./pages/VerifyEmail"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

function App() {

  const {user, loading} = useAuth();

  if(loading) {
    return(
       <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando...</p>
      </div>
    )
  }
  

  return (
    <>
      <NavBar/> 
      <Routes>
        <Route path='/' element={user? <Home /> : <Navigate to="/login"/>}/>       
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={user? <Profile /> : <Navigate to="/login"/>}/>
        <Route path='/verify-email' element={<VerifyEmail/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
      </Routes>
    </>
  )
}

export default App
