import express from 'express';
import { jwtCheck, jwtParse } from '../middleware/auth.js';
import { createCheckOutSession, getOrders, stripeWebHookHandler, 
   getRestaurantOrders, updateOrderStatus
 } from '../controller/orderController.js';

const router = express.Router();

//Ruta post para crear una sesión de stripe
router.post("/create-checkout-session",
    jwtCheck, 
    jwtParse,
     createCheckOutSession);

     //Ruta para procesas laspeticiones del WebHook de stripe
     router.post("/checkout/webhook", stripeWebHookHandler);

     //Ruta para obtener las ordenes de un cliente
     router.get(
        '/',
        jwtCheck,
        jwtParse,
        getOrders
     );
     //Ruta para obtener todas las ordenes de un restaurante 
     router.get(
      '/order',
      jwtCheck,
      jwtParse,
      getRestaurantOrders
     );
//Ruta para actualizar el status de ua orden 
router.patch(
   '/:orderId/status',
   jwtCheck,
   jwtParse,
   updateOrderStatus
);

     export default router;