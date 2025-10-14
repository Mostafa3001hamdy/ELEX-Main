-- إعداد بسيط لقاعدة البيانات
-- انسخ هذا الكود والصقه في Supabase SQL Editor

-- إنشاء جدول المشاريع
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    client_name TEXT NOT NULL,
    completion_date DATE,
    project_type TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج بيانات تجريبية
INSERT INTO projects (title, description, location, client_name, completion_date, project_type, image_url) VALUES
('مشروع الإضاءة الذكية', 'تطبيق نظام إضاءة ذكي متطور', 'الرياض، المملكة العربية السعودية', 'مجمع الرياض التجاري', '2024-01-15', 'إضاءة', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'),
('محطة الطاقة الشمسية', 'تركيب محطة طاقة شمسية بقدرة 5 ميجاوات', 'الدمام، المملكة العربية السعودية', 'شركة الألمنيوم السعودية', '2023-11-20', 'طاقة شمسية', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800'),
('البنية التحتية الكهربائية', 'تصميم وتنفيذ البنية التحتية الكهربائية الكاملة', 'الخبر، المملكة العربية السعودية', 'شركة المستقبل للتنمية', '2023-09-10', 'كهربائية', 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800')
ON CONFLICT DO NOTHING;

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- دالة تحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق الدالة على جدول المشاريع
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();











