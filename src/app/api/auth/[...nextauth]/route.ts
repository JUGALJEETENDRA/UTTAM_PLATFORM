import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: "TEACHER"
          }
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      // user object is only passed in the first time the user signs in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "TEACHER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt" // Switching to stateless JWT sessions!
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };