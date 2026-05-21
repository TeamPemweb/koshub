"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CreditCard,
  MessageSquareWarning,
  Building2,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Home",
    url: "/pemilik",
    icon: LayoutDashboard,
  },
  {
    title: "Kamar",
    url: "/pemilik/kamar",
    icon: BedDouble,
  },
  {
    title: "Penghuni",
    url: "/pemilik/penghuni",
    icon: Users,
  },
  {
    title: "Billing",
    url: "/pemilik/billing",
    icon: CreditCard,
  },
  {
    title: "Keluhan",
    url: "/pemilik/keluhan",
    icon: MessageSquareWarning,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border bg-sidebar"> 
      <SidebarHeader className="flex flex-row items-center gap-3 px-4 py-6">
        <div className="flex flex-col justify-center items-center bg-blue-normal rounded-b-4xl">
          <img src="/logo_brand.png" alt="logo brand" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 group-data-[collapsible=icon]:hidden">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Profil Pemilik"
            >
              <Link href="/pemilik/profil">
                <User className="shrink-0" />
                <div className="flex flex-col text-left leading-none group-data-[collapsible=icon]:hidden">
                  <span className="text-xs font-semibold text-sidebar-foreground">Pemilik Kos</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">owner@koshub.com</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
