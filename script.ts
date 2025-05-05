import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function registerUser(email: string, name: string, password: string, nickname: string) {
  try {
    // Verifica se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('E-mail já cadastrado.')
    }

    // Cria o usuário sem hash na senha
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password, // Corrigido para "password"
        nickname,
        bio: '', // Bio pode ser inicializada como uma string vazia
      },
    })

    console.log('Usuário criado com sucesso:', newUser)
    return newUser
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message)
    throw error
  }
}

// Exemplo de uso
async function main() {
  try {
    // Registro de um novo usuário
    await registerUser('joao@example.com', 'João', 'senha123', 'joaonickname')
  } catch (error) {
    console.error(error)
  }
}

main()