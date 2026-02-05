import { Layout } from "@/app/components/Layout";
import { Contact } from "@/app/components/Contact";
import { HeroContacto } from "@/app/components/HeroContacto";

export default function Contacto() {
  return (
    <Layout>
      <HeroContacto />
      <Contact />
    </Layout>
  );
}