import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, MapPin, User, Building } from "lucide-react";
import { toast } from "sonner";

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

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    client_name: "",
    completion_date: "",
    project_type: "",
    image_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);


  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects((data as Project[]) || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("خطأ في تحميل المشاريع");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      console.log("Saving project data:", formData);
      
      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update(formData)
          .eq("id", editingProject.id);

        if (error) {
          console.error("Database update error:", error);
          throw error;
        }
        toast.success("تم تحديث المشروع بنجاح");
      } else {
        // Create new project
        const { error } = await supabase
          .from("projects")
          .insert([formData]);

        if (error) {
          console.error("Database insert error:", error);
          throw error;
        }
        toast.success("تم إنشاء المشروع بنجاح");
      }

      setEditingProject(null);
      resetForm();
      setShowAddForm(false);
      fetchProjects();
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast.error(`خطأ في حفظ المشروع: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      location: project.location,
      client_name: project.client_name,
      completion_date: project.completion_date || "",
      project_type: project.project_type,
      image_url: project.image_url || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف المشروع بنجاح");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("خطأ في حذف المشروع");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      client_name: "",
      completion_date: "",
      project_type: "",
      image_url: "",
    });
  };

  const getTypeBadge = (type: string) => {
    return <Badge className="bg-primary/10 text-primary">{type}</Badge>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">إدارة المشاريع</h2>
          <p className="text-muted-foreground">إدارة وتنظيم المشاريع المنجزة</p>
        </div>
        <Button onClick={() => { setEditingProject(null); resetForm(); setShowAddForm(!showAddForm); }}>
          <Plus className="h-4 w-4 mr-2" />
          {showAddForm ? "إلغاء" : "إضافة مشروع جديد"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProject ? "تعديل المشروع" : "إضافة مشروع جديد"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">عنوان المشروع</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="project_type">نوع المشروع</Label>
                  <Input
                    id="project_type"
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                    placeholder="مثال: كهربائية، إضاءة، طاقة شمسية..."
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">وصف المشروع</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">الموقع</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_name">اسم العميل</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="completion_date">تاريخ الإنجاز</Label>
                <Input
                  id="completion_date"
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="image_url">رابط صورة المشروع</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  يمكنك استخدام روابط من Unsplash أو أي موقع صور آخر
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "جاري الحفظ..." : (editingProject ? "تحديث" : "إنشاء")}
                </Button>
                <Button type="button" variant="outline" onClick={() => { resetForm(); setEditingProject(null); setShowAddForm(false); }}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                {getTypeBadge(project.project_type)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              
              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  <span>{project.project_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>{project.client_name}</span>
                </div>
                {project.completion_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{formatDate(project.completion_date)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(project)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(project.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏗️</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد مشاريع</h3>
          <p className="text-muted-foreground mb-4">
            ابدأ بإضافة مشروع جديد لعرضه في صفحة المشاريع
          </p>
          <Button onClick={() => { setEditingProject(null); resetForm(); setShowAddForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة مشروع جديد
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;