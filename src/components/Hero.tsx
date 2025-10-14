import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Zap, Settings, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-energy.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t, isRTL } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const features = [
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: t('hero.lightingSolutions'),
      description: t('hero.lightingDesc'),
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t('hero.energySolutions'),
      description: t('hero.energyDesc'),
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: t('hero.technicalServices'),
      description: t('hero.technicalDesc'),
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="ELEX Energy Solutions"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            {t('hero.title')}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {t('hero.subtitle')}
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 ${isRTL ? 'rtl:space-x-reverse' : ''}`}>
            <Button 
              onClick={() => scrollToSection('services')}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 rounded-md bg-white text-primary hover:bg-white/90 shadow-strong transition-smooth px-8 py-4 text-lg font-medium"
            >
              {t('hero.exploreServices')}
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 rounded-md bg-white text-primary hover:bg-white/90 shadow-strong transition-smooth px-8 py-4 text-lg font-medium"
            >
              {t('hero.contactUs')}
            </Button>
          </div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-smooth">
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </div>
    </section>
  );
};

export default Hero;