import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Products from "@/components/Products";
import Footer from "@/components/Footer";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Products searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;