import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import Services from "@/components/Services";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  const location = useLocation();
  useScrollReveal([location.pathname, location.hash]);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = location.hash;
      if (!hash || hash.length < 2) return;

      const targetId = hash.slice(1); // remove leading '#'
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      // Account for sticky header height and extra spacing (~140-160px)
      const offset = 160;
      const topY = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      // Slight delay to ensure layout/imagery has settled
      window.setTimeout(() => {
        window.scrollTo({ top: topY, behavior: "smooth" });
      }, 100);
    };

    // Defer to ensure elements are laid out
    const id = window.setTimeout(scrollToHash, 0);
    return () => window.clearTimeout(id);
  }, [location.hash]);

  return (
    <div className="min-h-screen relative">
      {/* Fixed background logo */}
      
      {/* Page content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <ProductShowcase />
        <Services />
        <About />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
