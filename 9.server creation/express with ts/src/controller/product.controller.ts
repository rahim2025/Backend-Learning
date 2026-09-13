import { Request,Response } from "express";

export const allProducts = (req:Request,res:Response)=>{
    res.send("All product Delivered")
}

export const productByID = (req:Request,res:Response) =>{
    res.send("Specific product Delivered")
}

export const addProduct = (req:Request,res:Response) =>{
    res.send("Product Added")
}

export const deleteProduct = (req:Request,res:Response) =>{
    res.send("Product Deleted")
}