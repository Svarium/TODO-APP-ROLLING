import { createContext, useContext, useState, useEffect } from "react";
import * as taskService from '../services/taskService';

const TaskContext = createContext();

export const TaskProvider = ({children}) => {

    const [tasks, setTasks] = useState([]);
    const [loadingTask, setLoadingTask] = useState(true);


    const fetchTasks = async () => {
        try {
            const data = await taskService.getTasks();
            setTasks(data)
        } catch (error) {
            console.log("Error obteniendo tareas: ", error.message);                     
        } finally {
            setLoadingTask(false);
        }
    };

    const addTask = async (taskData) => {
        const newTask = await taskService.createTask(taskData);
        setTasks(prev => [...prev, newTask]);
        return newTask
    };

    const updateTask = async (id, updatedData) => {
        const updatedTask = await taskService.updateTask(id, updatedData);
        setTasks(prev => 
            prev.map(task => (task._id === id ? updatedTask : task))
        );
        return updatedTask
    };

    const deleteTask = async (id) => {
        await taskService.deleteTask(id);
        setTasks(prev => prev.filter(task => task._id !== id));
    };

    useEffect(() => {
        fetchTasks()
    }, []);


    return (
      <TaskContext.Provider 
        value={
            {
                fetchTasks,
                tasks,
                loadingTask,
                addTask,
                updateTask,
                deleteTask
            }
        }
        >
            {children}
        </TaskContext.Provider>
    )

}

export const useTask = () => useContext(TaskContext);