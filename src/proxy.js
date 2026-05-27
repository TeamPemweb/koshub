import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // NextAuth token — untuk cek role & profileComplete (frontend state)
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // ─────────────────────────────────────────────────
    // Belum ada sesi NextAuth (belum login sama sekali)
    // ─────────────────────────────────────────────────
    if (!token) {
        if (pathname === "/" || pathname === "/auth") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    // ─────────────────────────────────────────────────
    // Halaman onboarding — boleh akses selama belum selesai setup
    // ─────────────────────────────────────────────────
    if (pathname.startsWith("/onboarding")) {
        if (token.role) {
            // Sudah punya role → masuk ke dashboard
            return NextResponse.redirect(new URL(`/${token.role}`, request.url));
        }

        return NextResponse.next();
    }

    // ─────────────────────────────────────────────────
    // Sudah login → halaman publik (login/signup) → redirect ke dashboard
    // ─────────────────────────────────────────────────
    if (pathname === "/" || pathname === "/auth") {
        if (token.role) {
            return NextResponse.redirect(new URL(`/${token.role}`, request.url));
        }
        return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // ─────────────────────────────────────────────────
    // Akses dashboard — butuh role
    // ─────────────────────────────────────────────────
    if (!token.role) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (pathname.startsWith("/penghuni") && token.role !== "penghuni") {
        return NextResponse.redirect(new URL(`/${token.role}`, request.url));
    }

    if (pathname.startsWith("/pemilik") && token.role !== "pemilik") {
        return NextResponse.redirect(new URL(`/${token.role}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$).*)",
    ],
};
