import { Layout } from "@/app/components/Layout";
import { Services } from "@/app/components/Services";
import { HeroServicios } from "@/app/components/HeroServicios";

export default function Servicios() {
  return (
    <Layout>
      <HeroServicios />
      <Services />
    </Layout>
  );
}
