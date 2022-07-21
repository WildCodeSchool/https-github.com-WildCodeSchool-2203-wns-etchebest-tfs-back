import { AuthChecker } from "type-graphql";
// @ts-ignore
export const customAuthChecker: AuthChecker<ContextType> = (
  { root, args, context, info },
  roles,
) => {
  // here you can read user from context
  // and check his permission in db against `roles` argument
  // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]
  console.log(context)
  return true; // or false if access denied
};