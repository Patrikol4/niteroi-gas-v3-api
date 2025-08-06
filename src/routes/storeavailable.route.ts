import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";

export async function storeavailableRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {

    fastify.post('/api/store-available', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { isOpen } = request.body as any
            const storeAvailable = await fastify.prisma.storeAvailable.create({
                data: { isOpen }
            })

            return reply.send(storeAvailable)
        } catch (error) {
            console.log("Erro ao salvar horário da loja aberta.")
        }
    })
    //
    fastify.get('/api/store-available/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as any

            const storeAvailable = await fastify.prisma.storeAvailable.findUnique({
                where: { id }
            })

            if (!storeAvailable) {
                return reply.status(404).send({ message: 'REGISTRO NÃO ENCONTRADO ' })
            }
            return reply.send(storeAvailable)
        } catch (error) {
            return reply.status(500).send({ message: (error as Error).message })
        }
    })

    fastify.put('/api/store-available', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id, isOpen } = request.body as any;
            const storeAvailable = await fastify.prisma.storeAvailable.update({
                where: { id },
                data: { isOpen }
            })

            return reply.send(storeAvailable)
        } catch (error) {
            return reply.status(500).send({ message: (error as Error).message })
        }
    })
}