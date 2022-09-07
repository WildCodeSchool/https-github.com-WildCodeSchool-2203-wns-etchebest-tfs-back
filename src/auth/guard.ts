import { Authorized } from "type-graphql/dist/decorators";
import { ResolversEnhanceMap } from "../../prisma/generated/type-graphql/enhance";
import { Role } from "../../prisma/generated/type-graphql/enums/Role";

//Middleware to check if user is logged in on generated resolvers (from prisma-type-graphql)
export const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    users: [Authorized(Role.USER)],
  },
  Project: {
    projects: [Authorized(Role.ADMIN)],
  },
  Ticket: {
    tickets: [Authorized(Role.USER)],
  },
};