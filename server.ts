import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Endpoint para cadastro
app.post('/register', async (req: Request, res: Response) => {
  const { email, name, password, nickname } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
        nickname,
        bio: '',
      },
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});