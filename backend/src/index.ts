import express from 'express';
import { json } from 'body-parser';
import routes from './routes';

const app = express();

app.use(json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
