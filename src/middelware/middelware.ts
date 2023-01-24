import { Prisma } from "@prisma/client";
import { IContext } from "../context";
const bcrypt = require("bcrypt");


export class Middelware {

  //Intercepte les requêtes de création de user et hash le password
  //  static encryptPassword(context: ()=>({ req }: any) => IContext) {
  //   context.prisma.$use(async (params:any, next:any) => {
  //     if (params.action === "create" && params.model === "User") {
  //       try {
  //         const user = params.args.data;
  //         const salt = bcrypt.genSaltSync(10);
  //         const hash = bcrypt.hashSync(user.password, salt);
  //         user.password = hash;
  //         return next(params);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   });
  // } 
}
