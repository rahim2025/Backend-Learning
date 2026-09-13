import {Router} from "express";
import { addProduct, allProducts, deleteProduct, productByID } from "../controller/product.controller";

const router = Router ();

router.get("/",allProducts);
router.get("/:id",productByID);
router.post("/",addProduct);
router.delete("/:id",deleteProduct);






export default router;