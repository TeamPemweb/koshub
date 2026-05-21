"use client";

import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({
    title = "Dashboard",
    userName = "Pemilik Kos",
    userEmail = "owner@koshub.com",
    userAvatar,
    className,
    ...props
}) {
    return (
        <header
            className={cn(
                "flex h-16 w-full items-center justify-between border-b border-border bg-card px-6 shadow-xs select-none",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="hidden flex-col text-right sm:flex">
                        <span className="text-sm font-semibold text-foreground leading-none">
                            {userName}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1 leading-none">
                            {userEmail}
                        </span>
                    </div>

                    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
