import { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginOptions } from 'fastify'
import { comparePasswords, hashPassword } from '../utils/hash'

export async function produtoRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {

    fastify.post('/api/produto', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { imagem_produto, nome_produto, preco_produto } = request.body as any

            const produto = await fastify.prisma.produto.create({
                data: {
                    imagem_produto,
                    nome_produto,
                    preco_produto
                }
            })

            return reply.send(produto)
        } catch (error) {
            console.log("Erro ao tentar cadastrar produto novo")
        }
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