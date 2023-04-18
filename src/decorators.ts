const jwtValidator = require('jsonwebtoken')
import { FastifyInstance } from 'fastify';
const crypto = require('node:crypto')
import { JWTKey, encryptKey, logger } from './server';
import { UserTokenSchema } from './schemas';

export default async function insertDecorators(server:FastifyInstance){
  server.decorate(
    'RequireAuth',
    async (request:any, reply:any, done:any) => {
    try{
      const token = request.headers.authorization.split(' ')[1]
      const jwt = _decrypt(token)
      var decoded = jwtValidator.verify(jwt, JWTKey);
      console.log(decoded)
      const user:UserTokenSchema = {
        login: decoded.login,
        hash: decoded.hash,
        salt: decoded.salt,
        id: decoded.id,
        roles: decoded.roles
      }
      request.user = user
    }catch(e){
      reply.code(403).send('UNAUTHORIZED')
    }
  })
  
  server.decorate(
    'RequireADM',
    async (request:any, reply:any, done:any) => {
    try{
      if(request.user.roles.includes('ADM')){
        done()
      }else{
        logger.error({"ADM_REQUIRED":"Not enough ROLE access"}, 'User without rights' , 10, request)
        throw Error()
      }
    }catch(e){
      reply.code(403).send('UNAUTHORIZED')
    }
  })
}



function _decrypt(encryptedText:string) {
  try{
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(encryptKey).digest('base64').substr(0, 32);

    const parts = encryptedText.split(':');
    const ivHex = parts.shift();
    if (!ivHex) {
      throw new Error('IV is missing');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = parts.join(':');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }catch(e){
    return new Error()
  }
}