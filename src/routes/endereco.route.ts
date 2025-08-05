import { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginOptions } from 'fastify'
import { comparePasswords, hashPassword } from '../utils/hash'

export async function enderecoRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {

    fastify.post('/api/addendereco', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.get('/api/enderecos', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.get('/api/endereco_id', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.put('/api/enderecoupdate', async (request: FastifyRequest, reply: FastifyReply) => {

    })

    fastify.delete('/api/deletarendereco', async (request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.get('/api/endereco_user', async( request: FastifyRequest, reply: FastifyReply) => {

    })
    //
    fastify.delete('/api/deleteAllEndereco', async(request: FastifyRequest, reply: FastifyReply) => {

    })
}