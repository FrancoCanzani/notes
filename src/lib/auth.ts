import NextAuth from 'next-auth';
import authConfig from '../../auth.config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && profile.id) {
        token.id = profile.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.id = token.id;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
