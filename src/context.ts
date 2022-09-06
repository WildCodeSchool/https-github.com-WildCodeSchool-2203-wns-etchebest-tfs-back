import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import jwt from 'jsonwebtoken';
import { User } from "../prisma/generated/type-graphql";



const prisma = new PrismaClient();

export interface IContext {
  prisma: PrismaClient;
  user?: User
}


 export const context: IContext = {
  prisma,
  user : {
    id: 1,
    firstname: "Thaine",
    lastname: "Brown",
    email: "test@test.com",
    createdAt: new Date(),
    password: "45254",
    roles: "ADMIN",
  }
}; 
 
 export  const context2 = async ({ req }: any):Promise<IContext> => {  
  const token = req.headers.authorization || '';
  const email = parseToken(token);
 //A FAIRE !!! retourner le context sans user si pas de token
  try {
    if(!token) {
      return { prisma }
    }
    const user = await getUser(email);
    if(user){
      return { prisma, user }
    }
    if (!user) {
      throw new AuthenticationError("Unable to get user with this token");  
    }
  } catch (error) {
   new AuthenticationError("Invalid token")
  }
  return { prisma }
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