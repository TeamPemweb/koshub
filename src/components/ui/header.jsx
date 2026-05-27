"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Header({
    title = "Dashboard",
    className,
    ...props
}) {
    const { data: session } = useSession();
    const [profile, setProfile] = React.useState(null);

    React.useEffect(() => {
        if (!session) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
            credentials: "include",
        })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (data) setProfile(data);
            })
            .catch(() => {});
    }, [session]);

    const displayName = profile?.nama ?? session?.user?.email ?? "User";
    const displayEmail = profile?.email ?? session?.user?.email ?? "";

    return (
        <header
            className={cn(
                "flex h-16 w-full items-center justify-between bg-background py-10 px-10 select-none",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                </h1>
            </div>

            <Link href="/pemilik/profile">
                <div className="flex items-center gap-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="hidden flex-col text-right sm:flex">
                            <span className="text-sm font-semibold text-foreground leading-none">
                                {displayName}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-1 leading-none">
                                {displayEmail}
                            </span>
                        </div>

                        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                            <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </Link>
        </header>
    );
}

export default Header;
