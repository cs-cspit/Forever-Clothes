import express from "express"
import { getCart, addToCart, updateCart } from "../controllers/cartController.js"

const cartRouter = express.Router()

cartRouter.post('/get', getCart)
cartRouter.post('/add', addToCart)
cartRouter.post('/update', updateCart)

export default cartRouter

