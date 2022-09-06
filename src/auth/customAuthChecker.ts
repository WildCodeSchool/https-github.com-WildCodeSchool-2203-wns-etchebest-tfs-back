import { AuthChecker } from "type-graphql";
import { IContext } from "../context";
//Context est envoyer à chaque requete. il contient le prisma client et le user
//Roles correspond au roles attribué à la query/mutation (voir: index.ts -> resolversEnhanceMap)
export const customAuthChecker: AuthChecker<IContext> = ({ context }, roles) => {
  //@ts-ignore
  console.log(context.user?.roles);
  console.log(roles);
  if(roles.length === 0) {
    return context.user !== undefined;
  }
  if(!context.user) {
    return false;
  }
  if (roles.includes(context.user.roles)) {
    console.log("ok")
    return true
  } 
  return false
};