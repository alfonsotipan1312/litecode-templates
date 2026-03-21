import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { catalogosRouter } from './routes/catalogos.js';
import { consultaRouter } from './routes/consulta.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/catalogos', authMiddleware, catalogosRouter);
app.use('/api/consulta', authMiddleware, consultaRouter);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
