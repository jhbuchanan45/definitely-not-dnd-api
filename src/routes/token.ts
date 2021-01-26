import express from 'express';
import tokenController from '../controllers/token';

const tokenRoutes = express.Router();

tokenRoutes.get('/', tokenController.get);

tokenRoutes.post('/', tokenController.create);

tokenRoutes.put('/:tokenID', tokenController.update);

tokenRoutes.delete('/:tokenID', tokenController.delete);

tokenRoutes.get('/:tokenID', tokenController.getById);

if (process.env.NODE_ENV === "development") {
    tokenRoutes.delete('/', tokenController.deleteAll);
}

export default tokenRoutes;