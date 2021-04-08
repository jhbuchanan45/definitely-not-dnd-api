import express from 'express';
import itemController from '../controllers/item';

const itemRoutes = express.Router();

itemRoutes.get('/', itemController.get);

itemRoutes.post('/', itemController.create);

itemRoutes.put('/:itemID', itemController.update);

itemRoutes.delete('/:itemID', itemController.delete);

itemRoutes.get('/:itemID', itemController.getById);

if (process.env.NODE_ENV === "development") {
    itemRoutes.delete('/', itemController.deleteAll);
}

export default itemRoutes;