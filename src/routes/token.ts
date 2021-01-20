import express from 'express';
import tokenController from '../controllers/token';
import token from '../models/token';

const tokenRoutes = express.Router();

tokenRoutes.get('/', tokenController.get);

tokenRoutes.post('/', tokenController.create);

tokenRoutes.put('/:tokenID', tokenController.update);

tokenRoutes.delete('/:tokenID', tokenController.delete);

tokenRoutes.get('/:tokenID', tokenController.getById);

export default tokenRoutes;