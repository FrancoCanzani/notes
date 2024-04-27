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
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (profile && profile.id) {
        token.id = profile.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.id = token.id;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
