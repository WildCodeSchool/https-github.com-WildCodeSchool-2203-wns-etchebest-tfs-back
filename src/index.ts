//Librairies
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as tq from "type-graphql";
import { applyResolversEnhanceMap, resolvers } from "../prisma/generated/type-graphql";

//Custom
import { context } from "./context";
import { CustomAuthResolver } from "./auth/customAuthResolver";
import { customAuthChecker } from "./auth/customAuthChecker";
import { resolversEnhanceMap } from "./auth/guard";
import { CustomUserResolver } from "./resolver/customUserResolver";

//-------  Middelware
// PWD hash
/* Middelware.encryptPassword(context) */ 
// Routes guard
applyResolversEnhanceMap(resolversEnhanceMap);

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [...resolvers, CustomAuthResolver, CustomUserResolver],
    authChecker: customAuthChecker,
    validate: false,
  });
  
  await new ApolloServer({ schema, context}
  ).listen({ port: 4000 }, () => {
    console.log(
      "🚀 Server ready at: http://localhost:4000/graphql"
    )
  });
};

app();