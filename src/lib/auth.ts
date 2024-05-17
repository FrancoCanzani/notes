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
    jwt({ token, user }) {
      if (user) {
        return { ...token, id: user.id }; // Save id to token as docs says: https://next-auth.js.org/configuration/callbacks
      }
      return token;
    },
    session: ({ session, token, user }) => {
      console.log(session);

      return {
        ...session,
        user: {
          ...session.user,
          // id: user.id, // This is copied from official docs which find user is undefined
          id: token.id, // Get id from token instead
        },
      };
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
