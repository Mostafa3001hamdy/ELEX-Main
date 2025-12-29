import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { items, total, decreaseItem, addItem, setQuantity, removeItem, clearCart, buildWhatsappLink } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <CardTitle>السلة</CardTitle>
            </div>
            {items.length > 0 && (
              <Button variant="outline" onClick={clearCart} className="text-sm">تفريغ السلة</Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-10 space-y-4">
                <p>السلة فارغة.</p>
                <Button asChild>
                  <Link to="/products">تصفح المنتجات</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border/60 rounded-lg p-4">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price ? `${item.price} SAR` : "بدون سعر"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button size="icon" variant="outline" onClick={() => decreaseItem(item.id)} className="h-9 w-9">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={999}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.id, Number(e.target.value))}
                        className="w-20 text-center"
                      />
                      <Button size="icon" variant="outline" onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })} className="h-9 w-9">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => removeItem(item.id)} className="h-9 w-9">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>الإجمالي</span>
                    <span>{total} SAR</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      asChild 
                      className="flex-1 bg-black text-white hover:bg-black/85 border border-black"
                    >
                      <a href={buildWhatsappLink()} target="_blank" rel="noreferrer">إرسال الطلب عبر واتساب</a>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link to="/products">متابعة التسوق</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
