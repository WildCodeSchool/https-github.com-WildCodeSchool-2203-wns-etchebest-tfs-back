import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { UserCreateInput } from "./generated/type-graphql";
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const amountOfUsers = 10;
  const users: UserCreateInput[] = [
    {
      firstname: "Admin",
      lastname: "Admin",
      email: "admin@structure.com",
      password: bcrypt.hashSync("00000000", bcrypt.genSaltSync(10)),
      role: "ADMIN",
    },
    {
      firstname: "Lead",
      lastname: "Lead",
      email: "lead@structure.com",
      password: bcrypt.hashSync("00000000", bcrypt.genSaltSync(10)),
      role: "LEAD",
    },
    {
      firstname: "Dev",
      lastname: "Dev",
      email: "dev@structure.com",
      password: bcrypt.hashSync("00000000", bcrypt.genSaltSync(10)),
      role: "DEV",
    },
    {
      firstname: "Intern",
      lastname: "Intern",
      email: "intern@structure.com",
      password: bcrypt.hashSync("00000000", bcrypt.genSaltSync(10)),
      role: "INTERN",
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
      role: faker.helpers.arrayElement(["ADMIN", "LEAD", "DEV", "INTERN"]),
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
