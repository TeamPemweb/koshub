import { NextResponse } from "next/server";

/**
 * Proxy route untuk login.
 * Tujuan: Memanggil backend dari server-side Next.js agar
 * Set-Cookie dari backend bisa diforward ke browser.
 */
export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json(
                { message: data.message || "Login gagal" },
                { status: backendRes.status }
            );
        }

        // Forward semua Set-Cookie dari backend ke browser
        const response = NextResponse.json({ success: true, email });
        const setCookies = backendRes.headers.getSetCookie?.() ?? [];
        setCookies.forEach((cookie) => {
            response.headers.append("Set-Cookie", cookie);
        });

        return response;
    } catch {
        return NextResponse.json(
            { message: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
