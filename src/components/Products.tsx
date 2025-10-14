import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  featured: boolean;
  // Optional English fields if available in DB
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
}

interface ProductsProps {
  searchQuery?: string;
}

const Products = ({ searchQuery = "" }: ProductsProps) => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  useEffect(() => {
    setSearchTerm(searchQuery);
    fetchProducts(searchQuery);
  }, [searchQuery]);

  const fetchProducts = async (query: string = "") => {
    setIsLoading(true);
    try {
      let queryBuilder = supabase
        .from("products")
        .select("*");

      if (query.trim()) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,name_en.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder.order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildWhatsAppUrl = (product: Product) => {
    const base = "https://wa.me/966570135200";
    const nameText = language === 'en' && product.name_en ? product.name_en : product.name;
    const currency = t('product.currency');
    const message = language === 'en'
      ? `Hello, I would like to order the product: ${nameText} for ${product.price} ${currency}. Link: ${window.location.origin}`
      : `مرحبا، أريد طلب المنتج: ${nameText} بسعر ${product.price} ${currency}. الرابط: ${window.location.origin}`;
    return `${base}?text=${encodeURIComponent(message)}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchProducts("");
  };

  // Details moved to separate page

  return (
    <section className="section-logo-bg py-20 bg-gradient-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {searchTerm ? `${t('products.searchResultsPrefix')} "${searchTerm}"` : t('products.featuredTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {searchTerm ? `${t('products.foundPrefix')} ${products.length} ${t('products.itemsSuffix')}` : t('products.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('header.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-border/40 bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-center"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('products.loading')}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-medium transition-smooth duration-300 border-0 bg-card/50 backdrop-blur-sm hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  {/* Product Image */}
                  {product.image_url && (
                    <div className="mb-6 overflow-hidden rounded-lg">
                      <img
                        src={product.image_url}
                        alt={(language === 'en' && product.name_en) ? product.name_en : product.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-smooth"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth flex-1">
                      {(language === 'en' && product.name_en) ? product.name_en : product.name}
                    </h3>
                    {product.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                        {t('products.badgeFeatured')}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {(language === 'en' && product.description_en) ? product.description_en : product.description}
                  </p>

                  {/* Read more navigates to detail page */}
                  <div className="mb-4">
                    <Link to={`/products/${product.id}`} className="w-full inline-block">
                      <Button variant="secondary" className="w-full">اعرف المزيد</Button>
                    </Link>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-bold text-primary mb-4">
                    {product.price} {t('product.currency')}
                  </div>

                  {/* CTA Button */}
                  <a
                    href={buildWhatsAppUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-block"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth"
                    >
                      {t('product.orderNow')}
                      <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-smooth" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('products.noneFound')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('products.noMatchPrefix')} "{searchTerm}"
            </p>
            <Button onClick={clearSearch} variant="outline">
              {t('products.clearSearch')}
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t('products.none')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;