import { prisma } from "@prisma/client";
import { Arg, Authorized, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../prisma/generated/type-graphql/models/User";
import { UserCreateInput } from "../prisma/generated/type-graphql/resolvers/inputs/UserCreateInput"
import { Context } from "./context";
const bcrypt = require('bcrypt');

import jwt from 'jsonwebtoken';
import { ApolloError } from "apollo-server";
import { MaxLength } from "class-validator";

@InputType()
export class LoginInput {
  @Field()
  email!: string;

  @Field()
  @MaxLength(8)
  password!: string;
}


@Resolver()
export class CustomAuthResolver {

  @Query(() => String)
  async login(
    @Ctx() { prisma }: Context,
    @Arg("data") data: LoginInput,
  ) {
    const {email,password} = data
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
        return jwt.sign(JSON.stringify(user.email) , process.env.JWT_SECRET || 'supersecret');
      }
    }
  }

  @Mutation(() => String)
  async register( @Ctx() { prisma }: Context, @Arg("data") data: UserCreateInput) {
    //Password encrypt in middleware
    const user = await prisma.user.create({
      data: {
        ...data,
      },
    });

    return jwt.sign(JSON.stringify(user.email) , process.env.JWT_SECRET || 'supersecret');
  }
}



