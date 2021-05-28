import { schemaComposer } from 'graphql-compose';
import { ItemTC } from '../gqlSchema/item';
import { secureReadWrapper, secureWriteWrapper } from '../middlewares/rolePermissionsControl';
import { createQuery } from '../middlewares/mongooseComposeMiddlewares';

const mutationOptionsDefault = {
  record: {
    removeFields: ['ownerId'],
  },
};

const cName = 'item';

schemaComposer.Query.addFields({
  ...secureReadWrapper({
    [`${cName}ById`]: ItemTC.mongooseResolvers.findById({ lean: true }),
    [`${cName}Many`]: ItemTC.mongooseResolvers.findMany({ lean: true }),
    [`${cName}One`]: ItemTC.mongooseResolvers.findOne({ lean: true }),
  }),
});

schemaComposer.Mutation.addFields({
  ...secureWriteWrapper({
    [`${cName}Create`]: ItemTC.mongooseResolvers
      .createOne(mutationOptionsDefault)
      .wrapResolve(createQuery),
    [`${cName}UpdateOne`]: ItemTC.mongooseResolvers.updateOne(mutationOptionsDefault),
    [`${cName}UpdateByID`]: ItemTC.mongooseResolvers.updateById(mutationOptionsDefault),
    [`${cName}RemoveByID`]: ItemTC.mongooseResolvers.removeById(),
    [`${cName}RemoveOne`]: ItemTC.mongooseResolvers.removeOne(),
  }),
});

const itemGraphQLSchema = schemaComposer.buildSchema();
export default itemGraphQLSchema;
