<<<<<<< HEAD
import express from "express"
import {listProduct, addProduct, removeProduct, singleProduct} from "../controllers/productController.js"
import upload from "../middleware/multer.js"
import adminAuth from "../middleware/adminAuth.js"

const productRouter = express.Router()

productRouter.post('/add',adminAuth,upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]),addProduct)
productRouter.post('/remove',adminAuth,removeProduct)
productRouter.post('/single',singleProduct)
productRouter.get('/list',listProduct)

export default productRouter
=======
import express from 'express'
import {addProduct,listProducts,removeProduct,singleProduct} from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAth.js';

const productRouter = express.Router();

productRouter.post('/add',adminAuth, upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth, removeProduct);
productRouter.post('/single',adminAuth, singleProduct);
productRouter.get('/list',adminAuth, listProducts);

export default productRouter;
>>>>>>> 461b493 (Admin dashboard changes)
