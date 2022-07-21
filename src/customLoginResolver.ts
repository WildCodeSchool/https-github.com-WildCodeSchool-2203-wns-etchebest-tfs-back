import { prisma } from "@prisma/client";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../prisma/generated/type-graphql/models/User";
import { Context } from "./context";
const bcrypt = require('bcrypt');

import jwt from 'jsonwebtoken';
import { ApolloError } from "apollo-server";




@Resolver()
export class CustomLoginResolver {

  @Query(() => String)
  async login(
    @Ctx() { prisma }: Context,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user === null) {
      throw new ApolloError("User not found");
    }
    else{
      const isValid = await bcrypt.compare(password, user.password);

      if(!isValid){
        throw new ApolloError("Invalid password");
      }
      else {
        return jwt.sign(JSON.stringify(user.email) , 'supersecret');
      }
    }
  }
}

export default CustomLoginResolver;
