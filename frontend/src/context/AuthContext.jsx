import {createContext, useContext, useState, useEffect} from 'react';
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

const [user, setUser] = useState(null);
const [profileImage, setProfileImage] = useState(null);
const [loading, setLoading] = useState(true);

const getToken = () => localStorage.getItem("token");

const register = async (userData) =>{
    return await authService.register(userData)
}

const login = async (credentials) => {
    const {token, user} = await authService.login(credentials);
    console.log("Login OK - Token", token);
    localStorage.setItem("token", token)
    setUser(user);
    await getProfile(); // cargar la imagen y el perfil actualizado    
}

const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfileImage(null);
    await fetch("http://localhost:4000/api/v1/logout", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
}

const getProfile = async () => {
    const token = getToken();

    if(!token){
        console.log("No hay token en getProfile!");
        return        
    }

    const data = await authService.profile()

    setUser(data)

    //si hay una imagen, armar la URL para mostrarla en el navegador
    if(data.profileImage){
        setProfileImage(`http://localhost:4000${data.profileImage}`)
    }
}

//useEffect que solo se ejecuta si hay un token ya guardado
useEffect(() => {
        const token = getToken()
        console.log("Token al iniciar");

        if(!token){
            setLoading(false);
            return
        }

        const init = async () => {
            try {
                const valid = await authService.verifyToken();
                console.log("token valido: ", valid);
                if(valid){
                    await getProfile()
                } else {
                    logout()
                }                
            } catch (error) {
                console.log("error al verificar token:", error);
                logout()               
            } finally {
                setLoading(false);
            }
        };

        init()

}, []);

    return (
        <AuthContext.Provider
        value={{
            user,
            login,
            register, 
            logout,
            profileImage,
            getProfile,
            loading
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

