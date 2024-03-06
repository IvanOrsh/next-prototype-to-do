import NextAuth, { DefaultSession } from "next-auth";

// module augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
    } & DefaultSession["user"];
  }
}
