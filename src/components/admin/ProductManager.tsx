import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_urls?: string[] | string | null;
  featured: boolean;
  created_at: string;
  category?: string | null;
  watt?: number | null;
  cri?: number | null;
  beam_angle?: number | null;
  voltage_range?: string | null;
  ip_rating?: string | null;
  total_lumen?: number | null;
  warranty_years?: number | null;
  base_type?: string | null;
  material?: string | null;
  usage_areas?: string | null;
  spec_pdf_url?: string | null;
}

const CATEGORY_OPTIONS = ["كهربائية", "إلكترونية"];

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    featured: false,
    category: CATEGORY_OPTIONS[0],
    image: null as File | null,
    watt: "",
    cri: "",
    beam_angle: "",
    voltage_range: "",
    ip_rating: "",
    total_lumen: "",
    warranty_years: "",
    base_type: "",
    material: "",
    usage_areas: "",
    spec_pdf: null as File | null,
  });

  const [extraImages, setExtraImages] = useState<File[]>([]);
  const [imageUrlsPreview, setImageUrlsPreview] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب المنتجات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("products").upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const uploadPdf = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("product-specs")
      .upload(fileName, file, { contentType: "application/pdf" });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("product-specs").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      featured: false,
      category: CATEGORY_OPTIONS[0],
      image: null,
      watt: "",
      cri: "",
      beam_angle: "",
      voltage_range: "",
      ip_rating: "",
      total_lumen: "",
      warranty_years: "",
      base_type: "",
      material: "",
      usage_areas: "",
      spec_pdf: null,
    });
    setExtraImages([]);
    setImageUrlsPreview([]);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.name.trim()) throw new Error("الاسم مطلوب");
      const parsedPrice = formData.price ? Number(formData.price) : null;

      let imageUrl = editingProduct?.image_url || "";
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const imageUrls: string[] = Array.isArray(editingProduct?.image_urls)
        ? (editingProduct?.image_urls as string[])
        : typeof editingProduct?.image_urls === "string"
          ? (() => { try { return JSON.parse(editingProduct?.image_urls || "[]"); } catch { return []; } })()
          : [];
      if (extraImages.length) {
        for (const file of extraImages) {
          const url = await uploadImage(file);
          imageUrls.push(url);
        }
      }

      let specPdfUrl = editingProduct?.spec_pdf_url || null;
      if (formData.spec_pdf) {
        specPdfUrl = await uploadPdf(formData.spec_pdf);
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parsedPrice,
        featured: formData.featured,
        category: formData.category || null,
        image_url: imageUrl,
        image_urls: imageUrls,
        watt: formData.watt ? parseInt(formData.watt, 10) : null,
        cri: formData.cri ? parseInt(formData.cri, 10) : null,
        beam_angle: formData.beam_angle ? parseInt(formData.beam_angle, 10) : null,
        voltage_range: formData.voltage_range || null,
        ip_rating: formData.ip_rating || null,
        total_lumen: formData.total_lumen ? parseInt(formData.total_lumen, 10) : null,
        warranty_years: formData.warranty_years ? parseInt(formData.warranty_years, 10) : null,
        base_type: formData.base_type || null,
        material: formData.material || null,
        usage_areas: formData.usage_areas || null,
        spec_pdf_url: specPdfUrl,
      };

      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id);
        if (error) throw error;
        toast({ title: "تم تحديث المنتج", description: "تم حفظ التغييرات بنجاح" });
      } else {
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
        toast({ title: "تم إنشاء المنتج", description: "تم حفظ المنتج الجديد بنجاح" });
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({ title: "حدث خطأ", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const parsedImages = Array.isArray(product.image_urls)
      ? product.image_urls
      : typeof product.image_urls === "string"
        ? (() => { try { return JSON.parse(product.image_urls); } catch { return []; } })()
        : [];

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price != null ? String(product.price) : "",
      featured: !!product.featured,
      category: product.category || CATEGORY_OPTIONS[0],
      image: null,
      watt: product.watt != null ? String(product.watt) : "",
      cri: product.cri != null ? String(product.cri) : "",
      beam_angle: product.beam_angle != null ? String(product.beam_angle) : "",
      voltage_range: product.voltage_range || "",
      ip_rating: product.ip_rating || "",
      total_lumen: product.total_lumen != null ? String(product.total_lumen) : "",
      warranty_years: product.warranty_years != null ? String(product.warranty_years) : "",
      base_type: product.base_type || "",
      material: product.material || "",
      usage_areas: product.usage_areas || "",
      spec_pdf: null,
    });
    setImageUrlsPreview(parsedImages);
    setExtraImages([]);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "تم حذف المنتج" });
      fetchProducts();
    } catch (error: any) {
      toast({ title: "خطأ في الحذف", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
          <p className="text-muted-foreground">أضف وعدّل واحذف المنتجات مع تحديد الفئة (كهربائية / إلكترونية)</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "outline" : "default"}>
          {showAddForm ? "إغلاق النموذج" : "إضافة منتج جديد"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? "تعديل منتج" : "منتج جديد"}</CardTitle>
            <CardDescription>الحقول الأساسية مع اختيار الفئة والصورة وملف المواصفات</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>اسم المنتج *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <Label>السعر</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <Label>الفئة</Label>
                  <select
                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    id="featured"
                  />
                  <Label htmlFor="featured" className="flex items-center gap-1">
                    <Star className="h-4 w-4" /> منتج مميز
                  </Label>
                </div>
              </div>

              <div>
                <Label>الوصف</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>الصورة الرئيسية</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} />
                </div>
                <div>
                  <Label>صور إضافية (اختياري)</Label>
                  <Input type="file" accept="image/*" multiple onChange={(e) => setExtraImages(Array.from(e.target.files || []))} />
                </div>
              </div>

              <div>
                <Label>ملف مواصفات PDF (اختياري)</Label>
                <Input type="file" accept="application/pdf" onChange={(e) => setFormData({ ...formData, spec_pdf: e.target.files?.[0] || null })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>القدرة (واط)</Label>
                  <Input value={formData.watt} onChange={(e) => setFormData({ ...formData, watt: e.target.value })} />
                </div>
                <div>
                  <Label>CRI</Label>
                  <Input value={formData.cri} onChange={(e) => setFormData({ ...formData, cri: e.target.value })} />
                </div>
                <div>
                  <Label>زاوية الإضاءة</Label>
                  <Input value={formData.beam_angle} onChange={(e) => setFormData({ ...formData, beam_angle: e.target.value })} />
                </div>
                <div>
                  <Label>نطاق الفولت</Label>
                  <Input value={formData.voltage_range} onChange={(e) => setFormData({ ...formData, voltage_range: e.target.value })} />
                </div>
                <div>
                  <Label>IP</Label>
                  <Input value={formData.ip_rating} onChange={(e) => setFormData({ ...formData, ip_rating: e.target.value })} />
                </div>
                <div>
                  <Label>اللومن الكلي</Label>
                  <Input value={formData.total_lumen} onChange={(e) => setFormData({ ...formData, total_lumen: e.target.value })} />
                </div>
                <div>
                  <Label>الضمان (سنوات)</Label>
                  <Input value={formData.warranty_years} onChange={(e) => setFormData({ ...formData, warranty_years: e.target.value })} />
                </div>
                <div>
                  <Label>نوع القاعدة</Label>
                  <Input value={formData.base_type} onChange={(e) => setFormData({ ...formData, base_type: e.target.value })} />
                </div>
                <div>
                  <Label>المادة</Label>
                  <Input value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} />
                </div>
                <div>
                  <Label>أماكن الاستخدام</Label>
                  <Input value={formData.usage_areas} onChange={(e) => setFormData({ ...formData, usage_areas: e.target.value })} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 ml-1" /> {editingProduct ? "حفظ التعديلات" : "حفظ المنتج"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 ml-1" /> إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>المنتجات</CardTitle>
          <CardDescription>إدارة كافة المنتجات الحالية</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">جاري تحميل المنتجات...</p>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground">لا توجد منتجات حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{product.name}</h4>
                      {product.featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="h-3 w-3" /> مميز
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">الفئة: {product.category || "غير محدد"}</p>
                    <p className="text-sm text-muted-foreground">السعر: {product.price ?? "-"}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4 ml-1" /> تعديل
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4 ml-1" /> حذف
                      </Button>
                    </div>
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

export default ProductManager;
