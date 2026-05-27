"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import Link from "next/link";

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== konfirmasiPassword) {
            setError("Password dan konfirmasi password tidak cocok.");
            return;
        }

        if (password.length < 6) {
            setError("Password minimal 6 karakter.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registrasi gagal. Coba lagi.");
                setLoading(false);
                return;
            }

            setSuccess("Akun berhasil dibuat! Mengalihkan ke halaman login...");
            setTimeout(() => router.push("/"), 1500);
        } catch {
            setError("Terjadi kesalahan. Coba lagi.");
            setLoading(false);
        }
    }

    return (
        <main className="w-full h-screen overflow-hidden lg:grid lg:grid-cols-2">
            <section className="hidden lg:block relative p-4 lg:p-6 bg-background">
                <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
                    <img
                        src="/auth.png"
                        alt="Ilustrasi KosHub"
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable="false"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>

                    <img src="/logo_white.png" alt="Logo KosHub" className="absolute top-16 left-12" draggable="false" />

                    <div className="absolute bottom-16 left-12 right-12 z-10 text-right tracking-wider">
                        <p className="text-white text-5xl font-bold mb-4 drop-shadow-lg">Selamat Datang!</p>
                        <p className="text-white text-xl drop-shadow-lg font-medium">Pantau pembayaran, kelola penghuni, dan optimalkan operasional kos</p>
                    </div>
                </div>
            </section>

            <section className="flex items-center justify-center h-full overflow-y-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col w-full max-w-[400px] gap-8 py-10">
                    <div className="flex flex-col gap-2 text-center lg:text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight">Sign Up</h1>
                        <p className="text-muted-foreground">Daftar dengan akun KosHub</p>
                    </div>

                    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                        <Field orientation="vertical">
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <FieldContent>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Masukkan email Anda"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </FieldContent>
                        </Field>

                        <Field orientation="vertical">
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <FieldContent>
                                <Input
                                    type="password"
                                    id="password"
                                    placeholder="Masukkan password Anda"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </FieldContent>
                        </Field>

                        <Field orientation="vertical">
                            <FieldLabel htmlFor="konfirmasiPassword">Konfirmasi Password</FieldLabel>
                            <FieldContent>
                                <Input
                                    type="password"
                                    id="konfirmasiPassword"
                                    placeholder="Ulangi password Anda"
                                    value={konfirmasiPassword}
                                    onChange={(e) => setKonfirmasiPassword(e.target.value)}
                                    required
                                />
                            </FieldContent>
                        </Field>

                        {error && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                                <p className="text-sm text-destructive font-medium">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                                <p className="text-sm text-green-700 font-medium">{success}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
                            {loading ? "Mendaftar..." : "Daftar"}
                        </Button>
                    </form>

                    <div className="flex justify-center text-sm">
                        <p className="text-muted-foreground">
                            Sudah punya akun?{" "}
                            <Link href="/" className="font-semibold text-primary hover:underline">
                                Login di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
