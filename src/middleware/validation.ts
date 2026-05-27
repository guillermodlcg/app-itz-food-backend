import {body, validationResult} from 'express-validator';
import {type Request, type Response, type NextFunction} from 'express';

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction):
Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400)
            .json({ errors: errors.array() });
    }
    next();
};

export const validateUserRequest = [
    body("name").isString()
        .notEmpty()
        .withMessage("El nombre debe ser un string"),
    body("address").isString()
        .notEmpty()
        .withMessage("La dirección debe ser un string"),
    body("city").isString()
        .notEmpty()
        .withMessage("La ciudad debe ser un string"),
    body("country").isString()
        .notEmpty()
        .withMessage("El país debe ser un string"),
    handleValidationErrors
];
export const validateResturanteRequest =[
    body("restauranteName").notEmpty()
        .withMessage("El nombre del restaurante es requerido"),
    body("city").notEmpty()
        .withMessage("La ciudad es requerida"),
    body("country").notEmpty()
        .withMessage("El pais es requerido"),
    body("deliveryPrice").isFloat({min:0})
        .withMessage("El precio de entrega debe ser un numero positivo"),
    body("estimatedDeliveryTime").isFloat({min:0})
        .withMessage("El tiempo de entrega estimado debe ser un numero positivo"),
        body("cuisines").isArray()
        .withMessage("Los tipos de cocina debe ser un arreglo")
        .not().isEmpty()
        .withMessage("El arreglo de tipos de cocina no puede estar vacio"),
    body("menuItems.*.name").notEmpty()
        .withMessage("El nombre del menu es requerido"),
    body("menuItems.*.price").isFloat({min:0})
        .withMessage("El precio del menu es requerido y debe ser un numero positivo"),
    handleValidationErrors

]; //Fin del validateRestauranteRequest