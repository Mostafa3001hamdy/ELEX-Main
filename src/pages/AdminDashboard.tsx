import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Package, FolderOpen, Settings, BookOpen } from "lucide-react";
import ProductManager from "@/components/admin/ProductManager";
import ProjectManager from "@/components/admin/ProjectManager";
import ServiceManager from "@/components/admin/ServiceManager";
import CatalogManager from "@/components/admin/CatalogManager";

type AdminDashboardProps = {
  defaultTab?: "products" | "projects" | "services" | "catalogs";
};

const AdminDashboard = ({ defaultTab = "products" }: AdminDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminDashboardProps["defaultTab"]>(defaultTab);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== "67177e71-c272-49c2-ac7e-bfeb68638680") {
        navigate("/admin/login");
        return;
      }
      setIsLoading(false);
    } catch (error) {
      navigate("/admin/login");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم إنهاء الجلسة.",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري التحقق من صلاحيات الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-2">إدارة المنتجات والمشاريع والخدمات والكتالوجات</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>

        <Tabs
          value={activeTab}
          defaultValue={defaultTab}
          onValueChange={(value) => setActiveTab(value as AdminDashboardProps["defaultTab"])}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              المشاريع
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              الخدمات
            </TabsTrigger>
            <TabsTrigger value="catalogs" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              الكتالوجات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  إدارة المنتجات
                </CardTitle>
                <CardDescription>
                  يمكنك إضافة وتعديل وحذف المنتجات.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  إدارة المشاريع
                </CardTitle>
                <CardDescription>
                  يمكنك إضافة وتعديل وحذف المشاريع.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  إدارة الخدمات
                </CardTitle>
                <CardDescription>
                  يمكنك إضافة وتعديل وحذف الخدمات.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="catalogs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  إدارة الكتالوجات
                </CardTitle>
                <CardDescription>
                  رفع ملفات PDF مع صورة اختيارية، مع إمكانية التعديل والحذف.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CatalogManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
