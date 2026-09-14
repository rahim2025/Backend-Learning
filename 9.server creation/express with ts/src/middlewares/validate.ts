import {success, z} from "zod";
import { NextFunction,Request,Response } from "express";

export const validateSchema = (schema:z.ZodType) =>{
    return(
        req:Request,
        res:Response,
        next:NextFunction
    ) =>{

        const result = schema.safeParse(req.body);
        if(!result.success){
            res.status(400).json(
                {
                    success:false,
                    errors : result.error.issues
                }
            )
        }
        req.body = result.data;
        next();

    }
}