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
    <Sidebar collapsible="none" className="border-r border-sidebar-border bg-white"> 
      <SidebarHeader className="flex flex-row items-center justify-center gap-3 bg-blue-normal px-3 py-5 rounded-br-[32px]">
        <div className="flex flex-col justify-center items-center w-full">
          <img src="/logo_white.png" alt="logo brand" className="h-12 object-contain w-full" />
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

    </Sidebar>
  );
}
