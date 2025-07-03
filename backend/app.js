import express, { urlencoded } from "express"; //importar express
import dotenv from "dotenv"; //importar dotenv
import fs from "node:fs"; //importar fs
import cors from "cors"; //importar cors
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config() //ejecuta dotenv

const app = express(); //crear una instancia de express

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



//Middlewares
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-type', 'Authorization', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie']
}
app.use(cors(corsOptions));
app.use(express.json()); //analizar el cuerpo de la solicitud como JSON
app.use(urlencoded({
    extended: true //analizar el cuerpo de la solicitud como URL codificada
}))
app.use(morgan("dev"));
app.use(cookieParser());

//configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')))


//MANEJO DE RUTAS
// Leemos todos los archivos dentro del directorio './src/routes' de forma síncrona.
// fs.readdirSync devuelve un array con los nombres de todos los archivos en ese directorio.
const routeFiles = fs.readdirSync('./src/routes');

// Iteramos sobre cada archivo encontrado en el directorio de rutas
routeFiles.forEach((file) => {
    // Usamos importaciones dinámicas (import()) para cargar cada módulo de ruta.
    // Esto es útil porque:
    // 1. Nos permite cargar módulos de forma asíncrona
    // 2. Cada ruta se registra independientemente
    // 3. Si una ruta falla, no afecta a las demás
    import(`./src/routes/${file}`).then((route) => {
        // Registramos la ruta en nuestra aplicación Express
        // Todas las rutas importadas serán prefijadas con '/api/v1'
        // Esto nos da:
        // - Versionado de API
        // - Un punto de entrada común para todas las rutas
        // - Mejor organización del código
        app.use('/api/v1', route.default);
    }).catch((err) => {
        console.error(`Error al cagrar la ruta ${file}:`, err)
    })
})



export default app;





