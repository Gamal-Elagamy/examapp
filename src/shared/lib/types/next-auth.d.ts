import { IUser } from "./user";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: IUser;
    token: string;
  }
  interface User {
    user: IUser;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: IUser;
    token: string;
  }
}
