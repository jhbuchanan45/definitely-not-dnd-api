import { schemaComposer } from 'graphql-compose';
import { CampaignTC } from '../schema/campaign';
import { secureReadWrapper, secureWriteWrapper } from '../middlewares/rolePermissionsControl';
import { Document } from 'mongoose';

const createQuery = (next) => async (rp) => {
  rp.beforeRecordMutate = async (doc: Document, resolveParams) => {
    doc.set('ownerId', resolveParams.context.user.sub);

    return doc;
  };

  return next(rp);
};

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
    [`${cName}UpdateOne`]: CampaignTC.mongooseResolvers.updateOne(),
    [`${cName}UpdateByID`]: CampaignTC.mongooseResolvers.updateById(),
    [`${cName}RemoveByID`]: CampaignTC.mongooseResolvers.removeById(),
    [`${cName}RemoveOne`]: CampaignTC.mongooseResolvers.removeOne(),
  }),
});

const campaignGraphQLSchema = schemaComposer.buildSchema();
export default campaignGraphQLSchema;
