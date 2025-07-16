import {useState} from "react";
import {useTask} from "../context/TaskContext";
import {toast} from "react-hot-toast";

function EditTaskModal({task, onClose}) {

  const {updateTask} = useTask();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate.split("T")[0]);
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dueDate", dueDate);

    for (let file of files){
      formData.append("files", file)
    }


    try {
      await updateTask(task._id, formData)
      toast.success("Tarea actualizada correctamente!!!")
      onClose()      
    } catch (error) {
      console.log(error);
      toast.error("❌ Error al actualizar la tarea")      
    } 
  }


  return (
      <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Tarea</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
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
            name="files"
            onChange={(e) => setFiles(e.target.files)}
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTaskModal