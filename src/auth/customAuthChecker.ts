import { ApolloError } from "apollo-server";
import { AuthChecker } from "type-graphql";
import { IContext } from "../context";
//Context est envoyer à chaque requete. il contient le prisma client et le user
//Roles correspond au roles attribué à la query/mutation (voir: index.ts -> resolversEnhanceMap)
export const customAuthChecker: AuthChecker<IContext> = async ({ context }, roles) => {
  
  let user = null
  if(context.user) { 
    console.log({authChecker:{contextUser: context.user}})
    try {
      user = await context.prisma.user.findUnique({ where: { email: context.user } });
    } catch (error) {
       throw new ApolloError("Impossible to find user with this token", "INVALID_TOKEN", {error});
    }
  }
  
  console.log({user_role:user?.roles, roles});
 
  if(roles.length === 0) {
    return true;
  }
  else if (!user?.roles) {
    return false;
  }
  else if (user && roles.includes(user.roles)) {
    return true
  }  
  return false
};
