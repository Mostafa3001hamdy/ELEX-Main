import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Service {
  id: number;
  category: string;
  sub_category: string;
  description: string;
  detailed_description: string;
  slug: string;
  image_url: string;
  // Optional English fields
  category_en?: string;
  sub_category_en?: string;
  description_en?: string;
  detailed_description_en?: string;
}

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, [slug]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from("service")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        navigate("/404");
        return;
      }

      setService(data);
    } catch (error) {
      console.error("Error fetching service:", error);
      navigate("/404");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('service.loading')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">{t('service.notFound')}</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              {t('service.backHome')}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Button
                onClick={() => navigate("/#services")}
                variant="ghost"
                className="mb-6 text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                {t('service.backToServices')}
              </Button>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                { service.category_en && (document?.documentElement?.lang === 'en') ? service.category_en : service.category }
              </h1>
              
              {(service.description || service.description_en) && (
                <p className="text-xl text-muted-foreground mb-8">
                  { (document?.documentElement?.lang === 'en') && service.description_en ? service.description_en : service.description }
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Content */}
                <div>
                  <Card className="border-0 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        {t('service.detailsTitle')}
                      </h2>
                      
                      {(service.category === "التحكم الذكي") ? (
                        <div className="prose prose-lg max-w-none">
                          { (document?.documentElement?.lang === 'en') ? (
                            <p className="text-muted-foreground leading-relaxed">
                              We specialize in designing and installing KNX smart control systems for lighting, HVAC, and blinds. These systems deliver exceptional comfort and up to 30% energy savings, with centralized control via a single mobile or tablet app. We also provide tailored programming to meet each client’s needs for maximum efficiency and seamless operation.
                            </p>
                          ) : (
                            <p className="text-muted-foreground leading-relaxed">
                              نتخصص في تصميم وتركيب أنظمة KNX للتحكم الذكي في الإضاءة، التكييف، والستائر. هذه الأنظمة توفر راحة استثنائية وتوفيرًا في استهلاك الطاقة يصل إلى 30% مع إمكانية التحكم المركزي من تطبيق واحد على الهاتف أو الأجهزة اللوحية. كما نقدم برمجة مخصصة بحسب احتياجات كل عميل لضمان أعلى كفاءة وتشغيل سلس.
                            </p>
                          )}
                          <div className="mt-6 space-y-4">
                            <div>
                              <h4 className="text-base font-semibold text-foreground mb-1">KNX</h4>
                              { (document?.documentElement?.lang === 'en') ? (
                                <p className="text-muted-foreground leading-relaxed">
                                  A global open standard for building control that connects lighting, HVAC, blinds, and sensors on a unified, scalable network with third‑party integrations.
                                </p>
                              ) : (
                                <p className="text-muted-foreground leading-relaxed">
                                  معيار عالمي مفتوح للتحكم في المباني يتيح ربط الإضاءة، التكييف، الستائر وأجهزة الاستشعار ضمن شبكة موحدة قابلة للتوسع والتكامل مع مزودي الطرف الثالث.
                                </p>
                              )}
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-foreground mb-1">DALI</h4>
                              { (document?.documentElement?.lang === 'en') ? (
                                <p className="text-muted-foreground leading-relaxed">
                                  A dedicated lighting-control protocol enabling smooth dimming, smart scenes, and fixture status monitoring to enhance experience and reduce energy consumption.
                                </p>
                              ) : (
                                <p className="text-muted-foreground leading-relaxed">
                                  بروتوكول مخصص للتحكم الدقيق في الإضاءة يوفر تعتيمًا سلسًا، مشاهد إضاءة ذكية، ومراقبة حالات وحدات الإنارة بهدف تحسين التجربة وتقليل استهلاك الطاقة.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : service.detailed_description ? (
                        <div className="prose prose-lg max-w-none">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            { (document?.documentElement?.lang === 'en') && service.detailed_description_en ? service.detailed_description_en : service.detailed_description }
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {t('service.noDetails')}
                        </p>
                      )}

                      {service.sub_category && (
                        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                          <h3 className="font-semibold text-foreground mb-2">
                            {t('service.specialization')}:
                          </h3>
                          <p className="text-muted-foreground">
                            { (t && (document?.documentElement?.lang === 'en')) && service.sub_category_en ? service.sub_category_en : service.sub_category }
                          </p>
                        </div>
                      )}

                      {service.category === "التحكم الذكي" && (
                        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="inline-flex items-center font-medium">
                              BMS
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full ml-2 rtl:ml-0 rtl:mr-2"></span>
                            </span>
                            <span className="inline-flex items-center font-medium">
                              DALI
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full ml-2 rtl:ml-0 rtl:mr-2"></span>
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Image & CTA */}
                <div className="space-y-6">
                  {service.image_url && (
                    <div className="rounded-lg overflow-hidden shadow-medium">
                      <img
                        src={service.image_url}
                        alt={service.category}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  {/* Contact CTA */}
                  <Card className="border-0 bg-primary/5 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-xl font-bold text-foreground mb-4">
                        {t('service.needThis')}
                      </h3>
                      <p className="text-muted-foreground mb-6">{t('service.ctaSubtitle')}</p>
                      
                      <div className="space-y-3">
                        <a
                          href="tel:+966552298400"
                          className="w-full inline-block"
                        >
                          <Button className="w-full" size="lg">
                            <Phone className="mr-2 h-4 w-4" />
                            <span>{t('service.callNow')}:</span>
                            <span dir="ltr" className="inline-block ml-2 ltr:text-left rtl:text-left">+966 55 229 8400</span>
                          </Button>
                        </a>

                        <a
                          href={`https://wa.me/966570135200?text=${encodeURIComponent(((document?.documentElement?.lang === 'en') ? `Hello, I would like to inquire about the service: ${(service.category_en || service.category)}${(service.sub_category_en || service.sub_category) ? ` - ${(service.sub_category_en || service.sub_category)}` : ''}. Link: ${window.location.origin}/services/${service.slug}` : `مرحبا، أريد الاستفسار عن خدمة: ${(service.category)}${(service.sub_category) ? ` - ${(service.sub_category)}` : ''}. الرابط: ${window.location.origin}/services/${service.slug}`))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-block"
                        >
                          <Button className="w-full bg-black text-white hover:bg-black/85 border border-black" size="lg">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {t('service.whatsapp')}
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
