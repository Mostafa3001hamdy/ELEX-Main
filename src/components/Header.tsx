import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import LanguageToggle from "@/components/LanguageToggle";
import SearchBox from "@/components/SearchBox";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/209106cd-92a5-4ec7-a072-5e3cb94ca951.png" 
              alt="ELEX - مؤسسة عبدالله جمال عبدالرحمن الزامل للتجارة" 
              className="h-16 md:h-20 w-auto"
            />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-[200px] mx-1">
            <SearchBox
              placeholder={t('header.search')}
              className="w-full"
            />
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className={`flex items-center space-x-6 ${isRTL ? 'rtl:space-x-reverse' : ''}`}>
              <NavigationMenuItem>
                <a
                  href="/#contact"
                  className="text-foreground hover:text-primary transition-smooth font-medium px-1"
                >
                  {t('header.contact')}
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                  href="/projects"
                  className="text-foreground hover:text-primary transition-smooth font-medium px-1"
                >
                  {t('header.projects')}
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                  href="/#about"
                  className="text-foreground hover:text-primary transition-smooth font-medium px-1"
                >
                  {t('header.about')}
                </a>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <a
                  href="/products"
                  className="text-foreground hover:text-primary transition-smooth font-medium px-1"
                >
                  {t('header.products')}
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                  href="/#services"
                  className="text-foreground hover:text-primary transition-smooth font-medium px-1"
                >
                  {t('header.services')}
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                  href="/"
                  className="text-foreground hover:text-primary transition-smooth font-medium px-1"
                >
                  {t('header.home')}
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button & Mobile Menu */}
          <div className={`flex items-center space-x-3 ${isRTL ? 'rtl:space-x-reverse' : ''}`}>
            <LanguageToggle />
            <Button 
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex text-muted-foreground hover:text-primary transition-smooth"
              onClick={() => window.location.href = '/admin/login'}
            >
              تسجيل دخول
            </Button>
            <a
              href={`https://wa.me/966570135200?text=${encodeURIComponent(`مرحبا، أريد استشارة بشأن ما أشاهده الآن: ${window.location.origin}${window.location.pathname}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="hidden lg:inline-flex bg-primary text-primary-foreground hover:bg-primary-hover shadow-medium transition-smooth px-4 py-1.5 text-xs font-medium rounded-md">
                {t('header.consultShort')}
              </Button>
            </a>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border/40">
              <a
                href="/#contact"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-smooth"
              >
                {t('header.contact')}
              </a>
              
              <a
                href="/projects"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-smooth"
              >
                {t('header.projects')}
              </a>

              <a
                href="/#about"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-smooth"
              >
                {t('header.about')}
              </a>

              <a
                href="/products"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-smooth"
              >
                {t('header.products')}
              </a>
              
              <a
                href="/#services"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-smooth"
              >
                {t('header.services')}
              </a>

              <a
                href="/"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-smooth"
              >
                {t('header.home')}
              </a>
              
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <SearchBox
                  placeholder={t('header.search')}
                  className="w-full"
                />
              </div>
              
              <a
                href="/admin/login"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-smooth"
              >
                تسجيل دخول
              </a>
              
              <div className="pt-4">
                <a
                  href={`https://wa.me/966570135200?text=${encodeURIComponent(`مرحبا، أريد استشارة بشأن ما أشاهده الآن: ${window.location.origin}${window.location.pathname}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-gradient-primary hover:bg-primary-hover shadow-medium transition-smooth py-2 text-sm rounded-md">
                    {t('header.consultShort')}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;