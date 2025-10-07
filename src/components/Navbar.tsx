"use client";
import Link from "next/link";
import React from "react";
import Cookies from "js-cookie";
import RevalidatePath from "@/actions";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
export default function Navbar({ profile }: { profile: any }) {
  const pathname = usePathname();
  const onLogout = async () => {
    Cookies.remove("accessToken");
    RevalidatePath(pathname);
  };

  return (
    <nav className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="text-base font-semibold">
          <Link href="/">Personal finance tracker</Link>
        </div>
        <div className="flex items-center gap-2">
          {profile?.id ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {profile.email}
              </span>
              <Separator orientation="vertical" className="h-6" />
              {profile.role === "ADMIN" && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/Admin">Dashboard</Link>
                </Button>
              )}
              <Button onClick={onLogout} variant="destructive" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
