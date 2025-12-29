import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit, Trash2, Image as ImageIcon, FileText, X, Eye } from "lucide-react";

interface Catalog {
  id: string;
  title: string;
  description: string | null;
  pdf_file_path: string;
  pdf_file_url: string;
  pdf_file_size: number | null;
  image_file_path: string | null;
  image_file_url: string | null;
  created_at: string;
  updated_at: string;
}

const PDF_BUCKET = "catalogs-pdf";
const IMAGE_BUCKET = "catalogs-images";

const CatalogManager = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    pdf: null as File | null,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const filteredCatalogs = useMemo(() => {
    if (!search.trim()) return catalogs;
    const q = search.toLowerCase();
    return catalogs.filter((c) => c.title.toLowerCase().includes(q));
  }, [catalogs, search]);

  const fetchCatalogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("catalogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "خطأ في جلب الكتالوجات", description: error.message, variant: "destructive" });
    } else {
      setCatalogs(data || []);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", pdf: null, image: null });
    setEditingId(null);
    setImagePreview(null);
  };

  const handleEdit = (catalog: Catalog) => {
    setEditingId(catalog.id);
    setForm({ title: catalog.title, description: catalog.description || "", pdf: null, image: null });
    setImagePreview(catalog.image_file_url || null);
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { path: fileName, url: publicData.publicUrl };
  };

  const removeFile = async (bucket: string, path: string | null) => {
    if (!path) return;
    await supabase.storage.from(bucket).remove([path]);
  };

  const handleDelete = async (catalog: Catalog) => {
    if (!confirm("تأكيد حذف الكتالوج بالكامل؟")) return;
    setIsSubmitting(true);
    const { error } = await supabase.from("catalogs").delete().eq("id", catalog.id);
    if (error) {
      toast({ title: "فشل الحذف", description: error.message, variant: "destructive" });
    } else {
      await removeFile(PDF_BUCKET, catalog.pdf_file_path);
      await removeFile(IMAGE_BUCKET, catalog.image_file_path);
      setCatalogs((prev) => prev.filter((c) => c.id !== catalog.id));
      toast({ title: "تم حذف الكتالوج" });
    }
    setIsSubmitting(false);
  };

  const handleRemoveImage = async (catalog: Catalog) => {
    if (!catalog.image_file_path) return;
    if (!confirm("حذف الصورة فقط؟")) return;
    setIsSubmitting(true);
    const { error } = await supabase
      .from("catalogs")
      .update({ image_file_path: null, image_file_url: null })
      .eq("id", catalog.id);
    if (error) {
      toast({ title: "فشل حذف الصورة", description: error.message, variant: "destructive" });
    } else {
      await removeFile(IMAGE_BUCKET, catalog.image_file_path);
      setCatalogs((prev) => prev.map((c) => (c.id === catalog.id ? { ...c, image_file_path: null, image_file_url: null } : c)));
      if (editingId === catalog.id) setImagePreview(null);
      toast({ title: "تم حذف الصورة" });
    }
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast({ title: "العنوان مطلوب", variant: "destructive" });
      return;
    }
    if (!editingId && !form.pdf) {
      toast({ title: "ملف PDF مطلوب" , variant: "destructive"});
      return;
    }

    setIsSubmitting(true);
    try {
      let pdfPath = "";
      let pdfUrl = "";
      let pdfSize: number | null = null;
      let imagePath: string | null = null;
      let imageUrl: string | null = null;

      if (editingId) {
        const current = catalogs.find((c) => c.id === editingId);
        if (!current) throw new Error("catalog not found");
        pdfPath = current.pdf_file_path;
        pdfUrl = current.pdf_file_url;
        pdfSize = current.pdf_file_size;
        imagePath = current.image_file_path;
        imageUrl = current.image_file_url;

        if (form.pdf) {
          const pdfUpload = await uploadFile(form.pdf, PDF_BUCKET, "pdfs");
          await removeFile(PDF_BUCKET, current.pdf_file_path);
          pdfPath = pdfUpload.path;
          pdfUrl = pdfUpload.url;
          pdfSize = form.pdf.size;
        }
        if (form.image) {
          const imgUpload = await uploadFile(form.image, IMAGE_BUCKET, "images");
          await removeFile(IMAGE_BUCKET, current.image_file_path);
          imagePath = imgUpload.path;
          imageUrl = imgUpload.url;
        }

        const { error } = await supabase
          .from("catalogs")
          .update({
            title: form.title.trim(),
            description: form.description.trim() || null,
            pdf_file_path: pdfPath,
            pdf_file_url: pdfUrl,
            pdf_file_size: pdfSize,
            image_file_path: imagePath,
            image_file_url: imageUrl,
          })
          .eq("id", editingId);
        if (error) throw error;
        setCatalogs((prev) => prev.map((c) => (c.id === editingId ? { ...c, title: form.title.trim(), description: form.description.trim() || null, pdf_file_path: pdfPath, pdf_file_url: pdfUrl, pdf_file_size: pdfSize, image_file_path: imagePath, image_file_url: imageUrl } : c)));
        toast({ title: "تم التحديث" });
      } else {
        if (!form.pdf) throw new Error("PDF required");
        const pdfUpload = await uploadFile(form.pdf, PDF_BUCKET, "pdfs");
        pdfPath = pdfUpload.path;
        pdfUrl = pdfUpload.url;
        pdfSize = form.pdf.size;

        if (form.image) {
          const imgUpload = await uploadFile(form.image, IMAGE_BUCKET, "images");
          imagePath = imgUpload.path;
          imageUrl = imgUpload.url;
        }

        const { data, error } = await supabase
          .from("catalogs")
          .insert({
            title: form.title.trim(),
            description: form.description.trim() || null,
            pdf_file_path: pdfPath,
            pdf_file_url: pdfUrl,
            pdf_file_size: pdfSize,
            image_file_path: imagePath,
            image_file_url: imageUrl,
          })
          .select()
          .single();
        if (error) throw error;
        setCatalogs((prev) => [data as Catalog, ...prev]);
        toast({ title: "تم إضافة الكتالوج" });
      }
      resetForm();
    } catch (error: any) {
      toast({ title: "فشل الحفظ", description: error.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.length) return;
    const file = files[0];
    setForm((prev) => ({ ...prev, [name]: file }));
    if (name === "image") {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>{editingId ? "تعديل كتالوج" : "إضافة كتالوج جديد"}</CardTitle>
            <CardDescription>ملف PDF إجباري، الصورة اختيارية</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="بحث بالعنوان"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <Button variant="ghost" onClick={resetForm} disabled={isSubmitting}>
              <X className="h-4 w-4 mr-1" />
              مسح النموذج
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">العنوان *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="عنوان الكتالوج"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الوصف</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><FileText className="h-4 w-4" /> ملف PDF *</label>
              <Input type="file" name="pdf" accept="application/pdf" onChange={handleFileChange} />
              {form.pdf && <p className="text-xs text-muted-foreground">سيتم رفع: {form.pdf.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><ImageIcon className="h-4 w-4" /> صورة الكتالوج (اختياري)</label>
              <Input type="file" name="image" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
              {imagePreview && (
                <div className="mt-2 relative w-40 h-28 overflow-hidden rounded-lg border">
                  <img src={imagePreview} alt="preview" className="object-cover w-full h-full" />
                  <Button type="button" size="icon" variant="secondary" className="absolute top-1 right-1 h-7 w-7" onClick={() => setImagePreview(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "حفظ التعديلات" : "إضافة الكتالوج"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm} disabled={isSubmitting}>
                إلغاء التعديل
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الكتالوجات</CardTitle>
          <CardDescription>إدارة كل الكتالوجات المحفوظة</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> جاري التحميل...</div>
          ) : filteredCatalogs.length === 0 ? (
            <p className="text-muted-foreground text-sm">لا توجد كتالوجات حالياً.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCatalogs.map((catalog) => (
                <Card key={catalog.id} className="border">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-4 w-4" /> {catalog.title}
                    </CardTitle>
                    {catalog.description && <CardDescription>{catalog.description}</CardDescription>}
                    <p className="text-xs text-muted-foreground">أضيف في: {new Date(catalog.created_at).toLocaleDateString("ar-SA")}</p>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(catalog)} disabled={isSubmitting}>
                      <Edit className="h-4 w-4 mr-1" /> تعديل
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveImage(catalog)} disabled={isSubmitting || !catalog.image_file_path}>
                      <ImageIcon className="h-4 w-4 mr-1" /> حذف الصورة
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(catalog)} disabled={isSubmitting}>
                      <Trash2 className="h-4 w-4 mr-1" /> حذف الكتالوج
                    </Button>
                    {catalog.pdf_file_url && (
                      <a href={catalog.pdf_file_url} target="_blank" rel="noreferrer" className="inline-flex">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> معاينة PDF
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogManager;
