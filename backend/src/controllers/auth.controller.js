import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import { createAccessToken } from '../helpers/jwt.js';
import transport from '../helpers/mailer.js';
import jwt from 'jsonwebtoken';


export const register = async(req, res) => {

    try {

       const {username, email, password} = req.body; //Preparo la información que envía el cliente

       const userFound = await User.findOne({email}); // pregunto a mongo si existe un usuario con el email que envia el cliente

       if(userFound) return res.status(400).json({message: "User already Exist"}); // si existe retornamos mensaje de error
       
       const passwordHash = await bcrypt.hash(password, 12); // hasheo la pass con un salt de 12

       //Generar token de verificación
       const verificationToken = crypto.randomBytes(20).toString('hex');
        
       const newUser = new User({
        username, 
        email, 
        password:passwordHash,
        verificationToken,
       })

       const savedUser = await newUser.save();

       // 1 - Enviar el email para la verificación
       const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`

       await transport.sendMail({
        from: process.env.MAIL_FROM,
        to: savedUser.email,
        subjet: 'Verifica tu email - ROLLING TODO_APP',
        template: 'verifyEmail',
        context:{
            username: savedUser.username,
            verificationLink
        }
       });

       // 2 - crear el token
       const token = await createAccessToken({
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
       });

       // 3 - Responder al cliente con la cookie
       res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV !== "development",
            secure: true,
            sameSite: "none",
       })

       // 4 -  enviar la respuesta al cliente
       res.status(201).json({
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isVerified: savedUser.isVerified,
        token,
       })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})        
    }
  

}

export const login = async(req,res) => {
    try {

        const {email, password} = req.body; // destructuro el request body

        const userFound = await User.findOne({email}); // busco el usuario en mongo

        if(!userFound) return res.status(400).json({message: "user not found"}) // si el usuario no existe devuelvo error

        //comparo la password enviada contra la guardada en mongo
        const isMatch = await bcrypt.compare(password, userFound.password) // comparo la constraseña enviada contra la del usuario encontrado en mongo

        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"}) // si las contraseñas no son iguales doy mensaje de error

        //crear un token para el usuario
        const token = await createAccessToken({
            id:userFound._id,
            username: userFound.username,
            email: userFound.email
        })

        //setear la cookie
        res.cookie("token", token, {
            httpOnly:true,
            secure:true,
            sameSite:"none",
        })

        //enviar la respuesta al cliente
        res.status(200).json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            isVerified: userFound.isVerified,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})    
    }
}

export const logout = async (req,res) => {
    try {

      //limpiar la cookie para matar la sesión 
       res.cookie("token", "", {expires: new Date(0)}) // limpiar seteandola con un string vacio y también con una fecha de expiración que está en el pasado

       res.status(200).json({message: "Logout Success!"})
        
    } catch (error) {
         console.log(error);
        return res.status(500).json({message: error.message})  
    }
}

export const profile = async (req,res) => {
    try {
      
        const userFound = await User.findById(req.user.id);
      
        

        if(!userFound) return res.status(404).json({message: "user not found"})

        return res.status(200).json({
            id: userFound.id,
            username: userFound.username,
            email: userFound.email,
            profileImage: userFound.profileImage,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })    
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})  
    }
}

export const verifyToken = async(req,res) => {
    try {              
        const authHeaders = req.headers.authorization;

        let token;

        if(authHeaders && authHeaders.startsWith("Bearer ")){
            token = authHeaders.split(" ")[1];
        } else {
            return res.status(401).json({message: "No token provided"})
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userFound = await User.findById(decoded.id);

        if(!userFound) return res.status(401);

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            isVerified: userFound.isVerified
        })        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})  
    }
}

export const verifyEmail = async (req,res) => {
    try {

     const { token } = req.query; 

     const user = await User.findOne({verificationToken:token});

     if(!user) {
        return res.status(400).json({message: "Invalid or Expired Token"})
     }

     user.isVerified = true;
     user.verificationToken= undefined;
     await user.save()

     return res.status(200).json({
        success: true,
        message: "Verify email success!",
        user:{
            id:user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified
        }
     })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})  
    }
}




