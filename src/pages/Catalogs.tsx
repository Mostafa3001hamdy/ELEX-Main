import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface CatalogRow {
  id: string;
  title: string;
  description: string | null;
  pdf_file_path: string;
  pdf_file_url: string;
  pdf_file_size: number | null;
  image_file_path: string | null;
  image_file_url: string | null;
  created_at: string;
}

interface CatalogView extends CatalogRow {
  pdf_signed_url: string;
  image_signed_url: string | null;
}

const PDF_BUCKET = "catalogs-pdf";
const IMAGE_BUCKET = "catalogs-images";

const CatalogsPage = () => {
  const [catalogs, setCatalogs] = useState<CatalogView[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCatalogs();
  }, []);

  const signUrl = async (bucket: string, path: string | null) => {
    if (!path) return null;
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
    if (error) return null;
    return data?.signedUrl || null;
  };

  const loadCatalogs = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("catalogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const withSigned = await Promise.all(
      (data || []).map(async (item) => {
        const pdf_signed_url = (await signUrl(PDF_BUCKET, item.pdf_file_path)) || item.pdf_file_url;
        const image_signed_url = (await signUrl(IMAGE_BUCKET, item.image_file_path)) || item.image_file_url;
        return { ...item, pdf_signed_url: pdf_signed_url || item.pdf_file_url, image_signed_url: image_signed_url || null } as CatalogView;
      })
    );

    setCatalogs(withSigned);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return catalogs;
    const q = search.toLowerCase();
    return catalogs.filter((c) => c.title.toLowerCase().includes(q));
  }, [catalogs, search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 py-12">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">كتالوجات المنتجات والخدمات</h1>
            <p className="text-muted-foreground">تصفح أحدث الكتالوجات بصيغة PDF مع إمكانية البحث والتحميل.</p>
          </div>
          <Input
            placeholder="ابحث عن كتالوج بالعنوان"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              رجوع للرئيسية
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> جار التحميل...</div>
        ) : error ? (
          <div className="text-red-600 text-sm">تعذر تحميل الكتالوجات: {error}</div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">لا توجد كتالوجات حالياً.</CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((catalog) => (
              <Card key={catalog.id} className="overflow-hidden shadow-sm">
                <div className="h-48 bg-muted">
                  {catalog.image_signed_url ? (
                    <img src={catalog.image_signed_url} alt={catalog.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-muted-foreground">
                      لا توجد صورة
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{catalog.title}</CardTitle>
                  {catalog.description && <CardDescription>{catalog.description}</CardDescription>}
                  <p className="text-xs text-muted-foreground">أضيف في: {new Date(catalog.created_at).toLocaleDateString("ar-SA")}</p>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <a href={catalog.pdf_signed_url} target="_blank" rel="noreferrer" className="flex-1">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 ml-2" /> عرض / تحميل PDF
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogsPage;
