
# 🟣 React Context explicado

## 🚀 ¿Qué es Context en React?

Context es una herramienta que nos ofrece React para **compartir datos** entre componentes sin necesidad de pasar props manualmente en cada nivel del árbol de componentes.

👉 Es ideal cuando tenemos datos **globales** que muchos componentes necesitan, como:
- Datos de autenticación (usuario logueado)
- Temas de la app (oscuro / claro)
- Idioma seleccionado
- Lista de tareas en nuestra Todo App

---

## ❌ El problema del "Prop Drilling"

Imaginá que tenés:
```jsx
<App>
  <Header>
    <UserMenu>
      <LogoutButton />
    </UserMenu>
  </Header>
</App>
```
Si el botón `LogoutButton` necesita saber quién es el usuario, deberíamos pasar la prop desde `App` → `Header` → `UserMenu` → `LogoutButton`. Esto es incómodo y difícil de mantener.

💡 **Context resuelve esto** porque permite acceder directamente al dato sin importar en qué nivel estés.

---

## 🛠️ ¿Cómo crear y usar Context?

### 1️⃣ Crear el Context
```jsx
import React, { createContext } from 'react';

export const AuthContext = createContext();
```

### 2️⃣ Crear un Provider
```jsx
import React, { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username) => setUser({ username });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 3️⃣ Usar el Context en cualquier componente
```jsx
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const LogoutButton = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      {user && <p>Hola {user.username}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

---

## 📝 Ejemplo completo: Todo App con AuthContext y TasksContext

### Estructura de archivos:
```
src/
 ├─ App.js
 ├─ contexts/
 │   ├─ AuthContext.js
 │   └─ TasksContext.js
 ├─ components/
 │   ├─ LoginForm.js
 │   ├─ TaskList.js
 │   └─ AddTaskForm.js
```

### `AuthContext.js`
```jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username) => setUser({ username });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### `TasksContext.js`
```jsx
import React, { createContext, useState } from 'react';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (title) => {
    const newTask = { id: Date.now(), title };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, removeTask }}>
      {children}
    </TasksContext.Provider>
  );
};
```

### `App.js`
```jsx
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { TasksProvider } from './contexts/TasksContext';
import LoginForm from './components/LoginForm';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';

const App = () => {
  return (
    <AuthProvider>
      <TasksProvider>
        <h1>Todo App</h1>
        <LoginForm />
        <AddTaskForm />
        <TaskList />
      </TasksProvider>
    </AuthProvider>
  );
};

export default App;
```

### `LoginForm.js`
```jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LoginForm = () => {
  const { user, login, logout } = useContext(AuthContext);
  const [username, setUsername] = useState('');

  if (user) {
    return (
      <div>
        <p>Bienvenido, {user.username}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <input 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
      />
      <button onClick={() => login(username)}>Login</button>
    </div>
  );
};

export default LoginForm;
```

### `AddTaskForm.js`
```jsx
import React, { useContext, useState } from 'react';
import { TasksContext } from '../contexts/TasksContext';
import { AuthContext } from '../contexts/AuthContext';

const AddTaskForm = () => {
  const { user } = useContext(AuthContext);
  const { addTask } = useContext(TasksContext);
  const [title, setTitle] = useState('');

  if (!user) return null;

  return (
    <div>
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nueva tarea"
      />
      <button onClick={() => {
        addTask(title);
        setTitle('');
      }}>Agregar</button>
    </div>
  );
};

export default AddTaskForm;
```

### `TaskList.js`
```jsx
import React, { useContext } from 'react';
import { TasksContext } from '../contexts/TasksContext';
import { AuthContext } from '../contexts/AuthContext';

const TaskList = () => {
  const { user } = useContext(AuthContext);
  const { tasks, removeTask } = useContext(TasksContext);

  if (!user) return null;

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          {task.title}
          <button onClick={() => removeTask(task.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
```

---

## ✅ Buenas prácticas

- Separá Contexts según la funcionalidad (AuthContext, TasksContext, ThemeContext, etc).
- No uses Context para datos que cambian todo el tiempo (por ejemplo, inputs que se actualizan en cada tecla).
- Considerá **Redux**, **Zustand** o **Jotai** si tu app crece mucho y el Context empieza a ser difícil de manejar.

---

## 📌 ¿Cuándo usar Context?

✔ Cuando querés compartir datos globales  
✔ Cuando querés evitar el prop drilling  
❌ Cuando los datos cambian muy seguido (ahí es mejor el estado local)

---

## 🌟 Conclusión

React Context es una herramienta poderosa y sencilla de usar que te permite compartir datos fácilmente en tu app. Con el ejemplo de la Todo App ya tenés lo esencial para implementarlo en tus proyectos.
