import express from 'express';
import mapController from '../controllers/map';

const mapRoutes = express.Router();

mapRoutes.get('/campaign/:campaignId', mapController.get);

mapRoutes.post('/', mapController.create);

mapRoutes.put('/:mapID', mapController.update);

mapRoutes.delete('/:mapID', mapController.delete);

mapRoutes.get('/:mapID', mapController.getById);

if (process.env.NODE_ENV === "development") {
    mapRoutes.delete('/', mapController.deleteAll);
}

export default mapRoutes;