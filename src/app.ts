import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { userRoutes } from './routes/user.route.ts'
import { storeavailableRoutes } from './routes/storeavailable.route.ts'
import prismaPlugin from './plugins/prismaPlugin'
import fastifyMultipart from '@fastify/multipart'
//import nodemailerPlugin from './plugins/nodemailerPlugin'
import websocketPlugin from './services/socket.ts'
import cookie, { FastifyCookieOptions } from "@fastify/cookie"
import cors from "@fastify/cors"


const server = Fastify()

server.register(prismaPlugin)
//server.register(nodemailerPlugin)
server.register(fastifyMultipart)
server.register(userRoutes)
server.register(cookie)
server.register(storeavailableRoutes)
server.register(websocketPlugin)
await server.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true
})



const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' })
    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
