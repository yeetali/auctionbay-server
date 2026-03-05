// import { prisma } from './prisma';

// async function main() {
//   const newUser = await prisma.user.create({
//     data: {
//       firstName: 'Ali',
//       lastName: 'Test',
//       email: 'test@test.com',
//       password: '123',
//     },
//   });

//   console.log(`New user created: `, newUser);

//   const allUsers = await prisma.user.findMany();
//   console.log('All Users: ', allUsers);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
