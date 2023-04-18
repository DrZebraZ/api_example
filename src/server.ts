import 'dotenv/config'
import DatabaseConnector from "./data/database-connector";
export const databaseConnector = new DatabaseConnector();
import Logger from './entity/logger'

export const logger = new Logger()
export const JWTKey = process.env.JWTKey
export const encryptKey = process.env.encryptKey

const server = require('fastify')();

server.register(require('@fastify/jwt'), {
  secret: JWTKey
})

export default server