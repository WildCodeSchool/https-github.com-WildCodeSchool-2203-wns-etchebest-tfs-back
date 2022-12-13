import { Prisma } from "@prisma/client";
import { IContext } from "../context";
const bcrypt = require("bcrypt");


export class Middelware {

  //Intercepte les requêtes de création de user et hash le password
 /*  static encryptPassword(context: ()=>({ req }: any) => IContext) {
    context.prisma.$use(async (params, next) => {
      if (params.action === "create" && params.model === "User") {
        try {
          const user = params.args.data;
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(user.password, salt);
          user.password = hash;
          return next(params);
        } catch (error) {
          console.log(error);
        }
      }
    });
  } */
 
  static async excludePasswordMiddleware(params:Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>){
    const result = await next(params)
    if (params?.model === 'User' && params?.args?.select?.password !== true) {
      delete result.password
    }
    return result
  }
}
