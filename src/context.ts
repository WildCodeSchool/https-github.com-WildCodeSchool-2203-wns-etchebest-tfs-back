import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import jwt, { JwtHeader } from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface IContext {
  prisma: PrismaClient;
  user?: object
}

export  const context = async ({ req }: any) => {  
  const token = req.headers.authorization || '';
  
  if(token){
    /* const email = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') ; */
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    console.log(payload)
    try {
      //@ts-ignore
      const user = await prisma.user.findUnique({ where: { email: payload.user } });
      console.log("user", user)
      return { prisma, user }
    } catch (error) {
      console.log("error", error)
      console.error(error);
    }
  }
  return { prisma };
}

