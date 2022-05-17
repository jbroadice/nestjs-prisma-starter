import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { Chance } from 'chance';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();

  console.log('Seeding...');

  const chance = new Chance();

  new Array(100).fill(null).forEach(async () => {
    const email = chance.email();
    const firstname = chance.first();
    await prisma.user.create({
      data: {
        email,
        password: await hash('wibble100', 10),
        role: chance.pickone(Object.keys(Role)) as Role,
        firstname,
        lastname: chance.last(),
        posts: {
          create: [
            {
              title: `A post from ${firstname}`,
              published: true,
            },
          ],
        },
        bookings: {
          create: [
            {
              participantRole: 'ORGANISER',
              assignedBy: { connect: { email } },
              booking: {
                create: {
                  title: `A booking from ${firstname}`,
                  description: 'Fun description here',
                  timeStart: new Date(),
                  timeEnd: new Date(),
                },
              },
            },
          ],
        },
      },
    });
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
