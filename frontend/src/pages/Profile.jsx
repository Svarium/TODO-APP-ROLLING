import React from 'react'
import { useAuth } from '../context/AuthContext'
import UpdateProfileImage from "../components/UpdateProfileImage"


function Profile() {

  const {user, profileImage} = useAuth();

  console.log(profileImage);  

  return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Perfil de Usuario</h2>

      <div className="flex flex-col items-center gap-4">
        {profileImage && (
          <img
            src={profileImage}
            alt="Imagen de perfil"
            className="w-32 h-32  object-cover shadow rounded-2xl"
          />
        )}
        <p><strong>Usuario:</strong> {user?.username}</p>
        <small><strong>Email:</strong> {user?.email}</small>
      </div>

      <div className="mt-6 bg-blue-100 p-2 rounded-2xl">
        <h3 className="text-lg font-semibold mb-2">Actualizar Imagen de Perfil</h3>
        <UpdateProfileImage />
      </div>
    </div>
  )
}

export default Profile