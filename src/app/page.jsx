"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Tembak backend langsung dari browser agar browser menyimpan cookie-nya
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Supaya browser bisa terima cookie
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(loginData.message || "Email atau password salah");
        setLoading(false);
        return;
      }

      // 2. Beri tahu NextAuth untuk login (NextAuth akan nge-fetch /auth/profile 
      // di server-side pakai cookie yang baru saja di-set, lalu mengembalikan session)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Pindah halaman; proxy.js akan arahkan sesuai role
      window.location.href = "/onboarding";
    } catch (e) {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <main className="w-full h-screen overflow-hidden lg:grid lg:grid-cols-2">

      <section className="flex items-center justify-center h-full overflow-y-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-[400px] gap-8 py-10">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">Login</h1>
            <p className="text-muted-foreground">Masuk dengan akun KosHub Anda</p>
          </div>

          <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
              {loading ? "Masuk..." : "Login"}
            </Button>
          </form>

          <div className="flex justify-center text-sm">
            <p className="text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/auth" className="font-semibold text-primary hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="hidden lg:block relative p-4 lg:p-6 bg-background">
        <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
          <img src="/auth.png" alt="Ilustrasi KosHub" className="absolute inset-0 h-full w-full object-cover" draggable="false" />
          <div className="absolute inset-0 bg-black/10"></div>
          <img src="/logo_white.png" alt="Logo KosHub" className="absolute top-16 left-12" draggable="false" />
          <div className="absolute bottom-16 left-12 right-12 z-10 text-right tracking-wider">
            <p className="text-white text-5xl font-bold mb-4 drop-shadow-lg">Selamat Datang!</p>
            <p className="text-white text-xl drop-shadow-lg font-medium">Pantau pembayaran, kelola penghuni, dan optimalkan operasional kos</p>
          </div>
        </div>
      </section>

    </main>
  );
}
