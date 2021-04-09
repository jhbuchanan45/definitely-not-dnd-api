import express from 'express';
import userController from '../controllers/user';

const userRoutes = express.Router();

userRoutes.get('/', userController.get);

// userRoutes.post('/', userController.create);

userRoutes.put('/', userController.update);

userRoutes.delete('/', userController.delete);

userRoutes.get('/:userID', userController.getById);

if (process.env.NODE_ENV === "development") {
    userRoutes.delete('/', userController.deleteAll);
}

export default userRoutes;