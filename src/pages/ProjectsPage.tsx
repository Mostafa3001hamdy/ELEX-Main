import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Projects from "@/components/Projects";

const ProjectsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Projects searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;

