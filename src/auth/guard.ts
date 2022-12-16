import { Authorized } from "type-graphql/dist/decorators";
import { ResolversEnhanceMap } from "../../prisma/generated/type-graphql/enhance";
import { Role } from "../../prisma/generated/type-graphql/enums/Role";


export const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    user: [Authorized(Role.USER, Role.ADMIN)],
    users: [Authorized(Role.ADMIN, Role.USER)],
    updateUser: [Authorized(Role.INTERN, Role.USER, Role.LEAD, Role.ADMIN)],
    deleteUser: [Authorized(Role.INTERN, Role.USER, Role.LEAD, Role.ADMIN)],
  },
  Project: {
    project: [Authorized(Role.INTERN, Role.USER, Role.LEAD, Role.ADMIN)],
    projects: [Authorized(Role.INTERN, Role.USER, Role.LEAD, Role.ADMIN)],
    createProject: [Authorized(Role.LEAD, Role.ADMIN)],
    updateProject: [Authorized(Role.INTERN, Role.USER, Role.LEAD, Role.ADMIN)],
    deleteProject: [Authorized(Role.LEAD, Role.ADMIN)],
  },
  Ticket: {
    tickets: [Authorized(Role.INTERN, Role.USER, Role.LEAD, Role.ADMIN)],
    ticket: [Authorized(Role.INTERN, Role.USER, Role.LEAD, Role.ADMIN)],
  },
};
