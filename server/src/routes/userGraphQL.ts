import { schemaComposer } from 'graphql-compose';
import { UserTC } from '../gqlSchema/user';
import { secureRead } from '../middlewares/rolePermissionsControl';

schemaComposer.Query.addFields({
  userById: UserTC.mongooseResolvers.findById(),
  userMany: UserTC.mongooseResolvers.findMany().withMiddlewares([secureRead]),
  userOne: UserTC.mongooseResolvers.findOne(),
});

schemaComposer.Mutation.addFields({
  userCreate: UserTC.mongooseResolvers.createOne(),
});

const userGraphQLSchema = schemaComposer.buildSchema();
export default userGraphQLSchema;
