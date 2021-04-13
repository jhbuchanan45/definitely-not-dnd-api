import express from 'express';
import { generateTokenTypes } from '../controllers/token';
import Token from '../models/token';

const tokenController = generateTokenTypes(Token);

const tokenRoutes = express.Router();

tokenRoutes.get('/campaign/:campaignId', tokenController.get);

tokenRoutes.post('/', tokenController.create);

tokenRoutes.put('/:tokenID', tokenController.update);

tokenRoutes.delete('/:tokenID', tokenController.delete);

tokenRoutes.get('/:tokenID', tokenController.getById);

if (process.env.NODE_ENV === 'development') {
  tokenRoutes.delete('/', tokenController.deleteAll);
}

export default tokenRoutes;
