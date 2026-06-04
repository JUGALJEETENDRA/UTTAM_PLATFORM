<<<<<<< Updated upstream
// Stub to allow unmigrated pages to compile
export async function getOrCreateUser(): Promise<any> {
  return null;
}
=======
import { NextAuthOptions } from "next-auth"
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

      const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "ashtikarsourish60@gmail.com";

      let existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (user.email === adminEmail) {
        if (existingUser && existingUser.role !== "TEACHER") {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "TEACHER" }
          });
        } else if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: "TEACHER"
            }
          });
        }
        return true;
      }

      // Prevent sign ups: only allow login if the user ALREADY exists in the database.
      if (!existingUser) {
        // Return false to reject the sign-in (user is not whitelisted/registered yet)
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      // user object is only passed in the first time the user signs in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "STUDENT";
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
>>>>>>> Stashed changes
