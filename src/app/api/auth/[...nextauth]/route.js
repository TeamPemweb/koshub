import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                role: { label: "Role", type: "text" },
            },
            async authorize(credentials) {
                // Login API hit dilakukan di frontend (page.jsx) 
                // agar browser bisa menyimpan cookie dengan sempurna.
                // NextAuth hanya dipakai untuk menyimpan state role.
                return {
                    id: credentials.email,
                    email: credentials.email,
                    role: credentials.role === "null" ? null : credentials.role,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.email = user.email;
                token.role = user.role;
                token.profileComplete = user.profileComplete;
            }

            // Saat update() dipanggil dari client
            if (trigger === "update") {
                if (session?.role !== undefined) token.role = session.role;
                if (session?.profileComplete !== undefined) token.profileComplete = session.profileComplete;
            }

            return token;
        },

        async session({ session, token }) {
            session.user.role = token.role;
            session.user.email = token.email;
            session.user.profileComplete = token.profileComplete;
            return session;
        },
    },

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/",
    },
});

export { handler as GET, handler as POST };
