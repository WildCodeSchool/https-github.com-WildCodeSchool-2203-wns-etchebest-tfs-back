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
  //Récupère le token dans le header:
  const authorization = req.headers.authorization; 
  // Enlève le mot "Bearer" du token:
  const token = authorization?.split(" ")[1] || '';
  console.log({context:{token:token}})
    if (token) {
      //Vérifie le token:
      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as ITokenVerified;
        console.log({context:{paylod:payload.email}})

        return { 
          //si OK, renvoie contexte + user (email)
          prisma, 
          user: payload.email 
        };
      } catch (err) {
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