export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body); // Validar el cuerpo de la solicitud con el esquema proporcionado
        return next(); // Si la validación es exitosa, continuar al siguiente middleware o controlador
    } catch (error) {
        return res
            .status(400) // En caso de error, devolver un estado 400 (Bad Request)
            .json({
                error: error.errors.map((err) => err.message), // Devolver los mensajes de error
            });
    }
}