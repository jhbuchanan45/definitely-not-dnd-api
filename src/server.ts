import express from 'express';
const app = express();

import cors from 'cors';
import mongoose from 'mongoose';
import jwtAuthz from 'express-jwt-authz';
import path from 'path';

// import middlewares
import checkJwt from './middlewares/checkJWT';

// import routes
import userRoutes from './routes/user';
import tokenRoutes from './routes/token';

const PORT = process.env.PORT || 3000;

mongoose.connect(`mongodb://${process.env.DB_HOST}`, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.once('open', () => {
    console.log("MongoDB connection successful!")
})

app.use(express.static(path.join(__dirname, '../client/definitely-not-dnd/build')));


app.use(cors());
app.use(express.json());

app.use('/api/user', checkJwt, userRoutes);

app.use('/api/token', checkJwt, tokenRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/definitely-not-dnd/build', 'index.html'))
  })

app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
})