"use client";

import { useGetMeQuery } from "@/lib/store/auth/apislice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading, isError } = useGetMeQuery();
    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        if (!isLoading) {
            if (isError || (user && user.role !== 0)) {
                Cookies.remove("token");
                router.push("/");
                toast.error("Access Denied: Admins Only");
            }
        }
    }, [isLoading, isError, user, router]);

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground animate-pulse">Verifying Admin Privileges...</p>
                </div>
            </div>
        );
    }

    // If we have toxic data (not admin) but not loading yet, we might hide content
    if (!user || user.role !== 0) {
        return null;
    }

    return <>{children}</>;
}
