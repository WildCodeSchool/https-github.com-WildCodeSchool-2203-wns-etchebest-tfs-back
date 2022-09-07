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
  const token = authorization?.split(" ")[1] || '';
  console.log({context:{token:token}})
    if (token) {
      
      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as ITokenVerified;
        console.log({context:{paylod:payload.email}})

        return { 
          prisma, 
          user: payload.email 
        };
      } catch (err) {
        return { 
          prisma, 
          user: null };
      }
    }
    return { 
      prisma,
      user: null
   };
  } 

