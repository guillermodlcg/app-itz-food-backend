import espress from "express";
import multer from 'multer';
import { createRestaurnate, getRestaurante, searchRestaurante, updateRestaurante, getRestauranteById} from "../controller/restauranteController.js";
import { jwtCheck, jwtParse } from "../middleware/auth.js";
import { validateResturanteRequest } from "../middleware/validation.js";
import { param } from "express-validator";

const router = espress.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});


//Rutas para el restaurante
router.get('/',
    jwtCheck,
    jwtParse,
    getRestaurante
);

//Ruta para agregar un restaurante
router.post('/', jwtCheck, jwtParse,
   upload.single('imagenFile'), validateResturanteRequest, createRestaurnate);

//Ruta para actualizar un restaurante
router.put('/', jwtCheck, jwtParse,
   upload.single('imagenFile'), validateResturanteRequest, updateRestaurante);
//Ruta para buscar los datos de un rrestaurante
router.get('/search/:city',
    param("city").isString()
    .trim()
    .notEmpty()
    .withMessage("El parametro ciudad debe serr un string valido"),
    searchRestaurante
)
//Ruta para obtener un retaurante por Id
router.get("/:restaurantId", param("restaurantId").isString()
.trim().notEmpty().withMessage("El parametro Id del Restaurante debeser un string valido"),
getRestauranteById
);//fin de obtener restaurante por id
export default router;