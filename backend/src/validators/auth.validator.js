/**
 * ZOD VALIDATION SCHEMA IMPLEMENTATION
 * 
 * Zod es una librería de validación de esquemas para TypeScript que permite definir
 * y validar estructuras de datos con un enfoque declarativo y type-safe.
 * 
 * Características clave:
 * 1. Type-safe: Los esquemas generan tipos TypeScript automáticamente
 * 2. Declarativo: Sintaxis sencilla y legible
 * 3. Validación completa: Soporta strings, números, objetos, arrays, etc.
 * 4. Mensajes personalizables: Permite definir mensajes de error específicos
 * 5. Composible: Los esquemas pueden combinarse y extenderse fácilmente
 * 
 * En este archivo vamos implementar dos esquemas:
 * - registerSchema: Para validar datos de registro de usuario
 * - loginSchema: Para validar credenciales de inicio de sesión
 * 
 * Cada campo tiene validaciones específicas con mensajes de error personalizados
 * que se mostrarán si la validación falla.
 */

import {z} from "zod";

/**
 * Esquema de validación para el registro de usuarios.
 * Valida:
 * - username: string requerido
 * - email: string con formato de email válido
 * - password: string con mínimo 6 caracteres
 */
export const registerSchema = z.object({
  // Nombre de usuario debe ser un string y es obligatorio
  username: z
  .string({ required_error: "username is required" })
  .min(5, {message: "Username must be at least 5 characters"}),

  // Email debe ser un string válido y tener formato de email
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),

  // Password debe ser un string con al menos 6 caracteres
  password: z
    .string({ required_error: "password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

/**
 * Esquema de validación para el inicio de sesión.
 * Valida:
 * - email: string con formato de email válido
 * - password: string con mínimo 6 caracteres
 * 
 * Similar a registerSchema pero sin el campo username
 */
export const loginSchema = z.object({
  // Email debe ser un string válido y tener formato de email
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),

  // Password debe ser un string con al menos 6 caracteres
  password: z
    .string({ required_error: "password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});