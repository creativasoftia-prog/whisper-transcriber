import express, { Application } from 'express';
import cors from 'cors';

import authRoutes from './modules/auth/routes/auth.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SaaS API is running' });
});

app.use('/api/auth', authRoutes);

export default app;
