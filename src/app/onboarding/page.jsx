"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RoleCard } from "@/components/ui/rolecard";
import OnboardingTemplate from "@/components/templates/OnboardingTemplate";

export default function RoleSelection() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLanjut() {
    if (!selectedRole) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/choose-role`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: selectedRole }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal menyimpan role. Coba lagi.");
        setLoading(false);
        return;
      }

      if (selectedRole === "pemilik") {
        router.push("/onboarding/pemilik");
      } else {
        router.push("/onboarding/tenant");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <main>
      <OnboardingTemplate
        title="Selamat Datang!"
        caption="Pilih role kamu untuk melanjutkan"
        button={loading ? "Menyimpan..." : "Lanjut"}
        disabled={!selectedRole || loading}
        onSubmit={handleLanjut}
      >
        <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
          <RoleCard
            roleId="pemilik"
            label="Pemilik Kos"
            iconType="owner"
            isSelected={selectedRole === "pemilik"}
            onSelect={setSelectedRole}
          />
          <RoleCard
            roleId="penghuni"
            label="Penghuni Kos"
            iconType="tenant"
            isSelected={selectedRole === "penghuni"}
            onSelect={setSelectedRole}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 w-full max-w-xl">
            <p className="text-sm text-destructive font-medium text-center">{error}</p>
          </div>
        )}
      </OnboardingTemplate>
    </main>
  );
}