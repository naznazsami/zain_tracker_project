"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Role = "USER" | "ADMIN";

export default function withAuth<P>(Component: React.ComponentType<P>, options?: { roles?: Role[] }) {
  function Guard(props: P) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
      const token = Cookies.get("accessToken");
      if (!token) {
        router.replace("/login");
        return;
      }
      if (!options?.roles) {
        setAllowed(true);
        return;
      }
      try {
        const payload = JSON.parse(atob(token.split(".")[1] || ""));
        const role: Role | undefined = payload?.role;
        if (role && options.roles.includes(role)) {
          setAllowed(true);
        } else {
          router.replace("/");
        }
      } catch {
        router.replace("/login");
      }
    }, [router]);

    if (!allowed) return null;
    return <Component {...props} />;
  }
  return Guard;
}


