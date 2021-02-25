import express from 'express';
import { generateTokenTypes } from '../controllers/token';
import { Player } from '../models/token'

const tokenController = generateTokenTypes(Player);

const playerRoutes = express.Router();

playerRoutes.get('/campaign/:campaignId', tokenController.get);

playerRoutes.post('/', tokenController.create);

playerRoutes.put('/:tokenID', tokenController.update);

playerRoutes.delete('/:tokenID', tokenController.delete);

playerRoutes.get('/:tokenID', tokenController.getById);

if (process.env.NODE_ENV === "development") {
    playerRoutes.delete('/', tokenController.deleteAll);
}

export default playerRoutes;