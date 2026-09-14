import { Request,Response } from "express";
import{z} from "zod";
import { productSchema } from "../schemas/product.schema";
import { createProduct } from "../schemas/product.schema";

export const allProducts = (req:Request,res:Response)=>{
    console.log(req.query.name,req.query.age)
    res.send("All product Delivered")
}

export const productByID = (req:Request,res:Response) =>{
    const id = req.params.id;
    console.log(req.body)
    res.send(`Product with ID: ${id} Delivered`)
}

export const addProduct = (req:Request,res:Response) =>{
    const product:createProduct = req.body;
    console.log(product);
    res.send("Product Added")
}

export const deleteProduct = (req:Request,res:Response) =>{
    res.send("Product Deleted")
}