import { ThemeProvider } from "@/app/components/ThemeProvider";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { Services } from "@/app/components/Services";
import { Industry } from "@/app/components/Industry";
import { Partner } from "@/app/components/Partner";
import { Contact } from "@/app/components/Contact";
import { Footer } from "@/app/components/Footer";


export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <Hero />
          <Services />
          <Industry />
          <Partner />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
