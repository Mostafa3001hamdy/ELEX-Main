import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Zap, Shield, Award, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import productImage from "@/assets/product-lighting.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface FeaturedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  featured: boolean;
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
  useScrollReveal([featuredProducts.length, isLoading]);
  
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (isAutoPlaying && featuredProducts.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
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
      : `أرغب في طلب المنتج: ${nameText} بسعر ${product.price} ${currency}. الرابط: ${window.location.origin}`;
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
      <section className="py-16 bg-accent/30" data-animate="fade-up">
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
    return null;
  }

  const currentProduct = featuredProducts[currentIndex];

  return (
    <section className="py-16 bg-accent/30" data-animate="fade-up">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-animate="fade-up">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium" data-animate="fade-up" data-delay="80">
            {t('product.featuredBadge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-animate="fade-up" data-delay="140">
            {language === 'en' && currentProduct.name_en ? currentProduct.name_en : currentProduct.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-animate="fade-up" data-delay="200">
            {language === 'en' && currentProduct.description_en ? currentProduct.description_en : currentProduct.description}
          </p>
        </div>

        <Card 
          className="max-w-6xl mx-auto bg-background shadow-soft border-0 overflow-hidden relative"
          data-animate="scale-up"
          data-delay="160"
        >
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div
                className="relative bg-gradient-accent p-8 lg:p-12 flex items-center justify-center"
                data-animate="fade-right"
                data-delay="140"
              >
                <div className="relative">
                  <img
                    src={currentProduct.image_url || productImage}
                    alt={language === 'en' && currentProduct.name_en ? currentProduct.name_en : currentProduct.name}
                    className="w-full max-w-md h-auto object-contain rounded-lg transition-all duration-500"
                  />
                  <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-2 rounded-full flex items-center space-x-1 rtl:space-x-reverse shadow-medium">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">4.9</span>
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-6" data-animate="fade-up">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {language === 'en' && currentProduct.name_en ? currentProduct.name_en : currentProduct.name}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {language === 'en' && currentProduct.description_en ? currentProduct.description_en : currentProduct.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-3 rtl:space-x-reverse"
                        data-animate="fade-up"
                        data-delay={200 + index * 80}
                      >
                        <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                          <div className="text-primary">
                            {feature.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">{feature.title}</h4>
                          <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3" data-animate="scale-up" data-delay="240">
                    <Button asChild>
                      <Link to={`/products/${currentProduct.id}`}>التفاصيل</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="bg-black text-white hover:bg-black/85 border border-black"
                    >
                      <a href={buildWhatsAppUrl(currentProduct)} target="_blank" rel="noopener noreferrer">
                        {t('product.orderNow')}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-8" data-animate="fade-up" data-delay="200">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={goToPrevious}>
              <ChevronRight className="h-5 w-5 rtl:rotate-180" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleAutoPlay}>
              {isAutoPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <div className="flex gap-2">
              {featuredProducts.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 w-2 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-4' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
