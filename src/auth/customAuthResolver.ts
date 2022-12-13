// Description: Custom resolver for login and register

<<<<<<< HEAD
import { Arg, Ctx, Field, InputType, Mutation,Resolver } from "type-graphql";
=======
import { Arg, Ctx, Field, InputType, Mutation,Query,Resolver } from "type-graphql";
>>>>>>> dev

const bcrypt = require('bcrypt');

import jwt from 'jsonwebtoken';
import { ApolloError } from "apollo-server";
<<<<<<< HEAD
import { MaxLength } from "class-validator";
import { UserCreateInput } from "../../prisma/generated/type-graphql";
import { IContext } from "../context";
=======
import { MinLength } from "class-validator";
import { User as IUser, UserCreateInput } from "../../prisma/generated/type-graphql";
import { IContext} from "../context";

>>>>>>> dev


@InputType()
export class LoginInput {
  @Field()
  email!: string;

  @Field()
<<<<<<< HEAD
  @MaxLength(8) //TODO: @MINLENGTH pas MAX
  password!: string;
}

//AUTH resolver
=======
  @MinLength(8)
  password!: string;
}

@InputType()
export class MeInput {
  @Field()
  token!: string;
}


>>>>>>> dev
@Resolver()
export class CustomAuthResolver {
  
  //LOGIN mutation
<<<<<<< HEAD
  @Mutation(() => String)
  async login( @Ctx() { prisma }: IContext, @Arg("data") data: LoginInput ) {
    console.log(data)
    const {email,password} = data
    const user = await prisma.user.findUnique({ where: { email } });

    if (user === null) {
      throw new ApolloError("Incorrect identifier", "INVALID_CREDENTIALS");
=======
  @Query(() => String)
  async login( @Ctx() context: IContext, @Arg("data") data: LoginInput ) {
    console.log(data)
    const {email,password} = data
    const user = await context.prisma.user.findUnique({ where: { email } });

    if (user === null) {
      throw new ApolloError("Identifiant inconnu", "INVALID_CREDENTIALS");
>>>>>>> dev
    }
    else{
      const isValid = await bcrypt.compare(password, user.password);

      if(!isValid){
<<<<<<< HEAD
        throw new ApolloError("Invalid password", "INVALID_CREDENTIALS");
=======
        throw new ApolloError("Mot de passe non valide", "INVALID_CREDENTIALS");
>>>>>>> dev
      }
      else {
        const token = jwt.sign({email: user.email}, process.env.JWT_SECRET || 'supersecret', {expiresIn: '1h'});
        return token;
      }
    }
  }
  
  //REGISTER mutation
  @Mutation(() => String)
  async register( @Ctx() { prisma }: IContext, @Arg("data") data: UserCreateInput) {
    
    const isExist = await prisma.user.findFirst({ where: { email: data.email}})
    if(isExist) {
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
<<<<<<< HEAD
=======


  /**
   * @param ctx Contain context with prisma and email of user
   * @Returns Returns null  the user contained in the token or null if the token is invalid
   * The token is verified in context.ts and push in ctx
   */
  @Query(() => IUser,{nullable:true})
  async me( @Ctx()  ctx : IContext ) {
    console.log(ctx.user)
    const email = ctx.user as string | null;

    if(email){
      const user = await ctx.prisma.user.findUnique({ where: { email } });

      //Retire des champs sensibles
      /* console.log(exclude(user,'password', 'createdAt', 'updatedAt') as IUser) */

      const {password, createdAt, updatedAt, ...rest} = user as IUser;
      return rest 
    }
    else{
      return null
    }
    
  }
>>>>>>> dev
}



<<<<<<< HEAD
=======



//A utiliser pour retirer des champs d'un objet du type password ...
function exclude(
  user: any,
  ...keys: any
) {
  for (let key of keys) {
    delete user[key]
  }
  return user
}  
>>>>>>> dev
