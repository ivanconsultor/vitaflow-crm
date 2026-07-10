"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Não proteger a própria rota de login
    if (pathname === "/login") {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("gsd_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router, pathname]);

  const logout = () => {
    localStorage.removeItem("gsd_token");
    router.push("/login");
  };

  return { isAuthenticated, isLoading, logout };
}
