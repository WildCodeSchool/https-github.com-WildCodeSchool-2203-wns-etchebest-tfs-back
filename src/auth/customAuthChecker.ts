import { ApolloError } from "apollo-server";
import { AuthChecker } from "type-graphql";
import { IContext } from "../context";

//context (prisma client and user email) sent on each request
//roles: (check: index.ts -> resolversEnhanceMap)
export const customAuthChecker: AuthChecker<IContext> = async (
  { context },
  role
) => {
  let user = null;
  if (context.user) {
    try {
      user = await context.prisma.user.findUnique({
        where: { email: context.user },
      });
      console.log({ role, userRoles: user?.role });
    } catch (error) {
      throw new ApolloError(
        "Cannot find user with this token",
        "INVALID_TOKEN",
        { error }
      );
    }
  }

  //Check route required roles and user roles

  // if no roles required
  if (role.length === 0) {
    return true; //access granted
  }

  // if user has no roles
  else if (!user?.role) {
    return false; //acces denied
  }
  // route require roles and user has role
  else if (user && role.includes(user.role)) {
    return true;
  }
  return false;
};
