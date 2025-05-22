import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      // Send properties to the client, like an access_token from a provider
      session.user.id = token.sub;
      return session;
    },
    async redirect({ url, baseUrl }: {url: string; baseUrl: string}) {
      // Only redirect to setup page if this is the home page redirect after login
      if (url === baseUrl || url === `${baseUrl}/`) {
        // In a production app, you would check your database here
        // For now, we'll just redirect to the setup page for demonstration
        return `${baseUrl}/setup-new`;
      }
      
      // For all other URLs, use the default NextAuth behavior
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
