import { Arg, Ctx, Field, InputType, Mutation,Resolver } from "type-graphql";

const bcrypt = require('bcrypt');

import jwt from 'jsonwebtoken';
import { ApolloError } from "apollo-server";
import { MaxLength } from "class-validator";
import { UserCreateInput } from "../../prisma/generated/type-graphql";
import { IContext } from "../context";


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
  
  @Mutation(() => String)
  async login( @Ctx() { prisma }: IContext, @Arg("data") data: LoginInput ) {
    console.log(data)
    const {email,password} = data
    const user = await prisma.user.findUnique({ where: { email } });

    if (user === null) {
      throw new ApolloError("Incorrect identifier", "INVALID_CREDENTIALS");
    }
    else{
      const isValid = await bcrypt.compare(password, user.password);

      if(!isValid){
        throw new ApolloError("Invalid password", "INVALID_CREDENTIALS");
      }
      else {
        const token = jwt.sign({email: user.email}, process.env.JWT_SECRET || 'supersecret', {expiresIn: '1h'});
        return token;
      }
    }
  }
  
  @Mutation(() => String)
  async register( @Ctx() { prisma }: IContext, @Arg("data") data: UserCreateInput) {
    
    const isExited = await prisma.user.findFirst({ where: { email: data.email}})
    if(isExited) {
      throw new ApolloError('A user is already registered with the email ' + data.email, 'USER_ALREADY_EXISTS')
  }
    //---- A enlever quand le middleware de hash sera fonctionnel -------
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(data.password, salt)
    data.password = hash
    //--------------------------------------------------------
    const user = await prisma.user.create({
      data: {
        ...data,
      },
    });

    const token =  jwt.sign({email: user.email}, process.env.JWT_SECRET || 'supersecret', {expiresIn: '1h'});
    return token;
  }
}



