import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { userRoutes } from './routes/user.route.ts'
import { storeavailableRoutes } from './routes/storeavailable.route.ts'
import prismaPlugin from './plugins/prismaPlugin.ts'
import fastifyMultipart from '@fastify/multipart'
//import nodemailerPlugin from './plugins/nodemailerPlugin'
import websocketPlugin from './services/socket.ts'

const server = Fastify()

server.register(prismaPlugin)
//server.register(nodemailerPlugin)
server.register(fastifyMultipart)
server.register(userRoutes)
server.register(storeavailableRoutes)
server.register(websocketPlugin)



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
