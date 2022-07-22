import { AuthChecker } from "type-graphql";
// @ts-ignore
export const customAuthChecker: AuthChecker<ContextType> = ({ context: { user } }, roles) => {
  
  return true
};