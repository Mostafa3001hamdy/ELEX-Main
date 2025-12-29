import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Trash2, Plus, Minus, XCircle } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import LanguageToggle from "@/components/LanguageToggle";
import SearchBox from "@/components/SearchBox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/elex.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();
  const { items, itemsCount, total, addItem, decreaseItem, removeItem, clearCart, isOpen, openCart, closeCart, buildWhatsappLink } = useCart();

  return (
    <header
      className="bg-black text-white sticky top-0 z-50 w-full border-b border-black"
      data-animate="fade-up"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between" data-animate="fade-up">
          {/* Logo */}
          <div className="flex items-center" data-animate="fade-right">
            <img 
              src={logo} 
              alt="ELEX - مؤسسة عبدالله جمال عبدالرحمن الزامل للتجارة" 
              className="h-16 md:h-20 w-auto"
            />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-[200px] mx-1" data-animate="fade-up" data-delay="80">
            <SearchBox
              placeholder={t('header.search')}
              className="w-full"
            />
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex" data-animate="fade-up" data-delay="120">
            <NavigationMenuList className={`flex items-center space-x-6 ${isRTL ? 'rtl:space-x-reverse' : ''}`}>
              <NavigationMenuItem>
                <a
                  href="/#contact"
                  className="text-white hover:text-white/80 transition-smooth font-medium px-1 pr-5 rtl:pl-5"
                >
                  {t('header.contact')}
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                  href="/projects"
                  className="text-white hover:text-white/80 transition-smooth font-medium px-1 pl-5 rtl:pr-5"
                >
                  {t('header.projects')}
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                  href="/#about"
                  className="text-white hover:text-white/80 transition-smooth font-medium px-1"
                >
                  {t('header.about')}
                </a>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <a
                  href="/products"
                  className="text-white hover:text-white/80 transition-smooth font-medium px-1"
                >
                  {t('header.products')}
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                href="/catalogs"
                  className="text-white hover:text-white/80 transition-smooth font-medium px-1"
                >
                  كتالوجات
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                  href="/#services"
                  className="text-white hover:text-white/80 transition-smooth font-medium px-1"
                >
                  {t('header.services')}
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                  href="/"
                  className="text-white hover:text-white/80 transition-smooth font-medium px-1"
                >
                  {t('header.home')}
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button & Mobile Menu */}
          <div
            className={`flex items-center space-x-3 ${isRTL ? 'rtl:space-x-reverse' : ''}`}
            data-animate="fade-left"
            data-delay="160"
          >
            <LanguageToggle />
            <a
              href="/cart"
              className="relative inline-flex items-center justify-center rounded-md border border-white/40 bg-white/10 px-2 py-2 text-sm text-white hover:border-white/70 transition-smooth"
              aria-label="عربة التسوق"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </a>
            <Button 
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex text-white/80 hover:text-white transition-smooth"
              onClick={() => window.location.href = '/admin/login'}
            >
              تسجيل دخول
            </Button>
            <a
              href={`https://wa.me/966570135200?text=${encodeURIComponent(`مرحبا، أريد استشارة بشأن ما أشاهده الآن: ${window.location.origin}${window.location.pathname}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="hidden lg:inline-flex bg-black text-white hover:bg-black/85 border border-black shadow-medium transition-smooth px-4 py-1.5 text-xs font-medium rounded-md">
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-black">
              <a
                href="/#contact"
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-md transition-smooth"
              >
                {t('header.contact')}
              </a>
              
              <a
                href="/projects"
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-md transition-smooth"
              >
                {t('header.projects')}
              </a>

              <a
                href="/#about"
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-md transition-smooth"
              >
                {t('header.about')}
              </a>

              <a
                href="/products"
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-md transition-smooth"
              >
                {t('header.products')}
              </a>
              
              <a
                href="/catalogs"
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-md transition-smooth"
              >
                كتالوجات
              </a>
              
              <a
                href="/#services"
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-md transition-smooth"
              >
                {t('header.services')}
              </a>

              <a
                href="/"
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-md transition-smooth"
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
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-md transition-smooth"
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
                  <Button className="w-full bg-black text-white hover:bg-black/85 border border-black shadow-medium transition-smooth py-2 text-sm rounded-md">
                    {t('header.consultShort')}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={closeCart}></div>
          <div className="w-full max-w-md bg-background h-full shadow-strong p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> السلة
              </h2>
              <button onClick={closeCart}>
                <XCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </button>
            </div>
            {items.length === 0 ? (
              <p className="text-muted-foreground">السلة فارغة.</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border border-border/60 rounded-lg p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.price ? `${item.price} SAR` : "بدون سعر"} × {item.quantity}
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-destructive hover:opacity-80">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => decreaseItem(item.id)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-border/60 pt-4 space-y-3">
                  <div className="flex justify-between font-semibold">
                    <span>الإجمالي</span>
                    <span>{total} SAR</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      asChild 
                      className="flex-1 bg-black text-white hover:bg-black/85 border border-black"
                    >
                      <a href={buildWhatsappLink()} target="_blank" rel="noreferrer">إرسال الطلب عبر واتساب</a>
                    </Button>
                    <Button variant="outline" onClick={clearCart}>تفريغ السلة</Button>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1" variant="secondary">
                      <a href="/cart">فتح صفحة السلة</a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
