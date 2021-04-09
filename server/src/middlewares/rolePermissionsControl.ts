import { getReadPermissions, getWritePermissions } from "./getPermissions"

export const defaultSafeReadQuery = (req, objID = null, adminOverride = true) => {
    const userContentPerms = getReadPermissions(req.user.permissions);

    return ((req.user.permissions.includes('admin') && adminOverride) ?
        { _id: objID }
        : { _id: objID, $or: [{ ownerId: req.user.sub }, { readIds: req.user.sub }, { src: { $in: userContentPerms } }] })
}

export const defaultSafeWriteQuery = (req, objID = null, adminOverride = true) => {
    const userContentPerms = getWritePermissions(req.user.permissions);

    return ((req.user.permissions.includes('admin') && adminOverride) ?
        { _id: objID }
        : { _id: objID, $or: [{ ownerId: req.user.sub }, { writeIds: req.user.sub }, { src: { $in: userContentPerms } }] })
}