import { AuthChecker } from "type-graphql";
import { IContext } from "../context";
//Context est envoyer à chaque requete. il contient le prisma client et le user
//Roles correspond au roles attribué à la query/mutation (voir: index.ts -> resolversEnhanceMap)
export const customAuthChecker: AuthChecker<IContext> = async ({ context }, roles) => {

  let user = null
  if(context.user) {  
    user = await context.prisma.user.findUnique({ where: { email: context.user } });
  }
  
  console.log({user_role:user, roles});
 
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
