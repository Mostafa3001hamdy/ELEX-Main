import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Users, 
  Target, 
  Lightbulb,
  CheckCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  
  const stats = [
    { icon: <Award className="h-6 w-6" />, number: "10+", label: t('about.yearsExperience') },
    { icon: <Users className="h-6 w-6" />, number: "500+", label: t('about.satisfiedClients') },
    { icon: <Target className="h-6 w-6" />, number: "1000+", label: t('about.completedProjects') },
    { icon: <Lightbulb className="h-6 w-6" />, number: "50+", label: t('about.innovativeSolutions') }
  ];

  const values = [
    {
      title: t('about.qualityExcellence'),
      description: t('about.qualityDesc')
    },
    {
      title: t('about.technicalInnovation'),
      description: t('about.innovationDesc')
    },
    {
      title: t('about.customerSatisfaction'),
      description: t('about.satisfactionDesc')
    },
    {
      title: t('about.environmentalSustainability'),
      description: t('about.sustainabilityDesc')
    }
  ];

  return (
    <section id="about" className="section-logo-bg py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            {t('about.aboutBadge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t('about.leadersTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('about.companyDescription')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group hover:scale-105 transition-smooth duration-300"
            >
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-smooth">
                <div className="text-primary">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <Card className="bg-gradient-accent border-0 shadow-soft">
            <CardContent className="p-8">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t('about.ourVision')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.visionDescription')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-accent border-0 shadow-soft">
            <CardContent className="p-8">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t('about.ourMission')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.missionDescription')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t('about.coreValues')}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('about.valuesDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-4 rtl:space-x-reverse p-6 rounded-lg hover:bg-accent/50 transition-smooth"
            >
              <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;