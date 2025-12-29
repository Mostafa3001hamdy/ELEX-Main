import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_urls?: string[] | null;
  featured: boolean;
  name_en?: string;
  description_en?: string;
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

const ProductDetail = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    const productId = Number(id);
    if (!id || Number.isNaN(productId)) {
      setProduct(null);
      setImages([]);
      setErrorMessage("المنتج غير متوفر");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error || !data) {
          setErrorMessage("تعذر تحميل المنتج");
          setProduct(null);
          setImages([]);
          return;
        }

        setProduct(data as Product);

        const urlsRaw = (data as any)?.image_urls;
        let urlsFromProduct: string[] = [];

        if (urlsRaw) {
          if (typeof urlsRaw === "string") {
            try {
              const parsed = JSON.parse(urlsRaw);
              if (Array.isArray(parsed)) {
                urlsFromProduct = parsed.filter((u: unknown) => typeof u === "string" && u);
              }
            } catch {
              // ignore
            }
          } else if (Array.isArray(urlsRaw)) {
            urlsFromProduct = urlsRaw.filter((u: unknown) => typeof u === "string" && u);
          }
        }

        if (!urlsFromProduct.length) {
          try {
            const { data: imgs } = await supabase
              .from("product_images")
              .select("image_url")
              .eq("product_id", productId)
              .order("created_at", { ascending: true });
            urlsFromProduct = (imgs?.map((r: any) => r.image_url) || []) as string[];
          } catch {
            // ignore
          }
        }

        const main = (data as any)?.image_url || "";
        const all = [
          ...(main ? [main] : []),
          ...urlsFromProduct.filter((u: string) => u && u !== main),
        ];
        setImages(all);
      } catch (err) {
        console.error("Error loading product:", err);
        setProduct(null);
        setImages([]);
        setErrorMessage("حدث خطأ أثناء تحميل المنتج");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const buildWhatsAppUrl = (p: Product) => {
    const base = "https://wa.me/966570135200";
    const nameText = language === "en" && p.name_en ? p.name_en : p.name;
    const currency = t("product.currency");
    const message = language === "en"
      ? `Hello, I would like to order the product: ${nameText} for ${p.price} ${currency}. Link: ${window.location.href}`
      : `أرغب في طلب المنتج: ${nameText} بسعر ${p.price} ${currency}. الرابط: ${window.location.href}`;
    return `${base}?text=${encodeURIComponent(message)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>جاري تحميل المنتج...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p>{errorMessage || "لا يوجد منتج بهذا الرقم"}</p>
          <Link to="/products">
            <Button variant="outline">عودة للمنتجات</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/products">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              عودة للمنتجات
            </Button>
          </Link>
        </div>
        <Card className="border-0 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                {images.length > 0 ? (
                  <div className="relative mb-4">
                    <img
                      src={images[activeIndex]}
                      alt={`${(language === "en" && product.name_en) ? product.name_en : product.name}-${activeIndex}`}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  product.image_url && (
                    <img
                      src={product.image_url}
                      alt={(language === "en" && product.name_en) ? product.name_en : product.name}
                      className="w-full h-80 object-cover rounded-lg mb-4"
                    />
                  )
                )}
                {images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {images.map((url, idx) => (
                      <button
                        key={`thumb-${idx}`}
                        onClick={() => setActiveIndex(idx)}
                        className={`focus:outline-none rounded-md ${activeIndex === idx ? "ring-2 ring-primary" : ""}`}
                      >
                        <img src={url} alt={`Thumbnail ${idx}`} className="w-full h-16 object-cover rounded-md" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{(language === "en" && product.name_en) ? product.name_en : product.name}</h1>
                <div className="text-primary font-semibold mb-4">
                  {product.price} {t("product.currency")}
                </div>
                {(product.description || product.description_en) && (
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {(language === "en" && product.description_en) ? product.description_en : product.description}
                  </p>
                )}

                <h3 className="font-semibold mb-3">المواصفات</h3>
                <ul className="space-y-1 text-sm text-muted-foreground mb-6">
                  {product.watt != null && (<li>القدرة: {product.watt}</li>)}
                  {product.cri != null && (<li>CRI: {product.cri}</li>)}
                  {product.beam_angle != null && (<li>زاوية الإضاءة: {product.beam_angle}</li>)}
                  {product.voltage_range && (<li>نطاق الفولت: {product.voltage_range}</li>)}
                  {product.ip_rating && (<li>تصنيف IP: {product.ip_rating}</li>)}
                  {product.total_lumen != null && (<li>اللومن الكلي: {product.total_lumen} lm</li>)}
                  {product.warranty_years != null && (<li>الضمان: {product.warranty_years} سنوات</li>)}
                  {product.base_type && (<li>نوع القاعدة: {product.base_type}</li>)}
                  {product.material && (<li>المادة: {product.material}</li>)}
                  {product.usage_areas && (<li>أماكن الاستخدام: {product.usage_areas}</li>)}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  {product.spec_pdf_url && (
                    <a href={product.spec_pdf_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="min-w-[180px]">عرض ملف المواصفات</Button>
                    </a>
                  )}
                  <Button
                    className="min-w-[180px]"
                    onClick={() => {
                      addItem({
                        id: product.id,
                        name: (language === "en" && product.name_en) ? product.name_en : product.name,
                        price: product.price,
                        image: product.image_url,
                      });
                      toast({ title: "تمت الإضافة إلى السلة" });
                    }}
                  >
                    أضف للسلة
                  </Button>
                  <a href={buildWhatsAppUrl(product)} target="_blank" rel="noopener noreferrer">
                    <Button className="min-w-[180px] bg-black text-white hover:bg-black/85 border border-black">
                      {t("product.orderNow")}
                    </Button>
                  </a>
                  <Link to="/products">
                    <Button variant="outline" className="min-w-[180px]">عودة</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProductDetail;
