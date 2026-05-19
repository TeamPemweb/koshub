"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RoleCard } from "@/components/ui/rolecard";
import OnboardingTemplate from "@/components/templates/OnboardingTemplate";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <main>
      <OnboardingTemplate
      title="Selamat Datang!"
      caption="Pilih role kamu"
      children={
        <>
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
        </>
      }

      button="Lanjut"
      disabled={!selectedRole}

      ></OnboardingTemplate>
    </main>
  );
}