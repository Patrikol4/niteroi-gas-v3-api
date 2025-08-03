import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { jwtVerify, SignJWT } from 'jose';
import { FastifyCookie } from '@fastify/cookie'

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'], // é 256
        });
        return payload;
    } catch (err) {
        console.log(' Falhei em verificar sessão ');
    }
}

export async function createSession( userId: string, reply: FastifyReply) {
    const expire = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expire });

    reply.setCookie('session', session, {
        httpOnly: false,
        secure: false,
        expires: expire,
        sameSite: 'lax',
        path: '/',
        domain: '',
    });
}

// puxar id
export async function getSession(request: FastifyRequest) {
    const session = request.cookies.session;
    const payload = await decrypt(session);

    if (!payload || !payload.userId) {
        return null;
    }

    return payload.userId as string;
}

export async function getUserById(request: FastifyRequest) {
    // pegar id do usuário logado através do cookie
    const userId = await getSession(request);

    if (!userId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    return user;
}

export async function updateSession(request: FastifyRequest, reply: FastifyReply) {
    const session = request.cookies.session;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null;
    }

    const expire = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    reply.setCookie('session', session, {
        httpOnly: true,
        secure: true,
        expires: expire,
        sameSite: 'lax',
        path: '/'
    });
}

export async function deleteSession(reply: FastifyReply) {
    reply.clearCookie('session', {
        path: '/',
        domain: ''
    });
}

// Middleware para verificar autenticação
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const userId = await getSession(request);
    
    if (!userId) {
        return reply.status(401).send({ error: 'Não autorizado' });
    }
    
    // Adicionar userId ao request para uso posterior
    (request as any).userId = userId;
}

// Hook de pré-handler para rotas que precisam de autenticação
export const requireAuth = {
    preHandler: authMiddleware
};