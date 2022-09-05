import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import jwt from 'jsonwebtoken';



const prisma = new PrismaClient();

export interface IContext {
  prisma: PrismaClient;
  user?: object
}

export  const context = async ({ req }: any) => {  
  const token = req.headers.authorization || '';
  const email = parseToken(token);
 //A FAIRE !!! retourner le context sans user si pas de token
  try {
    const user = await getUser(email);
    return { prisma, user }
  } catch (error) {
    new AuthenticationError("Invalid token")
  }
  return { prisma };
}

//Retourne le email contenu dans le token
function parseToken(token: string) {
  if(!token) {
    throw new AuthenticationError("Invalid token");
  }
  else {
    const email = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as string;
    return email
  }
}

//Retourne l'utilisateur correspondant à l'email
async function getUser(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });  
  } catch (error) {
    throw new AuthenticationError("Unable to get user with this token");
  } 
}