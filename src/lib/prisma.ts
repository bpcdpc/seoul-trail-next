// import { PrismaClient } from "@/generated/prisma/client";

// // 1. PrismaClient 인스턴스를 생성하는 팩토리 함수를 정의합니다.
// const prismaClientSingleton = () => {
//   return new PrismaClient();
// };

// // 2. TypeScript에게 전역 객체(globalThis)에 prismaGlobal 속성이 존재함을 알립니다.
// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof globalThis;

// // 3. 이미 전역 객체에 생성된 인스턴스가 있으면 그것을 쓰고, 없으면 새로 생성합니다.
// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// export default prisma;

// // 4. 개발 환경(development)일 때만 전역 객체에 인스턴스를 저장하여 재사용합니다.
// if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
