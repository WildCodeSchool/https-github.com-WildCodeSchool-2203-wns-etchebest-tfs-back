// A chaque requête, le middleware context.ts est appelé et vérifie le token.

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
       //Vérifie si le token comprend le mot "Bearer" pour le retirer
    if (token.match(/^Bearer /)) {
      token = authorization.replace('Bearer ', '');
    }
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET) as ITokenVerified;
        return { 
          //si OK, renvoie contexte + user (email)
          prisma, 
          user: payload.email 
        };
      } catch (error) {
        console.log("Pas d'utilisateur connecté");
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