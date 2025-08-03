import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { userRoutes } from './routes/user.route'
import prismaPlugin from './plugins/prismaPlugin'
import nodemailerPlugin from './plugins/nodemailerPlugin'

const server = Fastify()

server.register(prismaPlugin)
server.register(nodemailerPlugin)
server.register(userRoutes)



const start = async () => {
  try {
    await server.listen({ port: 3000 })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()