import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
    }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, opts) => {
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error']
    })

    try {

        server.decorate('prisma', prisma)
        await server.prisma.$connect()
        console.log("Servidor está se conectando ao banco de dados do MongoDB..Aguarde")
        //const count = await prisma.user.count()
        console.log("Servidor conectado ao Prisma com sucesso", process.env.DATABASE_URL)
        //console.log("Existem atualmente", count, "usuários registrados no sistema.")
        server.addHook('onClose', async (server) => {
            await server.prisma.$disconnect()
        })
    } catch (error) {
        console.error(error, "Erro ao conectar o plugin do Prisma")
    }
})

export default prismaPlugin