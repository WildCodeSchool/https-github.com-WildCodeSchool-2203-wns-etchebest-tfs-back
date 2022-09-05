import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as tq from "type-graphql";

import { context }  from "./context";
import { applyResolversEnhanceMap, resolvers, ResolversEnhanceMap, Role } from "../prisma/generated/type-graphql";
import { CustomAuthResolver } from "./customAuthResolver";
import { customAuthChecker } from "./auth/customAuthChecker";
import { Authorized } from "type-graphql";


//Middleware to check if user is logged in on generated resolvers (from prisma-type-graphql)
const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    users: [Authorized(Role.USER)],
  },
  Project: {
    projects: [Authorized(Role.ADMIN)],
  }
};

applyResolversEnhanceMap(resolversEnhanceMap);

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [...resolvers, CustomAuthResolver],
    authChecker: customAuthChecker,
    validate: false,
  });

  await new ApolloServer({ schema, context }).listen({ port: 4000 }, () => {
    console.log(
      "🚀 Server ready at: http://localhost:4000/graphql"
    )
  });
};

app();
