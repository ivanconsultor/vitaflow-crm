"use client";

import { useAuth } from "../hooks/useAuth";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "../app/layout.module.css";

export default function AuthClientWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-primary)', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#A855F7' }}>Autenticando sistema...</div>
      </div>
    );
  }

  if (pathname === "/login") {
    return <main style={{ display: 'flex', width: '100%', minHeight: '100vh', flex: 1 }}>{children}</main>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.pageContainer}>{children}</main>
      </div>
    </>
  );
}
