import { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginOptions } from 'fastify';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/auth';
import { comparePasswords, hashPassword } from '../utils/hash';
import { UserLogin, UserCreate, User } from '../interfaces/user.interface'
import { createSession } from '../lib/session';

// Definir o tipo do body da requisiçãO
// Handler da rota de login
export async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {


  fastify.post('/api/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as any;

      if (!email || !password) {
        return reply.send({
          error: 'Email e senhas são necessários para o login'
        });
      }

      const user = await fastify.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.send({
          error: 'Credenciais inválidas'
        });
      } const isMatch = await comparePasswords(password, user.password);

      if (!isMatch) {
        return reply.status(401).send({
          message: 'Credenciais inválidas'
        });
      }

      // Gerar JWT
      const token = createSession(user.id, reply);
      // Retornar token no corpo da resposta
      return reply.status(200).send({ token });

    } catch (err) {
      // Bloco catch vazio como no original
    }
  })

  fastify.post('/api/register', async (request, reply) => {

    try {
      const { name, email, password } = request.body as any

      if (!name || !email || !password) {
        return reply.status(400).send({
          error: 'Missing required fields'
        });
      }

      const hashedPassword = await hashPassword(password)

      const newUser = await fastify.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword, // In production: hash password before saving
            wallet: {
              create: {
                balance: 10
              }
            },
            xp: {
              create: {
                current: 10,
                total: 10
              }
            }
          }
        });

        // ENVIAR E-MAIL VIA NODEMAILER
        await fastify.mailer.sendMail({
          from: '"Realms Under" <contato@realmsunder.space>',
          to: email,
          subject: 'Bem-vindo ao Realms!',
          text: "Seja bem-vindo ao Realms. Recebemos seu cadastro e ele foi bem sucedido!",
          html: "<h1>Bem-vindo!</h1><p>Seja muito bem-vindo a nossa plataforma Realms Under!</p>"
        });
        reply.send({ message: "E-mail enviado e usuário criado!" })

        return user;
      })
    } catch (error) {
      console.error('POST Error:', error);
      return reply.status(500).send({
        error: 'User creation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  )
  fastify.get('/api/users', async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const users = await fastify.prisma.user.findMany({
      })
      reply.send(users)
    } catch (error) {
      console.error("Erro ao buscar usuarios")
      reply.status(400)
    }
  })

}