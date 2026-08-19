import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const email = String(credentials.email)
          .trim()
          .toLowerCase();

        const password = String(
          credentials.password
        );

        const employee =
          await prisma.employee.findUnique({
            where: {
              email,
            },
          });

        if (!employee) {
          return null;
        }

        if (employee.status !== "ACTIVE") {
          return null;
        }

        const passwordValid =
          await bcrypt.compare(
            password,
            employee.passwordHash
          );

        if (!passwordValid) {
          return null;
        }

        return {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          token.sub ?? "";

        session.user.role =
          token.role === "SUPER_ADMIN"
            ? "SUPER_ADMIN"
            : "EMPLOYEE";
      }

      return session;
    },
  },
});