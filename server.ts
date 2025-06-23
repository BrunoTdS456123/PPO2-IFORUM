
const express = require('express');
const session = require('express-session'); 
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

app.use(session({
	secret: '#456&$%$#@!@#',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src')));


app.get('/', (req: any, res: any) => {
  
  if (req.session.loggedin) {
    res.sendFile(path.join( __dirname, 'src',  'index.html'));
  } else  {
    res.sendFile(path.join( __dirname, 'src',  'login.html'));
  }
  res.end();
});

app.post('/login', (req: any, res: any) => {
  const { email, password } = req.body;

  prisma.user.findUnique({
    where: { email: email }
  }).then((user: any) => {
    if (user && user.password === password) {
      req.session.loggedin = true;
      req.session.email = email;
      req.session.userId = user.id; // Armazena o ID do usuário na sessão
      req.session.userName = user.name; // Armazena o nome do usuário na sessão
      res.sendFile(path.join(__dirname, 'src',  'index.html'));
    } else {
      res.status(401).send('Credenciais inválidas');
    }
  }).catch((error: any) => {
    console.error(error);
    res.status(500).send('Erro ao autenticar usuário');
  });
  
});

app.get('/cadastro', (req: any, res: any) => {
  if (req.session.loggedin) {
    res.sendFile(path.join( __dirname, 'src',  'index.html'));
  } else {
    res.sendFile(path.join( __dirname, 'src',  'cadastro.html'));
  }
  res.end();
});



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


//Postagens
// Rota para criar uma nova postagem
app.post('/posts', async (req: any, res: any) => {
  const { title, content, authorId } = req.body;

  try {
    // Verifica se o autor existe
    const authorExists = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      return res.status(400).json({ error: 'Autor não encontrado.' });
    }

    // Cria a postagem no banco de dados
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: authorId }, // Conecta a postagem ao autor
        },
      },
    });

    res.status(201).json({ message: 'Postagem criada com sucesso!', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar postagem.' });
  }
});

// Rota para listar todas as postagens
app.get('/posts', async (req: any, res: any) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true, // Inclui os dados do autor
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar postagens.' });
  }
});


// Rota para adicionar um like a uma postagem
app.post('/posts/:id/like', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Incrementa o número de likes da postagem
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { like: { increment: 1 } },
    });

    res.status(200).json({ message: 'Like adicionado com sucesso!', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar like.' });
  }
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});