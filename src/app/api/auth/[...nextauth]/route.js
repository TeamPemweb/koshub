import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        }
                    );

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || "Login gagal");
                    }

                    let role = null;
                    let profileComplete = false;

                    const setCookieHeader = res.headers.get("set-cookie");

                    try {
                        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                            headers: {
                                ...(setCookieHeader ? { Cookie: setCookieHeader } : {}),
                            }
                        });

                        if (profileRes.ok) {
                            const profileData = await profileRes.json();
                            if (profileData && profileData.role) {
                                role = profileData.role;
                                if (profileData.nama) {
                                    profileComplete = true;
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Gagal get profile saat login:", e);
                    }

                    // Hanya return frontend state untuk NextAuth session (tanpa access token)
                    return {
                        id: credentials.email,
                        email: credentials.email,
                        role: role,
                        profileComplete: profileComplete,
                    };
                } catch (error) {
                    throw new Error(error.message || "Terjadi kesalahan saat login");
                }
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
