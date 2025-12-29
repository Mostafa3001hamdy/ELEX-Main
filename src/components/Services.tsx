import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Zap, 
  Home, 
  Wind,
  ArrowLeft
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ServiceItem {
  id: number;
  category: string;
  sub_category: string;
  description: string;
  detailed_description: string;
  slug: string;
  image_url: string;
  // Optional English fields if available in DB
  category_en?: string;
  sub_category_en?: string;
  description_en?: string;
  detailed_description_en?: string;
}

const Services = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useScrollReveal([services.length, isLoading]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("service")
        .select("*")
        .not("slug", "is", null)
        .order("id");

      if (error) throw error;
      
      // Custom ordering: move "تصميم الإضاءة" to second row (position 4)
      const orderedServices = (data || []).sort((a, b) => {
        const getOrder = (category: string) => {
          switch (category) {
            case "الأعمال الكهربائية": return 1;
            case "التحكم الذكي": return 2;
            case "أنظمة التكييف": return 3;
            case "تصميم الإضاءة": return 4;
            default: return 5;
          }
        };
        return getOrder(a.category) - getOrder(b.category);
      });
      
      setServices(orderedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case "أنظمة التكييف":
        return <Palette className="h-8 w-8" />;
      case "الأعمال الكهربائية":
        return <Zap className="h-8 w-8" />;
      case "التحكم الذكي":
        return <Home className="h-8 w-8" />;
      case "تصميم الإضاءة":
        return <Wind className="h-8 w-8" />;
      default:
        return <Zap className="h-8 w-8" />;
    }
  };

  const buildWhatsAppUrl = (service: ServiceItem) => {
    const base = "https://wa.me/966570135200";
    const categoryText = language === 'en' && service.category_en ? service.category_en : service.category;
    const subcategoryText = language === 'en' && service.sub_category_en ? service.sub_category_en : service.sub_category;
    const message = language === 'en'
      ? `Hello, I would like to inquire about the service: ${categoryText}${subcategoryText ? ` - ${subcategoryText}` : ''}. Link: ${window.location.origin}/services/${service.slug}`
      : `مرحبا، أريد الاستفسار عن خدمة: ${categoryText}${subcategoryText ? ` - ${subcategoryText}` : ''}. الرابط: ${window.location.origin}/services/${service.slug}`;
    return `${base}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="services" className="section-logo-bg py-20 bg-gradient-accent scroll-mt-40" data-animate="fade-up">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16" data-animate="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('services.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="text-center py-12" data-animate="fade-up">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('services.loading')}</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className="group hover:shadow-medium transition-smooth duration-300 border-0 bg-card/50 backdrop-blur-sm hover:-translate-y-2"
                data-animate="fade-up"
                data-delay={index * 100}
              >
                <CardContent className="p-8">
                  {/* Icon */}
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-smooth">
                    <div className="text-primary group-hover:scale-110 transition-smooth">
                      {getServiceIcon(service.category)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-smooth">
                    {language === 'en' ? (
                      service.category === "الأعمال الكهربائية" ? "Electrical Works" :
                      service.category === "التحكم الذكي" ? "Smart Control" :
                      service.category === "أنظمة التكييف" ? "HVAC Systems" :
                      service.category === "تصميم الإضاءة" ? "Lighting Design" :
                      // Handle specific lighting design titles
                      service.category === "تصميم الإضاءة الداخلية" ? "Interior Lighting Design" :
                      service.category === "تصميم الإضاءة الخارجية" ? "Exterior Lighting Design" :
                      service.category === "تصميم الإضاءة الديكورية" ? "Decorative Lighting Design" :
                      service.category_en || service.category
                    ) : service.category}
                  </h3>

                  {/* Description (override AC text with localization) */}
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {language === 'en' ? (
                      service.category === "الأعمال الكهربائية" ? "Professional electrical installation, maintenance, and repair services for residential and commercial projects." :
                      service.category === "التحكم الذكي" ? "Advanced smart control systems for lighting, HVAC, and building automation with KNX, DALI, and BMS integration." :
                      service.category === "أنظمة التكييف" ? "High-efficiency design, installation, and maintenance of HVAC and ventilation systems." :
                      service.category === "تصميم الإضاءة" ? "Professional lighting design using DIALux software for optimal illumination and energy efficiency." :
                      // Handle specific lighting design descriptions
                      service.description === "تصميم إضاءة داخلية عصرية تحقق الراحة البصرية وتضيف لمسة جمالية تعكس هوية المكان." ? "Modern interior lighting design that achieves visual comfort and adds an aesthetic touch reflecting the space's identity." :
                      service.description === "تصميم وتنفيذ حلول الإضاءة الخارجية للحدائق والواجهات والمسارات لإبراز جمال المبنى وتوفير الأمان" ? "Design and implementation of exterior lighting solutions for gardens, facades, and pathways to highlight building beauty and provide security" :
                      service.description === "تصميم حلول إضاءة ديكورية مبتكرة لإضافة لمسة فنية وجمالية للمساحات الداخلية والخارجية" ? "Design of innovative decorative lighting solutions to add artistic and aesthetic touches to indoor and outdoor spaces" :
                      service.description_en || service.description || ''
                    ) : (
                      service.category === "أنظمة التكييف" ? t('services.airConditioningDesc') : (service.description || '')
                    )}
                  </p>

                  {/* Sub Category (hide standalone KNX for Smart Control) */}
                  {service.sub_category && !(service.category === "التحكم الذكي" && service.sub_category.trim().toUpperCase() === "KNX") && (
                    <div className="mb-6">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 rtl:ml-3 rtl:mr-0"></div>
                        {language === 'en' ? (
                          service.sub_category === "تصميم الإضاءة الداخلية" ? "Interior Lighting Design" :
                          service.sub_category === "تصميم الإضاءة الخارجية" ? "Exterior Lighting Design" :
                          service.sub_category === "تصميم الإضاءة الديكورية" ? "Decorative Lighting Design" :
                          service.sub_category === "تصميم إضاءة داخلية عصرية تحقق الراحة البصرية وتضيف لمسة جمالية تعكس هوية المكان." ? "Modern interior lighting design that achieves visual comfort and adds an aesthetic touch reflecting the space's identity." :
                          service.sub_category === "تصميم وتنفيذ حلول الإضاءة الخارجية للحدائق والواجهات والمسارات لإبراز جمال المبنى وتوفير الأمان" ? "Design and implementation of exterior lighting solutions for gardens, facades, and pathways to highlight building beauty and provide security" :
                          service.sub_category === "تصميم حلول إضاءة ديكورية مبتكرة لإضافة لمسة فنية وجمالية للمساحات الداخلية والخارجية" ? "Design of innovative decorative lighting solutions to add artistic and aesthetic touches to indoor and outdoor spaces" :
                          service.sub_category === "تصميم إضاءة المنازل والفلل و المطاعم والمقاهي و الفنادق والمنتجعات و المتاجر وصالات العرض" ? "Lighting design for homes, villas, restaurants, cafes, hotels, resorts, shops, and showrooms" :
                          service.sub_category === "إضاءة المناظر الطبيعية والواجهات" ? "Landscape and facade lighting" :
                          service.sub_category === "الإضاءة الفنية والجمالية" ? "Artistic and aesthetic lighting" :
                          service.sub_category_en || service.sub_category
                        ) : service.sub_category}
                      </div>
                    </div>
                  )}

                  {/* Smart Control Systems details: show DALI & BMS inside */}
                  {service.category === "التحكم الذكي" && (
                    <div className="mb-6">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="inline-flex items-center font-medium">
                          KNX
                          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full ml-2 rtl:ml-0 rtl:mr-2"></span>
                        </span>
                        <span className="inline-flex items-center font-medium">
                          DALI
                          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full ml-2 rtl:ml-0 rtl:mr-2"></span>
                        </span>
                        <span className="inline-flex items-center font-medium">
                          BMS
                          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full ml-2 rtl:ml-0 rtl:mr-2"></span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-animate="scale-up" data-delay="140">
                    <Link to={`/services/${service.slug}`}>
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth"
                      >
                        {t('services.learnMore')}
                        <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-smooth" />
                      </Button>
                    </Link>
                    <a
                      href={buildWhatsAppUrl(service)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-black text-white hover:bg-black/85 border border-black transition-smooth">
                        {t('services.whatsapp')}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t('services.none')}</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default Services;
