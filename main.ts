import 'dotenv/config'
import server, { logger } from './src/server'
import { setRoutes } from './src/routers'
import { setSchemas } from './src/schemas'
import insertDecorators from './src/decorators'

async function main(){
  try{
    if (!process.env.JWTKey || !process.env.encryptKey){
      throw Error("No keys on .env")
    }
    await insertDecorators(server)
    await setRoutes(server)
    await setSchemas(server)
    const port = (process.env.PORT || 5000)
    const host = (process.env.HOST || "0.0.0.0")
    await server.listen({ port: port, host: host})
    logger.info(`server ready at http://${host}:${port}`)
  }catch(e){
    logger.warn(`${e}`, "Server Disconnected")
  }
}
main()
