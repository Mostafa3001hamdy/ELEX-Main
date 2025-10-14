import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, User, Building } from "lucide-react";

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

interface ProjectsProps {
  searchQuery?: string;
}

const Projects = ({ searchQuery = "" }: ProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  useEffect(() => {
    setSearchTerm(searchQuery);
    fetchProjects(searchQuery);
  }, [searchQuery]);

  const fetchProjects = async (query: string = "") => {
    setIsLoading(true);
    try {
      let queryBuilder = supabase
        .from("projects")
        .select("*");

      if (query.trim()) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,client_name.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder.order("completion_date", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search via URL only; no on-page search form

  const clearSearch = () => {
    setSearchTerm("");
    fetchProjects("");
  };

  const getTypeBadge = (type: string) => {
    return <Badge className="bg-primary/10 text-primary">{type}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Force Gregorian calendar with Arabic locale
    return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  // Project type filters removed

  return (
    <section className="section-logo-bg py-20 bg-gradient-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {searchTerm ? `نتائج البحث عن: "${searchTerm}"` : "مشاريعنا المنجزة"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {searchTerm ? `تم العثور على ${projects.length} مشروع` : "نفذنا العديد من المشاريع في مجالات الكهرباء والإلكترونيات ، ونعمل باستمرار على توسيع قائمة إنجازاتنا."}
          </p>
          
          {/* Filters removed */}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل المشاريع...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="group hover:shadow-medium transition-smooth duration-300 border-0 bg-card/50 backdrop-blur-sm hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  {/* Project Image */}
                  {project.image_url && (
                    <div className="mb-6 overflow-hidden rounded-lg">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                      />
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="mb-4">
                    {getTypeBadge(project.project_type)}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth mb-3">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Project Details */}
                  <div className="space-y-3 mb-6">
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
                  </div>

                  {/* CTA Button */}
                  <a href={`/projects/${project.id}`} className="w-full inline-block">
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth"
                    >
                      عرض التفاصيل
                      <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-smooth" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">لم يتم العثور على مشاريع</h3>
            <p className="text-muted-foreground mb-4">
              لا توجد مشاريع تطابق البحث عن "{searchTerm}"
            </p>
            <Button onClick={clearSearch} variant="outline">
              مسح البحث
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد مشاريع متاحة حالياً</h3>
            <p className="text-muted-foreground text-lg">
              سيتم إضافة مشاريعنا قريباً
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
