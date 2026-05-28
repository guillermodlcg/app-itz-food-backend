import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import morgan from 'morgan';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();

import userRoutes from './routes/userRoutes.js';

//Importamos las rutas para el restaurante 
import restauranteRoutes from './routes/restauranteRoutes.js';

//Importamos la ruta para ordenes
import orderRoutes from './routes/orderRoutes.js';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
const apikey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
cloudinary.config({
    cloud_name: cloudName,
    api_key: apikey,
    api_secret: apiSecret
});


mongoose.connect(process.env.DB_CONNECTION_STRING as string)
.then(() => {
    console.log("Base de datos conectada");
})
.catch(() => {
    console.log("Error al conectarse a la base de datos");
});

const app = express();
app.use('/api/order/checkout/webhook', express.raw({type:"*/*"}))

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "https://localhost:5173",
    credentials: true
}));
app.use(morgan('dev'));
app.get('/health', async (req: Request, res: Response) => {
    res.send({ message: '!servidor OK!' });
});
app.get('/', async (req: Request, res: Response) => {
    res.redirect('/health');
});

app.use("/api/user", userRoutes);
app.use('/api/restaurante', restauranteRoutes);
app.use('/api/order', orderRoutes);

// Manejador global de errores - devuelve JSON en lugar de HTML
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Error interno del servidor";
    res.status(status).json({ message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Servidor corriendo en el puerto: " + port);
});
