//vamos a armar el controlador que sube la imagen y el que pide la imagen del usuario
import User from '../models/user.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//obtener el __dirname en ES Module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadProfileImage = async (req,res) => {
    try {              


      if(req.fileValidationError){ //valido en caso de que se haya subido un archivo de formato diferente a una imagen      
        return res.status(400).json({message: req.fileValidationError})
      }  

      //aca valido que se haya subido una imagen
      if(!req.file){
        return res.status(400).json({message: 'No se ha subido ninguna imagen'});
      }
         

      const userId = req.user.id;
      const user = await User.findById(userId);

      if(!user){
        //si no hay usuario debo borrar la imagen que se subio
        fs.existsSync(path.join(__dirname, `../../public/uploads/profile/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname, `../../public/uploads/profile/${req.file.filename}`)) // Si hay un error con el usuario este metodo va a borrar la imagen que se creó
        return res.status(404).json({message: 'Usuario no encontrado'})
      }

      //si el usuario ya tiene una imagen de perfil, la eliminamos
      if(user.profileImage){
        const oldImagePath = path.join(__dirname, '../../public/uploads/profile', path.basename(user.profileImage))
        if(fs.existsSync(oldImagePath)){
            fs.unlinkSync(oldImagePath)
        }
      }

      //actualizar la imagen de perfil del usuario en mongoDB
      const imageUrl = `/uploads/profile/${req.file.filename}`;

      user.profileImage = imageUrl;
      await user.save()

      res.status(200).json({
        message:'Imagen de perfil actualizada correctamente',
        profileImage: imageUrl
      })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al subir la imagen de perfil'})        
    }
}

export const getProfileImage = async (req,res) => {
  try {

    const userId = req.user.id; //traigo la info del usuario a través del middleware de authrequired quien inyecta esta info desde el token

    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({message: 'Usuario no encontrado'})
    }

    if(!user.profileImage){
      return res.status(404).json({message: 'El usuario no tiene foto de perfil' })
    }

    res.status(200).json({
      profileImage: user.profileImage
    });
    
  } catch (error) {
       console.log(error);
        res.status(500).json({message: 'Error al obtener la imagen de perfil'})   
  }
}