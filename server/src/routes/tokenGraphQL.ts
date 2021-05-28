import { schemaComposer } from 'graphql-compose';
import { TokenTC } from '../gqlSchema/token';
import { secureReadWrapper, secureWriteWrapper } from '../middlewares/rolePermissionsControl';
import { createQuery } from '../middlewares/mongooseComposeMiddlewares';

const mutationOptionsDefault = {
  record: {
    removeFields: ['ownerId'],
  },
};

const cName = 'token';

schemaComposer.Query.addFields({
  ...secureReadWrapper({
    [`${cName}ById`]: TokenTC.mongooseResolvers.findById({ lean: true }),
    [`${cName}Many`]: TokenTC.mongooseResolvers.findMany({ lean: true }),
    [`${cName}One`]: TokenTC.mongooseResolvers.findOne({ lean: true }),
  }),
});

schemaComposer.Mutation.addFields({
  ...secureWriteWrapper({
    [`${cName}Create`]: TokenTC.mongooseResolvers
      .createOne(mutationOptionsDefault)
      .wrapResolve(createQuery),
    [`${cName}UpdateOne`]: TokenTC.mongooseResolvers.updateOne(mutationOptionsDefault),
    [`${cName}UpdateByID`]: TokenTC.mongooseResolvers.updateById(mutationOptionsDefault),
    [`${cName}RemoveByID`]: TokenTC.mongooseResolvers.removeById(),
    [`${cName}RemoveOne`]: TokenTC.mongooseResolvers.removeOne(),
  }),
});

const tokenGraphQLSchema = schemaComposer.buildSchema();
export default tokenGraphQLSchema;
