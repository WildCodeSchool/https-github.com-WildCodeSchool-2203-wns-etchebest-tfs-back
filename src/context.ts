// A chaque requête, le middleware context.ts est appelé et vérifie le token.

import { PrismaClient } from "@prisma/client";
<<<<<<< HEAD
import { AuthenticationError } from "apollo-server";
import jwt from 'jsonwebtoken';
import { User } from "../prisma/generated/type-graphql";
=======
import jwt from 'jsonwebtoken';
>>>>>>> dev

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
<<<<<<< HEAD
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

=======
  const authorization = req.headers.authorization;
  let token = authorization
  console.log(token);
 
  if (token) {
       //Vérifie si le token comprend le mot "Bearer" pour le retirer
    if (token.match(/^Bearer /)) {
      token = authorization.replace('Bearer ', '');
    }
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as ITokenVerified;
>>>>>>> dev
        return { 
          //si OK, renvoie contexte + user (email)
          prisma, 
          user: payload.email 
        };
<<<<<<< HEAD
      } catch (err) {
=======
      } catch (error) {
        console.error("\x1b[31m",{error,file:"context.ts"});
>>>>>>> dev
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

