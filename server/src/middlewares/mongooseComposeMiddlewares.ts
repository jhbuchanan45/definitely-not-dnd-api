import { Document } from 'mongoose';

export const createQuery = (next) => async (rp) => {
  rp.beforeRecordMutate = async (doc: Document, resolveParams) => {
    doc.set('ownerId', resolveParams.context.user.sub);

    return doc;
  };

  return next(rp);
};
