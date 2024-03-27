import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// const prisma = globalForPrisma.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export const db = prisma;
