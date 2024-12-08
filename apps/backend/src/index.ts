import express from 'express';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';
import 'tsconfig-paths/register';
import swaggerUI from 'swagger-ui-express';
import swaggerOutput from './swagger_output.json';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  allowedHeaders: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
};
app.use(cors(corsOptions));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOutput));

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
