import { Context } from "../context";
const bcrypt = require("bcrypt");


export class Middelware {

  static encryptPassword(context: Context) {

    context.prisma.$use(async (params, next) => {
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