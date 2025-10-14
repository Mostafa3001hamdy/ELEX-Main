import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, User, Building } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  client_name: string;
  completion_date: string;
  project_type: string;
  image_url: string;
  created_at: string;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      try {
        const projectId = Number(id);
        if (!id || Number.isNaN(projectId)) {
          setProject(null);
          return;
        }
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();
        if (error) throw error;
        setProject(data as Project);
      } catch (e) {
        console.error("Failed to load project", e);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل المشروع...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">المشروع غير موجود</h1>
            <Button onClick={() => navigate("/projects")} variant="outline">
              العودة إلى المشاريع
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="py-20 bg-gradient-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Button
                onClick={() => navigate("/projects")}
                variant="ghost"
                className="mb-6 text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة إلى المشاريع
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{project.title}</h1>
              {project.description && (
                <p className="text-xl text-muted-foreground mb-8">{project.description}</p>
              )}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                {project.image_url && (
                  <div className="rounded-lg overflow-hidden shadow-medium">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </div>
              <div>
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">نوع المشروع:</span>
                      <span className="font-medium">{project.project_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">الموقع:</span>
                      <span className="font-medium">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">العميل:</span>
                      <span className="font-medium">{project.client_name}</span>
                    </div>
                    {project.completion_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">تاريخ الإنجاز:</span>
                        <span className="font-medium">{formatDate(project.completion_date)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;



