import { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SignJWT, jwtVerify } from 'jose';
import { comparePasswords, hashPassword } from '../utils/hash';
import 'dotenv/config'

// ==========================================
// 🔧 PREHANDLERS REUTILIZÁVEIS
// ==========================================

/**
 * PreHandler para verificar autenticação JWT
 * Pode ser reutilizado em qualquer rota protegida
 */
async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    console.log('🔐 Verificando autenticação...');
    
    // Pegar token do cookie ou header
    const token = request.cookies.session || request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return reply.status(401).send({
        error: 'Token não fornecido',
        message: 'Acesso negado. Faça login primeiro.'
      });
    }

    // Verificar token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Adicionar dados do usuário ao request para usar no handler
    request.user = {
      userId: payload.userId as string,
      sub: payload.sub as string
    };
    
    console.log('✅ Usuário autenticado:', request.user.userId);
    
  } catch (error) {
    console.error('❌ Erro na autenticação:', error);
    return reply.status(401).send({
      error: 'Token inválido ou expirado',
      message: 'Faça login novamente'
    });
  }
}

/**
 * PreHandler para validar campos obrigatórios
 * Genérico e reutilizável
 */
function validateRequiredFields(fields: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const missing = fields.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return reply.status(400).send({
        error: 'Campos obrigatórios ausentes',
        missing
      });
    }
  };
}

/**
 * PreHandler para logging de requisições
 */
async function logRequest(request: FastifyRequest, reply: FastifyReply) {
  console.log(`📝 ${request.method} ${request.url} - IP: ${request.ip}`);
}

/**
 * PreHandler para verificar se usuário já existe (no registro)
 */
async function checkUserExists(request: FastifyRequest, reply: FastifyReply) {
  const { email } = request.body as any;
  
  const existingUser = await request.server.prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    return reply.status(409).send({
      error: 'Usuário já existe',
      message: 'Este e-mail já está cadastrado'
    });
  }
}

// ==========================================
// 🛣️ ROTAS COM PREHANDLERS
// ==========================================

export async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {

  // ==========================================
  // 🔓 LOGIN - Com preHandlers inline
  // ==========================================
  fastify.post('/api/login', {
    // Opção 1: preHandler único
    preHandler: logRequest,
    
    // Opção 2: múltiplos preHandlers (executam em sequência)
    // preHandler: [logRequest, validateRequiredFields(['email', 'password'])],
    
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as any;

      // Validação manual (poderia estar em preHandler)
      if (!email || !password) {
        return reply.status(400).send({
          error: 'Email e senha são necessários'
        });
      }

      // Buscar usuário
      const user = await fastify.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(401).send({
          error: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const isMatch = await comparePasswords(password, user.password);

      if (!isMatch) {
        return reply.status(401).send({
          error: 'Credenciais inválidas'
        });
      }

      // Criar JWT
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({ 
        userId: user.id,
        sub: user.id
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);

      const cookieOptions = {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      };

      return reply
        .setCookie("session", token, cookieOptions)
        .send({
          message: "Login bem sucedido",
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });

    } catch (err) {
      console.error('❌ Erro no login:', err);
      return reply.status(500).send({
        error: 'Erro interno do servidor',
        details: err instanceof Error ? err.message : 'Erro desconhecido'
      });
    }
  });

  // ==========================================
  // 📝 REGISTER - Com múltiplos preHandlers
  // ==========================================
  fastify.post('/api/register', {
    preHandler: [
      logRequest,
      validateRequiredFields(['name', 'email', 'password']),
      checkUserExists
    ]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, email, password } = request.body as any;

      const hashedPassword = await hashPassword(password);

      const newUser = await fastify.prisma.$transaction(async (tx: any) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
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
          },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        });

        return user;
      });

      return reply.status(201).send({
        message: 'Usuário criado com sucesso',
        user: newUser
      });

    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      return reply.status(500).send({
        error: 'Falha ao criar usuário',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  });

  // ==========================================
  // 🔐 GET USERS - Rota protegida com autenticação
  // ==========================================
  fastify.get('/api/users', {
    preHandler: [authenticateUser] // Requer autenticação
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // request.user está disponível graças ao preHandler authenticateUser
      console.log('👤 Usuário fazendo a requisição:', request.user?.userId);

      const users = await fastify.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
          // Não retornar password!
        }
      });

      return reply.send({
        users,
        total: users.length
      });

    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      return reply.status(500).send({
        error: 'Erro ao buscar usuários'
      });
    }
  });

  // ==========================================
  // 🚪 LOGOUT - Exemplo adicional
  // ==========================================
  fastify.post('/api/logout', {
    preHandler: authenticateUser
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    return reply
      .clearCookie('session', { path: '/' })
      .send({ message: 'Logout realizado com sucesso' });
  });

  // ==========================================
  // 👤 GET PROFILE - Perfil do usuário autenticado
  // ==========================================
  fastify.get('/api/profile', {
    preHandler: authenticateUser
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user?.userId;

      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          //createdAt: true,
          //wallet: true,
          //xp: true
        }
      });

      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      return reply.send({ user });

    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      return reply.status(500).send({ error: 'Erro ao buscar perfil' });
    }
  });
}

// ==========================================
// 🔧 TIPOS PARA TYPESCRIPT
// ==========================================

// Adicione isso em um arquivo de tipos (ex: types/fastify.d.ts)
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      sub: string;
    };
  }
}