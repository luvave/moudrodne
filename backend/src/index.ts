import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Backend (Node App)!');
});

app.listen(8001, () => {
  console.log('Backend is running on http://localhost:8001');
});
