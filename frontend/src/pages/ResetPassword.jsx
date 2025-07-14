import {useState} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API = "http://localhost:4000/api/v1"

function ResetPassword() {

  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null);
    setError(null);

    const res = await fetch(`${API}/reset-password/${token}`, {
      method: "POST", 
      headers: {"Content-type" : "Application/json"},
      body:JSON.stringify({newPassword:password})
    })

    const data = await res.json();

    
    if(res.ok) {
      setMessage(data.message || "Contraseña Actualizada!!! ")
      setTimeout(() => {
        navigate("/login")
      }, 2500);
    } else {
      setError(data.message || "Error al actualizar la contraseña")
    }

  }


  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Nueva contraseña</h2>

        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full p-2 border mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Cambiar contraseña
        </button>

        {message && <p className="text-green-600 mt-3">{message}</p>}
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </form>
    </div>
  )
}

export default ResetPassword