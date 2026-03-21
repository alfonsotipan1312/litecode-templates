import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-dev';

router.post('/login', (req: Request, res: Response) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y password requeridos' });
  }
  // Demo: acepta admin/123
  if (usuario === 'admin' && password === '123') {
    const token = jwt.sign(
      { usuario, rol: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({ token, usuario: 'admin' });
  }
  return res.status(401).json({ error: 'Credenciales inválidas' });
});

export { router as authRouter };
