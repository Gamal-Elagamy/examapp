import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/shared/lib/constants/env.constant";
import type { IApiResponse } from "@/shared/lib/types/api";
import type { IUser } from "@/shared/lib/types/user";

interface LoginApiResponse {
  token: string;
  user: IUser;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data: IApiResponse<LoginApiResponse> = await response.json();

          if (!data.status || !data.payload) {
            throw new Error(data.message || "Login failed");
          }

          let currentUser = data.payload.user;
          try {
            const profileRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/profile`, {
              headers: { Authorization: `Bearer ${data.payload.token}` },
            });
            const profileData = await profileRes.json().catch(() => null);
            if (profileData?.status && profileData.payload?.user) {
              currentUser = profileData.payload.user;
            } else if (profileData?.user) {
              currentUser = profileData.user;
            }
          } catch {
            // Fallback to login payload user
          }

          return {
            id: currentUser.id,
            user: currentUser,
            token: data.payload.token,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
      }
      if (trigger === "update" && session?.user) {
        token.user = { ...(token.user as object), ...session.user };
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.token = token.token;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: env.NEXTAUTH_SECRET,
};

export const auth = () => getServerSession(authOptions);
