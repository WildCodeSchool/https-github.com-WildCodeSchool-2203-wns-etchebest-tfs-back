import { IContext } from "../context";
const bcrypt = require("bcrypt");


export class Middelware {

  static encryptPassword(context:IContext ) {
    context.prisma.$use(async (params:any, next:any) => {
      if (params.action === "create" && params.model === "User") {
        const user = params.args.data
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
      }
      return next(params);
    });
  }
    
}
