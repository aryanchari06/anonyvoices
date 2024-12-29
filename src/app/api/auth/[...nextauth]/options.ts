import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email: ", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials.identifier.username },
              { email: credentials.identifier.email },
            ],
          });

          if (!user) throw new Error("No user found with this email");

          if (!user.isVerified)
            throw new Error("Please verify your account before you login");

          const isPasswordCorrect = await bcryptjs.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) throw new Error("Incorrect Password");
          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user?.isVerified;
        token.isAcceptingMessages = user?.isAcceptingMessages;
        token.username = user?.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
};
