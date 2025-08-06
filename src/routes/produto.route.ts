import { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginOptions } from 'fastify'
import { comparePasswords, hashPassword } from '../utils/hash'

export async function produtoRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {

    fastify.post('/api/produto', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.get('/api/produto', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.get('/api/produto/:id', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.put('/api/produto/:id', async (request: FastifyRequest, reply: FastifyReply) => {

    })

    fastify.delete('/api/produto/:id', async (request: FastifyRequest, reply: FastifyReply) => {

    })
   
}