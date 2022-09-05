import { AuthChecker } from "type-graphql";
import { IContext } from "../context";
export const customAuthChecker: AuthChecker<IContext> = ({ context }, roles) => {
  //@ts-ignore
  console.log({ role_user: context.user.role, roles_middleware: roles });
/*  if(roles.length === 0) {
    return context.user !== undefined;
  }
  if(!context.user) {
    return false;
  }
  if (roles.includes(context.user.role)) {
    console.log("ok")
    return true
  }  */
  return false
};