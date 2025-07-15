import { useState } from "react";
import {useTask} from "../context/TaskContext";
import {toast} from "react-hot-toast";

function TaskForm() {

  const {addTask} = useTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append("title", title)
    formData.append("description", description)
    formData.append("dueDate", dueDate)

    for (let i = 0; i < files.length; i++){
      formData.append("files", files[i]);
    }

    try {
      await addTask(formData);
      setTitle("");
      setDescription("");
      setDueDate("");
      setFiles([]);
      toast.success("✅ Tarea creada con éxito!!!! ")
    } catch (error) {
      console.log("Error el crear la tarea: ", error.response?.data?.message || error.message);
      const data = error.response?.data;
      if(Array.isArray(data?.error)){
        data.error.forEach(msg => toast.error(msg));
      } else if ( data?.message){
        toast.error(data.message)
      }  else {
        toast.error("Error al crear la tarea")
      }     
    }
  }




  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold">Nueva Tarea</h2>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            name="files" // 👈 importante
            className="w-full p-2 border rounded"
            />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear Tarea
      </button>
    </form>
  )
}

export default TaskForm