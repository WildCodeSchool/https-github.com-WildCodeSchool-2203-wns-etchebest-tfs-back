// Description: Custom resolver for User

import { Arg, Ctx, Field, InputType,Query,Resolver } from "type-graphql";
import { IContext} from "../context";

@InputType()
export class isExistUserInput {
  @Field()
  email!: string;
}

@Resolver()
export class CustomUserResolver {

  @Query(() => Boolean)
  async isExistUser( @Ctx()  ctx : IContext, @Arg("data") data: isExistUserInput ) {
    const email = data.email
   console.log("email",email)
    if(email){
      const user = await ctx.prisma.user.findUnique({ where: { email } });
      return user ? true : false 
    }
  }
}





