import { ApolloError } from "apollo-server";
import { MiddlewareFn } from "type-graphql";
import { Authorized, UseMiddleware } from "type-graphql/dist/decorators";
import { ResolversEnhanceMap } from "../../prisma/generated/type-graphql/enhance";
import { Role } from "../../prisma/generated/type-graphql/enums/Role";
import { IContext } from "../context";

export const isUserDeletingOrUpdateOwnAccount: MiddlewareFn<IContext> = async ({ context, args,info,root },next) => {
  console.log("context" + info.fieldName)
  if (context.user) {
    const userAuthed = await context.prisma.user.findUnique({
      where: { email: context.user },
    });
    if (userAuthed && (userAuthed.roles === "ADMIN" || userAuthed.id === args.where.id)) {
      return next();
    }
    throw new ApolloError(
      `Vous n'êtes pas autorisé à ${info.fieldName === "updateUser" ? "mettre à jour" : "supprimer"} ce compte`
    );
  }
  throw new ApolloError(
    `Vous devez être connecté pour ${info.fieldName === "updateUser" ? "mettre à jour" : "supprimer"} ce compte`
  );
}


export const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    user: [Authorized(Role.ADMIN, Role.LEAD)],
    users: [Authorized(Role.ADMIN, Role.LEAD)],
    updateUser: [
      Authorized(Role.INTERN, Role.DEV, Role.LEAD, Role.ADMIN),
      UseMiddleware(isUserDeletingOrUpdateOwnAccount)
    ],
    deleteUser: [
      Authorized(Role.INTERN, Role.DEV, Role.LEAD, Role.ADMIN), 
      UseMiddleware(isUserDeletingOrUpdateOwnAccount)
    ],
  },
  Project: {
    project: [Authorized(Role.INTERN, Role.DEV, Role.LEAD, Role.ADMIN)],
    projects: [Authorized(Role.INTERN, Role.DEV, Role.LEAD, Role.ADMIN)],
    createProject: [Authorized(Role.LEAD, Role.ADMIN)],
    updateProject: [Authorized(Role.INTERN, Role.DEV, Role.LEAD, Role.ADMIN)],
    deleteProject: [Authorized(Role.LEAD, Role.ADMIN)],
  },
  Ticket: {
    tickets: [Authorized(Role.INTERN, Role.DEV, Role.LEAD, Role.ADMIN)],
    ticket: [Authorized(Role.INTERN, Role.DEV, Role.LEAD, Role.ADMIN)],
  },
};
