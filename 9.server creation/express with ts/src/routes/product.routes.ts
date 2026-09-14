import {Router} from "express";
import { addProduct, allProducts, deleteProduct, productByID } from "../controller/product.controller";
import { productSchema } from "../schemas/product.schema";
import { validateSchema } from "../middlewares/validate";

const router = Router ();

router.get("/",allProducts);
router.get("/:id",productByID);
router.post("/",validateSchema(productSchema),addProduct);
router.delete("/:id",deleteProduct);






export default router;