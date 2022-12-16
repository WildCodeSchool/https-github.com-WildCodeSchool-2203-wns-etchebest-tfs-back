import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import {
  UserCreateInput,
} from "./generated/type-graphql";
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const amountOfUsers = 10;
  const users: UserCreateInput[] = [
    {
      firstname: "Admin",
      lastname: "Admin",
      email: "admin@structure.com",
      password: bcrypt.hashSync("00000000", bcrypt.genSaltSync(10)),
      roles: "ADMIN",
    },
    {
      firstname: "Lead",
      lastname: "Lead",
      email: "lead@structure.com",
      password: bcrypt.hashSync("00000000", bcrypt.genSaltSync(10)),
      roles: "LEAD",
    },
    {
      firstname: "User",
      lastname: "User",
      email: "user@structure.com",
      password: bcrypt.hashSync("00000000", bcrypt.genSaltSync(10)),
      roles: "USER",
    },
    {
      firstname: "Intern",
      lastname: "Intern",
      email: "intern@structure.com",
      password: bcrypt.hashSync("00000000", bcrypt.genSaltSync(10)),
      roles: "INTERN",
    },
  ];

  for (let index = 0; index < amountOfUsers; index++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const user: UserCreateInput = {
      firstname: firstName,
      lastname: lastName,
      email: faker.internet.email(firstName, lastName),
      password: bcrypt.hashSync("00000000", bcrypt.genSaltSync(10)),
      roles: faker.helpers.arrayElement(["ADMIN", "LEAD", "USER", "INTERN"]),
    };
    users.push(user);
  }

  const addUsers = async () => await prisma.user.createMany({ data: users });
  addUsers();
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
