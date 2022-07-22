import { prisma } from "@prisma/client";
import { Arg, Authorized, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../prisma/generated/type-graphql/models/User";
import { UserCreateInput } from "../prisma/generated/type-graphql/resolvers/inputs/UserCreateInput"
import {IContext}  from "./context";
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
    @Ctx() { prisma }: IContext,
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
        const token = jwt.sign({user: user.email}, process.env.JWT_SECRET || 'supersecret');
        return token;
      }
    }
  }
  
  @Mutation(() => String)
  async register( @Ctx() { prisma }: IContext, @Arg("data") data: UserCreateInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({user: user.email}, process.env.JWT_SECRET || 'supersecret');
    return token;
  }
}



