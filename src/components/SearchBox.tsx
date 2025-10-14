import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  featured: boolean;
}

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  onProductSelect?: (product: Product) => void;
}

const SearchBox = ({ 
  placeholder = "البحث...", 
  className = "", 
  onSearch,
  onProductSelect 
}: SearchBoxProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch product suggestions
  const fetchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${query}%`)
        .limit(5);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
    setShowSuggestions(false);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (product: Product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    if (onProductSelect) {
      onProductSelect(product);
    } else {
      // Navigate to product details or products page
      window.location.href = `/products?search=${encodeURIComponent(product.name)}`;
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`} style={{ maxWidth: 180 }}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            className="pl-3 pr-16 py-1.5 w-full text-sm rounded-md border-border/40 focus:border-primary transition-colors"
          />
          
          {/* Clear button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-9 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          
          {/* Search button */}
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 bg-primary hover:bg-primary/90"
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border/40 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">جاري البحث...</p>
            </div>
          ) : (
            <>
              {suggestions.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className={`w-full text-right p-4 hover:bg-accent transition-colors border-b border-border/20 last:border-b-0 ${
                    index === selectedIndex ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 text-right">
                      <h4 className="font-semibold text-foreground text-sm mb-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                      <p className="text-xs text-primary font-medium mt-1">
                        {product.price} ريال
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              
              {suggestions.length === 5 && (
                <div className="p-3 text-center border-t border-border/20">
                  <button
                    onClick={() => {
                      setShowSuggestions(false);
                      handleSearch(new Event('submit') as any);
                    }}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    عرض جميع النتائج
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
