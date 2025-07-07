import React from 'react'
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";



function NavBar() {

  const {user, logout, profileImage} = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login")
  }

  return (
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-400">
        TODO APP
      </Link>

      <div className="flex gap-4 items-center">
        {user && (
          <>
            <span className="text-sm hidden sm:block">
              Bienvenido, <strong>{user.username}</strong>
            </span>
            {profileImage && (
            <Link to="/profile" >
              <img
                src={profileImage}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
            )}           
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar