import express from 'express';
import { schemaComposer } from 'graphql-compose';
import campaignController from '../controllers/campaign';
import { CampaignTC } from '../models/campaign';
import { secureReadWrapper } from '../middlewares/rolePermissionsControl';

const campaignRoutes = express.Router();

const cName = 'campaign';

schemaComposer.Query.addFields({
  ...secureReadWrapper({
    [`${cName}ById`]: CampaignTC.mongooseResolvers.findById({ lean: true }),
    [`${cName}Many`]: CampaignTC.mongooseResolvers.findMany({ lean: true }),
    [`${cName}One`]: CampaignTC.mongooseResolvers.findOne({ lean: true }),
  }),
});

campaignRoutes.post('/', campaignController.create);

campaignRoutes.put('/:campaignID', campaignController.update);

campaignRoutes.delete('/:campaignID', campaignController.delete);

if (process.env.NODE_ENV === 'development') {
  campaignRoutes.delete('/', campaignController.deleteAll);
}

export const campaignGraphQL = schemaComposer.buildSchema();
export default campaignRoutes;
