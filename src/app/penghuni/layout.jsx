"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Home } from "lucide-react";
import Link from "next/link";

export default function LayoutPenghuni({ children }) {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="flex h-16 w-full items-center justify-between bg-background border-b border-border px-6 select-none">
                <div className="flex items-center gap-3">
                    <img src="/logo_brand.png" alt="KosHub" className="h-8" draggable="false" />
                    <span className="text-lg font-bold tracking-tight text-foreground">KosHub</span>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/penghuni"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col text-right">
                        <span className="text-sm font-semibold text-foreground leading-none">
                            {session?.user?.email ?? "Penghuni"}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1 leading-none">
                            Penghuni Kos
                        </span>
                    </div>

                    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted overflow-hidden">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
