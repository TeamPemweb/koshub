"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/components/ui/app-sidebar";
import Header from "@/components/ui/header";

export default function LayoutPemilik({ children }) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <main className="flex h-screen w-full overflow-hidden bg-background">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <Header title="Selamat Datang!" />
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </SidebarProvider>
        </TooltipProvider>
    );
}
