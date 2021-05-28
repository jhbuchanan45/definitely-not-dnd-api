import express from 'express';
import classController from '../controllers/pClass';

const classRoutes = express.Router();

// classRoutes.get('/', classController.get);

classRoutes.post('/', classController.create);

classRoutes.put('/:pClassID', classController.update);

classRoutes.delete('/:pClassID', classController.delete);

// classRoutes.get('/:pClassID', classController.getById);

if (process.env.NODE_ENV === 'development') {
  classRoutes.delete('/', classController.deleteAll);
}

export default classRoutes;
