import express from 'express';
import { createUser,  getUser, updateUser } from '../controller/userController.js';
import { jwtCheck , jwtParse} from '../middleware/auth.js';
import {validateUserRequest} from '../middleware/validation.js'

const router=express.Router();

//Ruta para guardar un usuario
router.post('/', jwtCheck, createUser);

//Ruta para actualizar un usuario
router.put('/', jwtCheck, jwtParse, validateUserRequest, updateUser);

//Ruta para obtener un usuario
router.get('/', jwtCheck, jwtParse, getUser);

export default router;