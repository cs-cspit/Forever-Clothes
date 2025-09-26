<<<<<<< HEAD
import express from "express"
import { loginUser,registerUser,adminLogin } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)

export default userRouter
=======
import express from 'express';
import { loginUser,registerUser,adminLogin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

export default userRouter;
>>>>>>> 461b493 (Admin dashboard changes)
