import express from 'express';
import tokenController from '../controllers/token';
import token from '../models/token';

const tokenRoutes = express.Router();

tokenRoutes.get('/', tokenController.getTokens);

tokenRoutes.post('/', tokenController.createToken);

export default tokenRoutes;