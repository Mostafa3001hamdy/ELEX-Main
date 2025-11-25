import { useState, useEffect } from "react";
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
  image_urls?: string[] | null;
  featured: boolean;
  created_at: string;
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

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  created_at?: string | null;
}

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
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
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
      setProducts(data || []);
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
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const uploadPdf = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-specs")
      .upload(filePath, file, { contentType: "application/pdf" });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("product-specs").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const fetchProductImages = async (productId: number) => {
    try {
      const { data, error } = await supabase
        .from("product_images")
        .select("id, product_id, image_url, created_at")
        .eq("product_id", productId)
        .order("created_at", { ascending: true });
      if (!error) setExistingImages((data as ProductImage[]) || []);
    } catch (_e) {
      setExistingImages([]);
    }
  };

  const deleteProductImage = async (imageId: number) => {
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast({ title: "تم الحذف", description: "تم حذف الصورة" });
    }
  };

  const removeExtraImage = (index: number) => {
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImageUrl = async (url: string) => {
    if (!editingProduct) return;
    try {
      const currentUrls = editingProduct.image_urls || [];
      const newUrls = currentUrls.filter((u) => u !== url);
      const newMain = url === editingProduct.image_url ? (newUrls[0] || null) : editingProduct.image_url;

      const { error } = await supabase
        .from("products")
        .update({ image_urls: newUrls, image_url: newMain })
        .eq("id", editingProduct.id);

      if (error) throw error;

      setEditingProduct({ ...editingProduct, image_urls: newUrls, image_url: (newMain as any) || "" });
      setImageUrlsPreview(newUrls);
      toast({ title: "تم حذف الصورة", description: "تم تحديث صور المنتج" });
    } catch (error: any) {
      toast({ title: "خطأ في حذف الصورة", description: error.message, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedPrice = parseFloat(formData.price);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        toast({ title: "قيمة السعر غير صحيحة", description: "برجاء إدخال سعر صالح", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      let imageUrl = editingProduct?.image_url || "";
      let imageUrls: string[] = imageUrlsPreview ? [...imageUrlsPreview] : [];
      let specPdfUrl: string | null = editingProduct?.spec_pdf_url || null;

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      // Upload extra images first and collect URLs
      if (extraImages.length > 0) {
        for (const file of extraImages) {
          const url = await uploadImage(file);
          imageUrls.push(url);
        }
      }

      // Upload spec PDF if provided
      if (formData.spec_pdf) {
        specPdfUrl = await uploadPdf(formData.spec_pdf);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parsedPrice,
        featured: formData.featured,
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
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        toast({
          title: "تم تحديث المنتج",
          description: "تم تحديث المنتج بنجاح",
        });
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData);

        if (error) throw error;

        toast({
          title: "تمت إضافة المنتج",
          description: "تم إضافة المنتج بنجاح",
        });
      }

      resetForm();
      fetchProducts();
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      featured: product.featured || false,
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
    setExtraImages([]);
    
    let imageUrls: string[] = [];
    if (product.image_urls) {
      if (typeof product.image_urls === 'string') {
        try {
          const parsed = JSON.parse(product.image_urls);
          if (Array.isArray(parsed)) {
            imageUrls = parsed;
          }
        } catch (error) {
          console.error("Failed to parse image_urls:", error);
        }
      } else if (Array.isArray(product.image_urls)) {
        imageUrls = product.image_urls;
      }
    }
    
    setImageUrlsPreview(imageUrls);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم حذف المنتج",
        description: "تم حذف المنتج بنجاح",
      });

      fetchProducts();
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
      name: "",
      description: "",
      price: "",
      featured: false,
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
    setExistingImages([]);
    setImageUrlsPreview([]);
    setShowAddForm(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">المنتجات ({products.length})</h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? "إلغاء" : "إضافة منتج"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم المنتج</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="أدخل اسم المنتج"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ملف المواصفات الفنية (PDF)</label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFormData({ ...formData, spec_pdf: e.target.files?.[0] || null })}
                />
                {editingProduct?.spec_pdf_url && (
                  <div className="mt-2 text-sm">
                    موجود ملف مواصفات: <a href={editingProduct.spec_pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">عرض الملف الحالي</a>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">صور إضافية</label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setExtraImages(Array.from(e.target.files || []))}
                />
                {(extraImages.length > 0 || (imageUrlsPreview && imageUrlsPreview.length > 0)) && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {(imageUrlsPreview || []).map((url, idx) => (
                      <div key={`existing-${idx}`} className="relative group">
                        <img src={url} className="w-full h-24 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => handleDeleteImageUrl(url)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                    {extraImages.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative group">
                        <img src={URL.createObjectURL(file)} className="w-full h-24 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => removeExtraImage(idx)}
                          className="absolute top-1 right-1 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                        >
                          إلغاء
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل وصف المنتج"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">السعر</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الواط</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.watt}
                    onChange={(e) => setFormData({ ...formData, watt: e.target.value })}
                    placeholder="مثال: 6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">معامل إظهار اللون (CRI)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.cri}
                    onChange={(e) => setFormData({ ...formData, cri: e.target.value })}
                    placeholder="مثال: 80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">زاوية الانتشار (°)</label>
                  <Input
                    type="number"
                    min="0"
                    max="180"
                    value={formData.beam_angle}
                    onChange={(e) => setFormData({ ...formData, beam_angle: e.target.value })}
                    placeholder="مثال: 60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الجهد الكهربائي</label>
                  <Input
                    value={formData.voltage_range}
                    onChange={(e) => setFormData({ ...formData, voltage_range: e.target.value })}
                    placeholder="مثال: 220V-240V"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">درجة المقاومة (IP)</label>
                  <Input
                    value={formData.ip_rating}
                    onChange={(e) => setFormData({ ...formData, ip_rating: e.target.value })}
                    placeholder="مثال: IP20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">مجموع اللومين</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.total_lumen}
                    onChange={(e) => setFormData({ ...formData, total_lumen: e.target.value })}
                    placeholder="مثال: 550"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الضمان (بالسنوات)</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.warranty_years}
                    onChange={(e) => setFormData({ ...formData, warranty_years: e.target.value })}
                    placeholder="مثال: 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">قاعدة اللمبة</label>
                  <Input
                    value={formData.base_type}
                    onChange={(e) => setFormData({ ...formData, base_type: e.target.value })}
                    placeholder="مثال: GU10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">مادة الصنع</label>
                  <Input
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="مثال: ألومنيوم وزجاج"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">أماكن الاستخدام</label>
                  <Textarea
                    rows={2}
                    value={formData.usage_areas}
                    onChange={(e) => setFormData({ ...formData, usage_areas: e.target.value })}
                    placeholder="مثال: الممرات، غرف المعيشة، المكاتب"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">صورة المنتج</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  required={!editingProduct}
                />
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  منتج مميز (يظهر في الصفحة الرئيسية)
                </Label>
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
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-2">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">{product.name}</h4>
                {product.featured && (
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3 fill-current" />
                    مميز
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="font-bold text-primary mb-4">{product.price} ريال
                
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد منتجات حالياً</p>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
