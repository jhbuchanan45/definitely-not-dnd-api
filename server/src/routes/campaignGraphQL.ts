import { schemaComposer } from 'graphql-compose';
import { CampaignTC } from '../gqlSchema/campaign';
import { secureReadWrapper, secureWriteWrapper } from '../middlewares/rolePermissionsControl';
import { createQuery } from '../middlewares/mongooseComposeMiddlewares';

const mutationOptionsDefault = {
  record: {
    removeFields: ['ownerId'],
  },
};

const cName = 'campaign';

schemaComposer.Query.addFields({
  ...secureReadWrapper({
    [`${cName}ById`]: CampaignTC.mongooseResolvers.findById({ lean: true }),
    [`${cName}Many`]: CampaignTC.mongooseResolvers.findMany({ lean: true }),
    [`${cName}One`]: CampaignTC.mongooseResolvers.findOne({ lean: true }),
  }),
});

schemaComposer.Mutation.addFields({
  ...secureWriteWrapper({
    [`${cName}Create`]: CampaignTC.mongooseResolvers
      .createOne(mutationOptionsDefault)
      .wrapResolve(createQuery),
    [`${cName}UpdateOne`]: CampaignTC.mongooseResolvers.updateOne(mutationOptionsDefault),
    [`${cName}UpdateByID`]: CampaignTC.mongooseResolvers.updateById(mutationOptionsDefault),
    [`${cName}RemoveByID`]: CampaignTC.mongooseResolvers.removeById(),
    [`${cName}RemoveOne`]: CampaignTC.mongooseResolvers.removeOne(),
  }),
});

const campaignGraphQLSchema = schemaComposer.buildSchema();
export default campaignGraphQLSchema;
