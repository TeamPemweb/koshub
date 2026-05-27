"use client";

import { useSession } from "next-auth/react";
import { Home, FileText, CreditCard, Bell } from "lucide-react";

export default function PenghuniDashboard() {
    const { data: session } = useSession();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                    Selamat Datang, {session?.user?.email ?? "Penghuni"} 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    Ini adalah dashboard penghuni kos Anda.
                </p>
            </div>

            {/* Quick access cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-6 flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                        <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">Info Kamar</p>
                        <p className="text-sm text-muted-foreground mt-1">Lihat detail kamar kos Anda</p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">Pembayaran</p>
                        <p className="text-sm text-muted-foreground mt-1">Cek status pembayaran sewa</p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">Keluhan</p>
                        <p className="text-sm text-muted-foreground mt-1">Ajukan keluhan atau permintaan</p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                        <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">Notifikasi</p>
                        <p className="text-sm text-muted-foreground mt-1">Pengumuman dari pemilik kos</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
