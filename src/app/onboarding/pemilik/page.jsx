"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OnboardingTemplate from "@/components/templates/OnboardingTemplate";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function PemilikOnboarding() {
    const { update } = useSession();
    const router = useRouter();

    const [nama, setNama] = useState("");
    const [nomorTelepon, setNomorTelepon] = useState("");
    const [namaKos, setNamaKos] = useState("");
    const [lokasiKos, setLokasiKos] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isValid = nama.trim() && nomorTelepon.trim() && namaKos.trim() && lokasiKos.trim();

    async function handleSubmit() {
        if (!isValid) return;
        setError("");
        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/profile/setup`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        nama: nama.trim(),
                        nomor_telepon: nomorTelepon.trim(),
                        nama_kos: namaKos.trim(),
                        lokasi_kos: lokasiKos.trim(),
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Gagal menyimpan data. Coba lagi.");
                setLoading(false);
                return;
            }

            await update({ role: "pemilik", profileComplete: true });
            router.push("/pemilik");
        } catch {
            setError("Terjadi kesalahan. Coba lagi.");
            setLoading(false);
        }
    }

    return (
        <main>
            <OnboardingTemplate
                title="Data Diri Pemilik"
                caption="Lengkapi informasi Anda untuk melanjutkan"
                button={loading ? "Menyimpan..." : "Lanjut"}
                disabled={!isValid || loading}
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col gap-5 w-full max-w-md text-left">
                    <Field orientation="vertical">
                        <FieldLabel htmlFor="nama">Nama Lengkap</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="nama" placeholder="Masukkan nama lengkap Anda" value={nama} onChange={(e) => setNama(e.target.value)} required />
                        </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                        <FieldLabel htmlFor="nomor_telepon">No. Telepon</FieldLabel>
                        <FieldContent>
                            <Input type="tel" id="nomor_telepon" placeholder="Contoh: 08123456789" value={nomorTelepon} onChange={(e) => setNomorTelepon(e.target.value)} required />
                        </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                        <FieldLabel htmlFor="nama_kos">Nama Kos</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="nama_kos" placeholder="Contoh: Kos Singgah Sini" value={namaKos} onChange={(e) => setNamaKos(e.target.value)} required />
                        </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                        <FieldLabel htmlFor="lokasi_kos">Lokasi Kos</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="lokasi_kos" placeholder="Contoh: Jl. Sigura-gura No. 10, Malang" value={lokasiKos} onChange={(e) => setLokasiKos(e.target.value)} required />
                        </FieldContent>
                    </Field>

                    {error && (
                        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                            <p className="text-sm text-destructive font-medium text-center">{error}</p>
                        </div>
                    )}
                </div>
            </OnboardingTemplate>
        </main>
    );
}
