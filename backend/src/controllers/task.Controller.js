import fs from 'fs';
import path from 'path';
import Task from '../models/task.model.js';

// crear tarea
export const createTask = async (req,res) => { 

    //verificar errores de validacion del esquema
    if(req.validationError){
        if(req.files && req.files.length > 0){
            req.files.forEach(file => {
                const filePath = path.join('public', 'uploads', 'tasks', file.filename);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath)
                }
            })
        }
       return res.status(400).json({message: req.validationError}); 
    }

    //verificar errores de Multer
  if(req.fileValidationError){
        if(req.files && req.files.length > 0){
            req.files.forEach(file => {
                const filePath = path.join('public', 'uploads', 'tasks', file.filename);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath)
                }
            })
        }
       return res.status(400).json({message: req.fileValidationError}); 
    }

    try {
        const {title, description, dueDate} = req.body;

        let savedFiles = [];

        if(req.files && req.files.length > 0) {
            savedFiles = req.files.map(file => ({
                name: file.originalname,
                path: `/uploads/tasks/${file.filename}`,
                size: file.size,
                mimetype: file.mimetype
            }));
        }

        const newTask = new Task({
            title,
            description,
            dueDate: dueDate || new Date(),
            user: req.user.id,
            files: savedFiles
        })

        const savedTask = await newTask.save();
        return res.status(201).json(savedTask)
        
    } catch (error) {
         if(req.files && req.files.length > 0){
            req.files.forEach(file => {
                const filePath = path.join('public', 'uploads', 'tasks', file.filename);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath)
                }
            })
        }
        console.log(error);        
       return res.status(400).json({message: error.message});         
    }
}

// listar las  tareas
export const getTasks = async(req,res) => {
    try {

    const tasks = await Task.find({
        user: req.user.id,
        
    })   
    .populate("user")
    .sort({createdAt: -1}) //ordena las tareas de la más nueva a la más antigua       

    if(!tasks){
        return res.status(404).json({msg: "tasks not found"});
    }

    return res.status(200).json(tasks);
        
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message)        
    }
}

// listar una tarea por id
export const getTask = async(req,res) => {
    try {

     const taskFound = await Task.findById(req.params.id).populate("user");
     
     if(!taskFound){
        return res.status(404).json({message: "Task not found"})
     }

     return res.status(200).json(taskFound)
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message})        
    }
}

// editar una tarea
export const updateTask = async(req,res) => {
    // 1 - Verificar errores de multer (title o archivos inválidos)     
    if(req.fileValidationError){
        return res.status(400).json({message: req.fileValidationError});
    }

    try {

    // 2 - verificar existencia de la tarea
    const existingTask = await Task.findById(req.params.id);
    if(!existingTask){
        return res.status(404).json({message: 'Task not found'})
    }

    // 3 - procesar los archivos (si los hay)
        let savedFiles = [];

        if(req.files && req.files.length > 0) {
            savedFiles = req.files.map(file => ({
                name: file.originalname,
                path: `/uploads/tasks/${file.filename}`,
                size: file.size,
                mimetype: file.mimetype
            }));
        }

     // 4 - actualizar la tarea (combinando los archivos existentes con los nuevos)
     const updateData = {
        ...req.body,
        files: [...(existingTask.files || []), ...savedFiles]
     }

     const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        updateData,
        {new: true}
     );

     return res.status(200).json(updatedTask)
        
    } catch (error) {
     if(req.files && req.files.length > 0){
            req.files.forEach(file => {
                const filePath = path.join('public', 'uploads', 'tasks', file.filename);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath)
                }
            })
        }
        console.log(error);        
        return res.status(500).json({message: error.message})        
    }
}

export const deleteTask = async(req,res) => {
    try {

        const taskFound = await Task.findByIdAndDelete(req.params.id);

        if(!taskFound){
            return res.status(404).json({message: "task not found"})
        }
            
        return res.status(200).json({message: 'Task Deleted!'})
    

    } catch (error) {
       console.log(error);
       return res.status(500).json({message: error.message})        
    }
}
