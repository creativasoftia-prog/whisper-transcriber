import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: 'Email y password son requeridos' });
      return;
    }

    const data = await registerUser(email, password);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: 'Email y password son requeridos' });
      return;
    }

    const data = await loginUser(email, password);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
