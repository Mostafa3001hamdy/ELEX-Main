-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    client_name TEXT NOT NULL,
    completion_date DATE,
    project_type TEXT NOT NULL CHECK (project_type IN ('electrical', 'lighting', 'energy', 'industrial', 'commercial', 'residential')),
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'ongoing', 'upcoming')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_completion_date ON projects(completion_date);

-- Insert sample projects data
INSERT INTO projects (title, description, location, client_name, completion_date, project_type, image_url, status) VALUES
('مشروع الإضاءة الذكية - مجمع الرياض', 
 'تطبيق نظام إضاءة ذكي متطور يستخدم تقنيات LED الحديثة مع نظام تحكم ذكي يوفر 60% من استهلاك الطاقة',
 'الرياض، المملكة العربية السعودية',
 'مجمع الرياض التجاري',
 '2024-01-15',
 'lighting',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
 'completed'),

('محطة الطاقة الشمسية - مصنع الألمنيوم', 
 'تركيب محطة طاقة شمسية بقدرة 5 ميجاوات لتوفير الطاقة النظيفة للمصنع مع تخفيض فواتير الكهرباء بنسبة 70%',
 'الدمام، المملكة العربية السعودية',
 'شركة الألمنيوم السعودية',
 '2023-11-20',
 'energy',
 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
 'completed'),

('البنية التحتية الكهربائية - مدينة المستقبل', 
 'تصميم وتنفيذ البنية التحتية الكهربائية الكاملة لمدينة سكنية جديدة تضم 5000 وحدة سكنية',
 'الخبر، المملكة العربية السعودية',
 'شركة المستقبل للتنمية',
 '2023-09-10',
 'electrical',
 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
 'completed'),

('نظام الإضاءة الصناعية - مصنع الأدوية', 
 'تركيب نظام إضاءة صناعية متطور لمصنع الأدوية مع معايير GMP العالمية',
 'جدة، المملكة العربية السعودية',
 'شركة الدواء السعودي',
 '2023-12-05',
 'industrial',
 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
 'completed'),

('التحديث الكهربائي - مركز التسوق الكبير', 
 'تحديث شامل للأنظمة الكهربائية والإضاءة في مركز تسوق كبير مع تحسينات كفاءة الطاقة',
 'مكة المكرمة، المملكة العربية السعودية',
 'مركز التسوق الكبير',
 '2024-02-28',
 'commercial',
 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
 'ongoing'),

('الإضاءة المنزلية الذكية - مجمع سكني', 
 'تطبيق نظام إضاءة ذكي للمنازل مع تطبيق للتحكم عن بُعد وتوفير الطاقة',
 'الرياض، المملكة العربية السعودية',
 'شركة السكن الحديث',
 '2024-06-30',
 'residential',
 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
 'upcoming');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

