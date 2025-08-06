import { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginOptions } from 'fastify'
import { comparePasswords, hashPassword } from '../utils/hash'

export async function pedidoRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {

    fastify.post('/api/pedido', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.get('/api/pedido', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.get('/api/pedido/:id', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.put('/api/pedido/:id', async (request: FastifyRequest, reply: FastifyReply) => {

    })

    fastify.delete('/api/pedido/:id', async (request: FastifyRequest, reply: FastifyReply) => {

    })
   
}