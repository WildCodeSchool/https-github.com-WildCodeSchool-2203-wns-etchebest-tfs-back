// Description: Custom resolver for login and register

import { Arg, Ctx, Field, InputType, Mutation,Query,Resolver } from "type-graphql";

const bcrypt = require('bcrypt');

import jwt from 'jsonwebtoken';
import { ApolloError } from "apollo-server";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { User } from "../../prisma/generated/type-graphql";
import { IContext} from "../context";



@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(8)
  password!: string;
}

@InputType()
export class RegisterInput {
  @Field({ nullable: false })
  @IsNotEmpty({ message: "Firstname is required"})
  firstname!: string;

  @Field({ nullable: false })
  @IsNotEmpty({ message: "Lastname is required"})
  lastname!: string;

  @Field({ nullable: false })
  @IsEmail({ message: "Email is not valid"})
  @IsNotEmpty()
  email!: string;

  @Field({ nullable: false })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;
}

@InputType()
export class MeInput {
  @Field()
  token!: string;
}


@Resolver()
export class CustomAuthResolver {


  //LOGIN query
  @Query(() => String)
  async login( @Ctx() context: IContext, @Arg("data") data: LoginInput ) {

    if(!process.env.JWT_SECRET){throw new ApolloError("JWT_SECRET is not defined")}
    const {email,password} = data
    const user = await context.prisma.user.findUnique({ where: { email } });

    if (user === null) {
      throw new ApolloError("Identifiant inconnu", "INVALID_CREDENTIALS");
    }
    else{
      const isValid = await bcrypt.compare(password, user.password);

      if(!isValid){
        throw new ApolloError("Mot de passe non valide", "INVALID_CREDENTIALS");
      }
      else {
        const token = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        return token;
      }
    }
  }
  
  //REGISTER mutation
  @Mutation(() => String)
  async register( @Ctx() { prisma }: IContext, @Arg("data") data: RegisterInput) {

    if(!process.env.JWT_SECRET){throw new ApolloError("JWT_SECRET is not defined")}

    const isExist = await prisma.user.findFirst({ where: { email: data.email}})
    if(isExist) {
      throw new ApolloError('A user is already registered with the email ' + data.email, 'USER_ALREADY_EXISTS')
  }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(data.password, salt)
    data.password = hash

    const {firstname, lastname, email, password} = data
    try {
      const user = await prisma.user.create({
        data: {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: email.trim().toLowerCase(),
          password
        },
      });

    const token =  jwt.sign({email: user.email}, process.env.JWT_SECRET , {expiresIn: '1h'});
    return token;
    } catch (error) {
      throw new ApolloError("Internal error");
    }
  }


  /**
   * @param ctx Contain context with prisma and email of user
   * @Returns Returns null  the user contained in the token or null if the token is invalid
   * The token is verified in context.ts and push in ctx
   */
  @Query(() => User,{nullable:true})
  async me( @Ctx()  ctx : IContext ) {
    const email = ctx.user as string | null;

    if(email){
      try {
        const user = await ctx.prisma.user.findUnique({ where: { email } });
        return user
      } catch (error) {
        console.error(error)
        return null
      }
    }
    else{
      return null
    }
  }
}

