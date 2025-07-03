import {Router} from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import uploadsTasksFiles from '../helpers/multer.config.tasks.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createTaskSchema } from '../validators/task.validator.js';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/task.Controller.js';
import { cleanUpTaskFiles } from '../middlewares/cleanUpTaskFiles.js';

const router = Router();

// Aca vienen todas las rutas del CRUD de tareas

// 1-  Create Task
router.post('/tasks', 
    authRequired,
    uploadsTasksFiles, //PRIMERO MULTER
    validateSchema(createTaskSchema), //SEGUNDO EL ESQUEMA DE VALIDACION
    createTask
)

// 2 - pedir todas las tareas
router.get('/tasks', authRequired, getTasks)

// 3 - pedir una tarea por su id
router.get('/tasks/:id', authRequired, getTask)

// 4 - actualizar una tarea
router.put(
    '/tasks/:id', 
    authRequired,
    uploadsTasksFiles,
    updateTask
)

// 5 - eliminar una tarea
router.delete('/tasks/:id', authRequired, cleanUpTaskFiles , deleteTask)



export default router;