import { users } from "./data/users";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import {
  ProjectCreateInput,
  ProjectCreateManyInput,
  UserCreateInput,
} from "./generated/type-graphql";

const prisma = new PrismaClient();


async function main() {
  const amountOfUsers = 50;
  const amountOfProjects = 8;

  const users: UserCreateInput[] = [];
  const projects: ProjectCreateManyInput[] = [];

  for (let index = 0; index < amountOfUsers; index++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const user: UserCreateInput = {
      firstname: firstName,
      lastname: lastName,
      email: faker.internet.email(firstName, lastName),
      password: faker.internet.password(),
      roles: faker.helpers.arrayElement(["USER", "ADMIN"]),
    };

    users.push(user);
  }

/*   for (let index = 0; index < amountOfProjects; index++) {
    const project: ProjectCreateManyInput = {
      code: faker.lorem.word(3),
      subject: faker.lorem.sentence(),
      title: faker.lorem.sentence(),
      user_author_project_id: 1
    };
    projects.push(project);
  } */

  const addUsers = async () => await prisma.user.createMany({ data: users });
  addUsers();
/*   const addProjects = async () => await prisma.project.createMany({ data: projects });
  addProjects(); */
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
