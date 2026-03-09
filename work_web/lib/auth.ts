import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "账号密码",
      credentials: {
        username: { label: "用户名或邮箱", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username }, { email: username }],
          },
        });

        if (!user) {
          return null;
        }

        const isValid = await compare(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "ADMIN";
      }

      return session;
    },
  },
};

export async function auth() {
  return getServerSession(authOptions);
}

export function isAdminSession(session: Awaited<ReturnType<typeof auth>> | null | undefined) {
  return session?.user?.role === "ADMIN";
}

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id || !isAdminSession(session)) {
    redirect("/login");
  }

  return session;
}
