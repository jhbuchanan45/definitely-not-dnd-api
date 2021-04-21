import { ResolverMiddleware } from 'graphql-compose';
import { getReadPermissions, getWritePermissions } from './getPermissions';

export const defaultSafeReadQuery = (req, objID = null, adminOverride = true) => {
  const userContentPerms = getReadPermissions(req.user.permissions);

  return req.user.permissions.includes('admin') && adminOverride
    ? { _id: objID }
    : {
        _id: objID,
        $or: [
          { ownerId: req.user.sub },
          { src: { $in: userContentPerms } },
          { readIds: req.user.sub },
        ],
      };
};

export const secureRead = async (resolve, root, args, context, info) => {
  const userContentPerms = getReadPermissions(context.user.permissions);

  const secureReadQuery = {
    OR: [
      { ownerId: context.user.sub },
      { src: { $in: userContentPerms } },
      { readIds: context.user.sub },
    ],
  };

  args.filter = args.filter
    ? {
        AND: [{ ...args.filter }, ...[secureReadQuery]],
      }
    : secureReadQuery;

  return await resolve(root, args, context, info);
};

export const secureWrite = async (resolve, root, args, context, info) => {
  const userContentPerms = getWritePermissions(context.user.permissions);
  const { record } = args;

  const secureWriteQuery = {
    OR: [
      { ownerId: context.user.sub },
      { src: { $in: userContentPerms } },
      { writeIds: context.user.sub },
    ],
  };

  args.filter = args.filter
    ? {
        AND: [{ ...args.filter }, ...[secureWriteQuery]],
      }
    : secureWriteQuery;

  return await resolve(root, args, context, info);
};

export const secureReadWrapper = (resolvers) => {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].withMiddlewares([secureRead]);

    return resolvers;
  });

  return resolvers;
};

export const secureWriteWrapper = (resolvers) => {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].withMiddlewares([secureWrite]);

    return resolvers;
  });

  return resolvers;
};

export const defaultSafeWriteQuery = (req, objID = null, adminOverride = true) => {
  const userContentPerms = getWritePermissions(req.user.permissions);

  return req.user.permissions.includes('admin') && adminOverride
    ? { _id: objID }
    : {
        _id: objID,
        $or: [
          { ownerId: req.user.sub },
          { writeIds: req.user.sub },
          { src: { $in: userContentPerms } },
        ],
      };
};
