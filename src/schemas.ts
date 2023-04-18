//import { userSchema } from "./routes/user.schema";
import { z } from "zod";

const UserToken = z.object({
  id: z.bigint({required_error: "Must inform the ID"}),
  login: z.string({required_error: "Must inform a login"}).min(5, {message: 'Min 5'}),
  roles: z.any(),
  salt: z.string(),
  hash: z.string()
})
export type UserTokenSchema = z.infer<typeof UserToken>


export async function setSchemas(server:any){
  for (let schema of [
   // ...userSchema
  ]
  ){
    await server.addSchema(schema);
  }
}