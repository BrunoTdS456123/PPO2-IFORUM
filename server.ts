import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import path from 'path';

const app = express();
const prisma = new PrismaClient();


app.use(express.static(path.join(__dirname, 'src')));
app.get('/', (req: any, res: any) => {
  res.redirect('./src/index.html');
})

app.use(express.json());
app.use(cors());

// Rota para criar um novo usuário
app.post('/register', async (req: any, res: any) => {
  const { email, name, nickname, password } = req.body;

  try {
    // Verifica se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    // Cria o usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        nickname,
        password,
        bio: '', // Bio inicializada como string vazia
      },
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});



app.get('/', (req: any, res: any) => {
  res.sendFile(__dirname + 'index.html');
})

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});