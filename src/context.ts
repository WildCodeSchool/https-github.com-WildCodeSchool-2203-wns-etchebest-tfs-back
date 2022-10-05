// A chaque requête, le middleware context.ts est appelé et vérifie le token.

import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import jwt from 'jsonwebtoken';
import { User } from "../prisma/generated/type-graphql";

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
  const authorization = req.headers.authorization;

  let token = authorization
  //Vérifie si le token comprend le mot "Bearer" pour le retirer
  if (token.match(/^Bearer /)) {
    token = authorization.replace('Bearer ', '');
  }
  
  if (token) {
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as ITokenVerified;
        return { 
          //si OK, renvoie contexte + user (email)
          prisma, 
          user: payload.email 
        };
      } catch (error) {
        console.error("\x1b[31m",{error,file:"context.ts"});
        return { 
          // Si erreur, renvoie contexte + user (null)
          prisma, 
          user: null };
      }
    }
    return { 
      // Si pas de token, renvoie contexte + user (null)
      prisma,
      user: null
   };
  } 

