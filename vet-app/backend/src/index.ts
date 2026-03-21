import express from 'express';
import cors from 'cors';
import { clientController } from './controllers/client.controller.js';
import { petController } from './controllers/pet.controller.js';
import { consultationController } from './controllers/consultation.controller.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/clients', clientController.getAll);
app.post('/clients', clientController.create);

app.get('/pets', petController.getAll);
app.get('/pets/:id', petController.getById);
app.post('/pets', petController.create);

app.get('/consultations', consultationController.getAll);
app.post('/consultations', consultationController.create);

app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}`);
});
