import {useState}  from "react";

const API = "http://localhost:4000/api/v1"

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null);
    setError(null);

    const res = await fetch(`${API}/request-password-reset`, {
      method: "POST", 
      headers: {"Content-type" : "Application/json"},
      body:JSON.stringify({email})
    })


    const data = await res.json();

    if(res.ok) {
      setMessage(data.message || "Email enviado!")
    } else {
      setError(data.message || "Error :(")
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Recuperar contraseña</h2>

        <input
          type="email"
          placeholder="Tu email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Enviar instrucciones
        </button>

        {message && <p className="text-green-600 mt-3">{message}</p>}
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </form>
    </div>
  )
}

export default ForgotPassword