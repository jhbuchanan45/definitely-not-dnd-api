import { schemaComposer } from 'graphql-compose';
import { ClassTC, ExtraClassTC } from '../gqlSchema/pClass';
import { secureReadWrapper, secureWriteWrapper } from '../middlewares/rolePermissionsControl';
import { createQuery } from '../middlewares/mongooseComposeMiddlewares';

const mutationOptionsDefault = {
  record: {
    removeFields: ['ownerId'],
  },
};

const cName = 'class';

schemaComposer.Query.addFields({
  ...secureReadWrapper({
    [`${cName}ById`]: ClassTC.mongooseResolvers.findById({ lean: true }),
    [`${cName}Many`]: ClassTC.mongooseResolvers.findMany({ lean: true }),
    [`${cName}One`]: ClassTC.mongooseResolvers.findOne({ lean: true }),
    [`extraClassMany`]: ExtraClassTC.mongooseResolvers.findMany({ lean: true }),
  }),
});

schemaComposer.Mutation.addFields({
  ...secureWriteWrapper({
    [`${cName}Create`]: ClassTC.mongooseResolvers
      .createOne(mutationOptionsDefault)
      .wrapResolve(createQuery),
    [`${cName}UpdateOne`]: ClassTC.mongooseResolvers.updateOne(mutationOptionsDefault),
    [`${cName}UpdateByID`]: ClassTC.mongooseResolvers.updateById(mutationOptionsDefault),
    [`${cName}RemoveByID`]: ClassTC.mongooseResolvers.removeById(),
    [`${cName}RemoveOne`]: ClassTC.mongooseResolvers.removeOne(),
    [`extraClassCreate`]: ExtraClassTC.mongooseResolvers
      .createOne(mutationOptionsDefault)
      .wrapResolve(createQuery),
  }),
});

const itemGraphQLSchema = schemaComposer.buildSchema();
export default itemGraphQLSchema;
