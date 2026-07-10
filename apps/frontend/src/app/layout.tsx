import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "./layout.module.css";

import AuthClientWrapper from "@/components/AuthClientWrapper";

export const metadata = {
  title: {
    default: "VitaFlow — CRM & Negócio Digital com IA",
    template: "%s | VitaFlow"
  },
  description: "Gerencie sua operação de afiliados (ClickBank, BuyGoods, Digistore24, MaxWeb, GuruMedia) e tráfego inteligente em um só lugar.",
  keywords: ["CRM", "Marketing de Afiliados", "Nutra", "ClickBank", "BuyGoods", "Meta Ads", "Inteligência Artificial"],
  authors: [{ name: "VitaFlow" }],
  openGraph: {
    title: "VitaFlow — CRM & Negócio Digital com IA",
    description: "Gerencie sua operação de afiliados e tráfego inteligente em um só lugar.",
    url: "https://vitaflow-seunegocio.com",
    siteName: "VitaFlow",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VitaFlow — CRM & Negócio Digital com IA",
    description: "Gerencie sua operation de afiliados e tráfego inteligente em um só lugar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={styles.container}>
        <AuthClientWrapper>
          {children}
        </AuthClientWrapper>
      </body>
    </html>
  );
}
