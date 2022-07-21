import "reflect-metadata";
import { ApolloServer } from "apollo-server";

import * as tq from "type-graphql";
import { Authorized } from "type-graphql";

import { context } from "./context";

import {
  resolvers, 
  ResolversEnhanceMap, 
  applyResolversEnhanceMap,  
  Role} from "../prisma/generated/type-graphql";
import {CustomAuthResolver} from "./customAuthResolver";
import { customAuthChecker } from "./auth/custom-auth-checker";


const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    users: [Authorized(Role.ADMIN)],
  },
};

applyResolversEnhanceMap(resolversEnhanceMap);


const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [...resolvers, CustomAuthResolver],
    authChecker: customAuthChecker,
    validate: false,
  });

  new ApolloServer({ schema, context: context }).listen({ port: 4000 }, () => {
    console.log(
      "🚀 Server ready at: http://localhost:4000/graphql"
    )
  }
    
  );
};
app();
