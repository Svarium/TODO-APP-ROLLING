//aca vamos a configurar multer
import multer from 'multer';
import path from 'path';

//la siguiente función trabaja con dónde y cómo vamos a guardar el archivo
const storageProfileImage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'public/uploads/profile')
    },
    filename:  function(req, file, callback){
        callback(null, `${Date.now()}_icon_${path.extname(file.originalname)}`) // tenemos que armar un nombre único para cada archivo
    }
})

//Aca vamos a hacer la función que va a manejar el archivo
const uploadIconProfileImage = multer({
    storage: storageProfileImage,
    limits:{
        fileSize: 2 * 1024 * 1024 //2mb
     },
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
            req.fileValidationError = "Solo se permite imágenes";          
            return cb(null, false, req.fileValidationError)
        }
        cb(null, true)
    }
})



export default uploadIconProfileImage;