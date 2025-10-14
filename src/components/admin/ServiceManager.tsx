import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Settings } from "lucide-react";

interface Service {
  id: number;
  category: string;
  sub_category: string;
  description: string;
  detailed_description: string;
  slug: string;
  image_url: string;
  created_at: string;
}

const ServiceManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    category: "",
    sub_category: "",
    description: "",
    detailed_description: "",
    slug: "",
    image: null as File | null,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("service")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب الخدمات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (category: string): string => {
    return category
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/[يى]/g, 'ي')
      .replace(/[ؤ]/g, 'و')
      .replace(/[ة]/g, 'ه')
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = editingService?.image_url || "";

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const slug = formData.slug || generateSlug(formData.category);

      const serviceData = {
        category: formData.category,
        sub_category: formData.sub_category,
        description: formData.description,
        detailed_description: formData.detailed_description,
        slug: slug,
        image_url: imageUrl,
      };

      if (editingService) {
        const { error } = await supabase
          .from("service")
          .update(serviceData)
          .eq("id", editingService.id);

        if (error) throw error;

        toast({
          title: "تم تحديث الخدمة",
          description: "تم تحديث الخدمة بنجاح",
        });
      } else {
        const { error } = await supabase
          .from("service")
          .insert(serviceData);

        if (error) throw error;

        toast({
          title: "تمت إضافة الخدمة",
          description: "تم إضافة الخدمة بنجاح",
        });
      }

      resetForm();
      fetchServices();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      category: service.category,
      sub_category: service.sub_category || "",
      description: service.description || "",
      detailed_description: service.detailed_description || "",
      slug: service.slug || "",
      image: null,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;

    try {
      const { error } = await supabase
        .from("service")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم حذف الخدمة",
        description: "تم حذف الخدمة بنجاح",
      });

      fetchServices();
    } catch (error: any) {
      toast({
        title: "خطأ في الحذف",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      category: "",
      sub_category: "",
      description: "",
      detailed_description: "",
      slug: "",
      image: null,
    });
    setShowAddForm(false);
    setEditingService(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">الخدمات ({services.length})</h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? "إلغاء" : "إضافة خدمة"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم الخدمة</label>
                <Input
                  value={formData.category}
                  onChange={(e) => {
                    const category = e.target.value;
                    setFormData({ 
                      ...formData, 
                      category,
                      slug: generateSlug(category)
                    });
                  }}
                  required
                  placeholder="أدخل اسم الخدمة"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">التخصص الفرعي</label>
                <Input
                  value={formData.sub_category}
                  onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                  placeholder="أدخل التخصص الفرعي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف المختصر</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل وصف مختصر للخدمة"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف المفصل</label>
                <Textarea
                  value={formData.detailed_description}
                  onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                  placeholder="أدخل وصف مفصل للخدمة"
                  rows={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الرابط المختصر (Slug)</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="سيتم إنشاؤه تلقائياً من اسم الخدمة"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  مثال: /services/{formData.slug || generateSlug(formData.category)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">صورة الخدمة</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "جاري الحفظ..." : "حفظ"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="pb-2">
              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.category}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-lg mb-2">{service.category}</h4>
              {service.sub_category && (
                <p className="text-sm text-primary mb-2">{service.sub_category}</p>
              )}
              <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                {service.description}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                /services/{service.slug}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(service)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد خدمات حالياً</p>
        </div>
      )}
    </div>
  );
};

export default ServiceManager;