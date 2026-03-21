import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { clientController } from './controllers/clientController.js';
import { petController } from './controllers/petController.js';
import { consultationController } from './controllers/consultationController.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/clients', clientController.getAll);
app.post('/clients', clientController.create);
app.get('/clients/:id', clientController.getById);

app.get('/pets', petController.getAll);
app.post('/pets', petController.create);
app.get('/pets/:id', petController.getById);

app.get('/consultations', consultationController.getAll);
app.post('/consultations', consultationController.create);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
