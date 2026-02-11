import type { ReactNode } from "react";
import HeaderForm from "@/app/components/HeaderForm";
import FooterForm from "@/app/components/FooterForm";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderForm />
      <main className="flex-1">{children}</main>
      <FooterForm />
    </div>
  );
}
