import { Layout } from "@/app/components/Layout";
import { Industry } from "@/app/components/Industry";
import { HeroIndustria } from "@/app/components/HeroIndustria";

export default function Industria() {
  return (
    <Layout>
      <HeroIndustria />
      <Industry />
    </Layout>
  );
}