import User from '../models/user.model.js';
import { createAccessToken } from '../helpers/jwt.js';
import transport from '../helpers/mailer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { json } from 'zod/v4';


export const requestPasswordReset = async (req,res) => {
    try {

        const {email} = req.body;

        // 1 - validar el email
        if(!email){
            return res.status(400).json({message: "El Email es requerido"})
        }

        // 2 - buscar al usuario
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'})
        }

        // 3 - generar el token de reseteo para las password (expirar en una hora)
        const resetToken = await createAccessToken({
            id: user._id,
            purpose: 'password_reset'
        })

        // 4 - guardar el token y la fecha de expiración
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + 3600000) // 1 hora
        await user.save()

        // 5 - Enviar email con el link de reset
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"${process.env.APP_NAME} || "TODO-APP" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: 'Instrucciones para resetear tu contraseña',
            template: 'forgotPassword', //poner el nombre del archivo pero sin la extensión
            context:{
                name:user.username,
                link: resetLink,
                subject:'Restablecimineto de contraseña'
            }
        }

        await transport.sendMail(mailOptions);

        // 6 -  enviar la respuesta al cliente
        res.status(200).json({
            message:'Email con instrucciones enviado',
            expiresIn: '1h'
        });
        
    } catch (error) {
        console.error('Error en requestPasswordREset:', {
            message: error.message,
            stack: error.stack,
            email: req.body.email
        });

        res.status(500).json({
            message: 'Error al procesar la solicitud',
            error:error.message
        })        
    }
}


export const resetPassword = async (req,res) => {
    try {

        const {token} = req.params;
        const {newPassword} = req.body;

        // 1 - verificar el token
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if(err){
                return res.status(401).json({
                    message:'Token inválido o expirado',
                    error: err.message
                })
            }

        // 2 - Buscar al usuario
        const user = await User.findOne({
            _id: decoded.id,
            passwordResetToken: token,
            passwordResetExpires: {$gt: Date.now()}
        });

        if(!user){
            return res.status(400).json({
                message:'Usuario no encontrado o token inválido'
            })
        }

        // 3 -Hashear la password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // 4 - actualizar y limpiar token
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 5 - enviar la respuesta al cliente
        res.status(200).json({
            message: 'Contraseña actualizada exitosamente'
        });  
        })           
    } catch (error) {
        console.error('Error en resetPassword', error);
        res.status(500).json({
            message:'error al resetear la contraseña',
            error:error.message
        })
        
    }
}