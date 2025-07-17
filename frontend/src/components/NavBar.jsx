import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {useTask} from "../context/TaskContext";

import TaskStatsModal from './TaskStatsModal';




function NavBar() {

  const {user, logout, profileImage} = useAuth();
  const {tasks} = useTask();
  const [showStatsModal, setShowStatsModal] = useState(false)

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login")
  }

  return (

    <>
         <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-400">
        TODO APP
      </Link>

      <div className="flex gap-4 items-center">
        {user && (
          <>

          {/* boton para el reporte en excel */}

          {/* boton para mostrar estadisticas */}
            <button
                onClick={() => setShowStatsModal(true)}
                className="bg-purple-500 hover:bg-purple-600 px-3 py-2 rounded text-sm flex items-center gap-2"
                title="Ver estadísticas"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">Stats</span>
              </button>


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

        {/* modal de estadisticas */}

        {
          showStatsModal && (
            <TaskStatsModal
            tasks={tasks}
            onClose={() => setShowStatsModal(false)}
            >

            </TaskStatsModal>
          )
        }

    </>
   

        /* MODAL de estadisticas */

  )
}

export default NavBar