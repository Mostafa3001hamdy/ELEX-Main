import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Zap, Shield, Award, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import productImage from "@/assets/product-lighting.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  featured: boolean;
  // Optional English fields
  name_en?: string;
  description_en?: string;
}

const ProductShowcase = () => {
  const { t, language } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (isAutoPlaying && featuredProducts.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // تغيير كل 5 ثوان
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, featuredProducts.length]);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? featuredProducts.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === featuredProducts.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const buildWhatsAppUrl = (product: FeaturedProduct) => {
    const base = "https://wa.me/966570135200";
    const nameText = language === 'en' && product.name_en ? product.name_en : product.name;
    const currency = t('product.currency');
    const message = language === 'en'
      ? `Hello, I would like to order the product: ${nameText} for ${product.price} ${currency}. Link: ${window.location.origin}`
      : `مرحبا، أريد طلب المنتج: ${nameText} بسعر ${product.price} ${currency}. الرابط: ${window.location.origin}`;
    return `${base}?text=${encodeURIComponent(message)}`;
  };
  
  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: t('product.energySaving'),
      description: t('product.energySavingDesc')
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: t('product.longWarranty'),
      description: t('product.longWarrantyDesc')
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: t('product.highQuality'),
      description: t('product.highQualityDesc')
    }
  ];

  if (isLoading) {
    return (
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>جاري التحميل...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              لا يوجد منتجات مميزة حالياً
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              يرجى تحديد منتجات مميزة من لوحة الإدارة ليظهر هنا
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentProduct = featuredProducts[currentIndex];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            {t('product.featuredBadge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'en' && currentProduct.name_en ? currentProduct.name_en : currentProduct.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' && currentProduct.description_en ? currentProduct.description_en : currentProduct.description}
          </p>
        </div>

        {/* Product Card */}
        <Card className="max-w-6xl mx-auto bg-background shadow-soft border-0 overflow-hidden relative">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative bg-gradient-accent p-8 lg:p-12 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={currentProduct.image_url || productImage}
                    alt={language === 'en' && currentProduct.name_en ? currentProduct.name_en : currentProduct.name}
                    className="w-full max-w-md h-auto object-contain rounded-lg transition-all duration-500"
                  />
                  {/* Rating Badge */}
                  <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-2 rounded-full flex items-center space-x-1 rtl:space-x-reverse shadow-medium">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">4.9</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {language === 'en' && currentProduct.name_en ? currentProduct.name_en : currentProduct.name}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {language === 'en' && currentProduct.description_en ? currentProduct.description_en : currentProduct.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                          <div className="text-primary">
                            {feature.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline space-x-2 rtl:space-x-reverse mb-2">
                      <span className="text-3xl font-bold text-primary">{currentProduct.price}</span>
                      <span className="text-lg text-muted-foreground">ريال</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={buildWhatsAppUrl(currentProduct)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-[#25D366] hover:opacity-90 text-white">
                        {t('product.orderNow')}
                      </Button>
                    </a>
                    <Link to={`/products/${currentProduct.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        {t('product.moreDetails')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        {featuredProducts.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              className="rounded-full w-10 h-10 p-0 hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Play/Pause Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoPlay}
              className="rounded-full w-10 h-10 p-0 hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              className="rounded-full w-10 h-10 p-0 hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Dots Indicator */}
        {featuredProducts.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Product Counter */}
        {featuredProducts.length > 1 && (
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} من {featuredProducts.length}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;