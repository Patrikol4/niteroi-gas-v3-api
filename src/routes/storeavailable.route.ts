import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";

export async function storeavailableRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions){
    
    fastify.post('/api/store-available', async(request: FastifyRequest, reply: FastifyReply) => {
        
    })
    //
    fastify.get('/api/store-available/:id', async (request: FastifyRequest, reply: FastifyReply) => {

    })

    fastify.put('/api/store-available/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        
    })
}