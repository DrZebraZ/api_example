import { FastifyInstance } from 'fastify';
import healthCheck from './healthcheck';
import userRoutes from './routes/user.route';


export async function setRoutes(server:FastifyInstance){
  
  healthCheck(server)

  server.register(userRoutes, { prefix: '/user'});
}