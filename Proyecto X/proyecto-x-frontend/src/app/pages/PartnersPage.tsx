import { useEffect } from "react";

export function PartnersPage() {
  useEffect(() => {
    window.location.href = " http://localhost:5174/partner";
  }, []);

  return null;
}