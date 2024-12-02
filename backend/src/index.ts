import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import routes from './routes';
import dotenv from 'dotenv';
import 'tsconfig-paths/register';

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:8000',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));

app.use(json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
