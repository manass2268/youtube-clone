import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Yahan apne supabase client ka correct path daalein
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
    // Jab user Google se login karega, yeh trigger hoga
    async signIn({ user }) {
      if (user.email) {
        const { error } = await supabase
          .from("users")
          .upsert(
            {
              email: user.email,
              name: user.name,
              image: user.image,
            },
            { onConflict: "email" } // Agar email already hai, toh bas data update hoga
          );

        if (error) {
          console.error("Supabase Insert Error:", error);
          return false; // Error aane par login block karega
        }
      }
      return true; // Successfully data save hone par login allow karega
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };