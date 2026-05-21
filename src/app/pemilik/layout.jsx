import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/components/ui/app-sidebar";
import Header from "@/components/ui/header";

export default function LayoutPemilik({ children }) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <main className="flex h-screen w-full overflow-hidden bg-background">
                    {/* Sidebar di sebelah kiri */}
                    <AppSidebar />

                    {/* Area konten di sebelah kanan */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header global di bagian atas */}
                        <Header
                            title="Selamat Datang, User!"
                            userName="Vincent"
                            userEmail="fefsjffjlfljk"
                        />

                        {/* Konten Halaman (yang me-render page.jsx) */}
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </SidebarProvider>
        </TooltipProvider>
    );
}
