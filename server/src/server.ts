import express from 'express';
const app = express();

import cors from 'cors';
import mongoose from 'mongoose';
// import jwtAuthz from 'express-jwt-authz';
// import path from 'path';

// import middlewares
import checkJwt from './middlewares/checkJWT';

// import routes
import userRoutes from './routes/user';
import tokenRoutes from './routes/token';
import mapRoutes from './routes/map';
import campaignRoutes from './routes/campaign';
import playerRoutes from './routes/player';
import classRoutes from './routes/pClass';
import itemRoutes from './routes/item';

const PORT = process.env.PORT || 3000;

mongoose
  .connect(`${process.env.DB_HOST}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to database!');
  })
  .catch((err) => {
    console.log('Failed to connect to database.');
    console.log(err);
    process.exit();
  });

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/user', checkJwt, userRoutes);

app.use('/api/token', checkJwt, tokenRoutes);

app.use('/api/map', checkJwt, mapRoutes);

app.use('/api/campaign', checkJwt, campaignRoutes);

app.use('/api/player', checkJwt, playerRoutes);

app.use('/api/class', checkJwt, classRoutes);

app.use('/api/item', checkJwt, itemRoutes);

app.listen(PORT, () => {
  console.log('Server is listening on port ' + PORT);
});
