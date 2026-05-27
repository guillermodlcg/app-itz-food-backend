import {Request, Response} from 'express';
import Restaurant from "../model/restaurantModel.js";
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import restaurantModel from '../model/restaurantModel.js';
//Funcion para obtener los datos de un restaurante
export const getRestaurante =async (req:Request, res:Response)=>{
    try{
        const restaurante = await Restaurant.findOne({user: req.userId})
        if(!restaurante){
            return res.status(404).json({message: 'Restaurante no encontrado'})
        }
        res.json(restaurante);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener el restaurante'})
    }
}
//Funcion para crear un restaurante 
export const createRestaurnate = async (req: Request, res: Response)=>{
    try{
        const existingRestaurante= await Restaurant.findOne({user: req.userId});
        if(existingRestaurante){
            return res.status(500)
        .json({message: 'El restaurante para este usuario ya existe'})

}
const imageUrl=await uploadImage(req.file as Express.Multer.File);

        //Creamos el objejto restaurante y lo alamacenamos en la bd 
        const restaurante = new Restaurant({
            ...req.body,
            cuisines: Array.isArray(req.body.cuisines)
                ? req.body.cuisines
                : Object.values(req.body.cuisines || {})
        });
        restaurante.imageUrl= imageUrl
        restaurante.user=new mongoose.Types.ObjectId(req.userId);
        restaurante.lastUpdated=new Date();

        //  Guardamos el restaurante en la bd 
        await restaurante.save();
        res.status(201).json(restaurante)
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al crear el restaurate'})
    }
}

export const updateRestaurante = async (req: Request, res: Response) => {
    try {
        let restaurante = await Restaurant.findOne({ user: req.userId });
        if (!restaurante)
            return res.status(404).json({ message: 'Restaurante no encontrado' });

        restaurante!.restauranteName = req.body.restauranteName;
        restaurante!.city = req.body.city;
        restaurante!.country = req.body.country;
        restaurante!.deliveryPrice = req.body.deliveryPrice;
        restaurante!.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurante!.cuisines = Array.isArray(req.body.cuisines)
            ? req.body.cuisines
            : Object.values(req.body.cuisines || {});
        restaurante!.menuItems = req.body.menuItems;
        restaurante!.lastUpdated = new Date();

        if (req.file) {
            const imageUrl=await uploadImage(req.file as Express.Multer.File);
            restaurante!.imageUrl=imageUrl;
        }

        await restaurante.save();
        res.json(restaurante);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el restaurante' });
    }
}
const uploadImage = async (file:Express.Multer.File)=>{
    //Creamos una url de cloudinary para la imagen del restaurate 
    const image = file;
    //Convertimos el objetoo e la imagen a un objeto d¡base64 para poderlo almacear como imagen cloudinary
    const base64Image= Buffer.from(image.buffer).toString("base64");
    const dataUri="data:" + image.mimetype + ";base64," + base64Image;
    //Subimos la imagen a cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataUri);
    //Retomamos la url de la image e cloudiary
    return uploadResponse.url;
}//Fin de uploadImage

export const searchRestaurante = async(req:Request, res:Response):Promise<any>=>{
    try{
        const city=req.params.city as string;
        const searchQuery=(req.query.searchQuery as string) || "";
        const selectedCuisines=(req.query.selectedCuisines as string) || "";
        const sortOptions=(req.query.sortOption as string) || "lastUpdated";
        const page=parseInt(req.query.page as string) || 1;
        let query:any={};
        //Esta query se va a utilizar parra buscar porr ciudad sn diferenciar matusculas
       // o minusculas  zacatecas = Zacatecas
       query["city"]=new RegExp(city, "i")
       //Obtenemos las ciudades de la base de datos
       const cityCheck = await Restaurant.countDocuments(query);
       if(cityCheck == 0){ //No hay ciudades de los rrestaurrantes en la bd
        return res.status(404).json({data: [],
            pagination:{
                total:0,
                page:1,
                pages:1
            }
        });

       }
       //si existen cocinas en los parametros de busqueda los converimos del texto a un arreglo
       if(selectedCuisines){
        const cuisinesArray=selectedCuisines.split(",").map((cuisine)=>new RegExp(cuisine,'i'));
        query["cuisines"]={$all:cuisinesArray}
       }
      //Por ejemplo, si e la query tenemos: 
      //restaurante = ITZ Food
      //cuisines = [pizza,pasta italiana ]
      // searchQuery= Pasta
      //La busqueda regresaria el Restaurante ITZ Food, dado que
      //  contiene la palabra pasta en su tipo de cocina
      if(searchQuery){
        const searchRegex = new RegExp(searchQuery, "i");
        query["$or"]=[
            {restauranteName:searchRegex},
            {cuisines:{$in: [searchRegex]}}
        ]
      }
      //Por cada pagina de busqueda mostraremos 10 restaurantes
      const pageSize = 10;

      //skip sirve para irnos al primer restaurate de cada pagina 
      // por ejemplo, en la pagina 1, tiene del 0 al 10,
      //la pagina 2 del 11 al 19
      //la pagina 3 del 20 al 29, y asi sucesivamente
      const skip = (page - 1) * pageSize;
      const restaurantSearchResult = await Restaurant.find(query)
      .sort({[sortOptions]:1})
      .skip(skip)
      .limit(pageSize)
      .lean();
      const total=await Restaurant.countDocuments(query);

      const response={
        data: restaurantSearchResult,
        pagination:{
            total,
            page,
            //por ejemplo si tenemos 50 resultados
            //y el tamaño de pagina pageSize=10
            //al dividir 50/10 total/pageSize = 5 paginas
            pages: Math.ceil(total/pageSize)
        }
      };
      res.json(response);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al buscar el restaurante'})
    }
}//Fin del searchRestaurante

//Función oara obtener los datos de un restaurante 
export const getRestauranteById = async (req: Request, res: Response):Promise<any>=>{
    try{
        const restaurante = await restaurantModel.findById(req.params.restaurantId);
        if(!restaurante){
            return res.status(404).json({message:"Restaurante no encontrado"})


        }
        res.json(restaurante);

    }catch(error){
        console.log(error);
    res.status(500).json({message: 'Error al obtener los datos del restaurante'})
}
}