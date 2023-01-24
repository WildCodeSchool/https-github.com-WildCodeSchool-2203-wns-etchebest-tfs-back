// On each request, the middleware context.ts is called and verify the token.

import { PrismaClient } from "@prisma/client";
import { ApolloError } from "apollo-server";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


export interface ITokenVerified {
  email: string;
  iat?: number;
  exp?: number;
}

export interface IContext {
  prisma: PrismaClient;
  user?: string | null;
}


export const context = ({ req }: any): IContext => {
  if(!process.env.JWT_SECRET){throw new ApolloError("JWT_SECRET is not defined")}

  const authorization = req.headers.authorization;
  let token = authorization
 
  if (token) {
    if (token.match(/^Bearer /)) {
      token = authorization.replace('Bearer ', '');
    }
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET) as ITokenVerified;
        return { 
          //OK: context + user (email)
          prisma, 
          user: payload.email 
        };
      } catch (error) {
        console.log("Cannot find user with this token");
        return { 
          // Error: context + user (null)
          prisma, 
          user: null };
      }
    }
    return { 
      // No token: context + user (null)
      prisma,
      user: null
   };
  } 