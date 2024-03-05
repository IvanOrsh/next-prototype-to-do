// module augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
    };
  }
}