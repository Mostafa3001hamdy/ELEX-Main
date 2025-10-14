import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import XLogo from "@/components/ui/x-logo";
import { 
  Mail, 
  Phone, 
  MapPin,
  Instagram
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  const quickLinks = [
    { title: t('footer.home'), href: "/" },
    { title: t('footer.aboutUs'), href: "/about" },
    { title: t('footer.ourServices2'), href: "/services" },
    { title: t('footer.ourProjects'), href: "/projects" },
    { title: t('footer.contactUs2'), href: "/contact" }
  ];

  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="text-3xl font-bold mb-4">{t('footer.companyName')}</div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed max-w-md">
              {t('footer.companyDescription')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a 
                href="https://www.instagram.com/elex_ksa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full p-3 transition-smooth"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/ELEX_KSA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full p-3 transition-smooth"
              >
                <XLogo className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* WhatsApp CTA removed per request */}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.contactUs')}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Mail className="h-5 w-5 mt-1 text-primary-foreground/60" />
                <div>
                  <p className="text-primary-foreground/80">
                    sales@elex.ltd
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Phone className="h-5 w-5 mt-1 text-primary-foreground/60" />
                <div>
                  <p className="text-primary-foreground/80 direction-ltr ltr:text-left rtl:text-left" dir="ltr">
                    +966 55 229 8400
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <MapPin className="h-5 w-5 mt-1 text-primary-foreground/60" />
                <div>
                  <p className="text-primary-foreground/80">
                    {t('footer.saudiArabia')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="text-primary-foreground/80 mb-6">
              {t('footer.newsletterDesc')}
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
              />
              <Button 
                variant="secondary" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                {t('footer.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-primary-foreground/80 text-sm">
              {t('footer.allRightsReserved')}
            </div>
            
            {/* Quick links removed per request */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;