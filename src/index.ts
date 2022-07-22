import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as tq from "type-graphql";

import { context }  from "./context";
import { resolvers } from "../prisma/generated/type-graphql";
import { CustomAuthResolver } from "./customAuthResolver";
import { customAuthChecker } from "./auth/custom-auth-checker";

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [...resolvers, CustomAuthResolver],
    /* authChecker: customAuthChecker, */
    validate: false,
  });

  await new ApolloServer({ schema, context }).listen({ port: 4000 }, () => {
    console.log(
      "🚀 Server ready at: http://localhost:4000/graphql"
    )
  });
};

app();
