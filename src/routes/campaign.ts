import express from 'express';
import campaignController from '../controllers/campaign';

const campaignRoutes = express.Router();

campaignRoutes.get('/', campaignController.get);

campaignRoutes.post('/', campaignController.create);

campaignRoutes.get('/ids', campaignController.getByIDs);

campaignRoutes.put('/:campaignID', campaignController.update);

campaignRoutes.delete('/:campaignID', campaignController.delete);

campaignRoutes.get('/:campaignID', campaignController.getById);


if (process.env.NODE_ENV === "development") {
    campaignRoutes.delete('/', campaignController.deleteAll);
}

export default campaignRoutes;
