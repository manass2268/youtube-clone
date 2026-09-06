import NextAuth, { User } from "next-auth"; // User type yahan import add kiya hai
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase"; 

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Yahan { user } ko explicitly type assign kar diya hai
    async signIn({ user }: { user: User }) {
      if (user.email) {
        const { error } = await supabase
          .from("users")
          .upsert(
            {
              email: user.email,
              name: user.name,
              image: user.image,
            },
            { onConflict: "email" } 
          );

        if (error) {
          console.error("Supabase Insert Error:", error);
          return false; 
        }
      }
      return true; 
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };