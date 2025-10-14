-- إعداد Storage بسيط جداً
-- انسخ هذا الكود كاملاً والصقه في Supabase SQL Editor

-- 1. إنشاء bucket للملفات
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', true);

-- 2. إعداد سياسات بسيطة جداً
CREATE POLICY "Allow all operations" ON storage.objects
FOR ALL USING (bucket_id = 'project-files');

-- 3. التحقق من أن جدول المشاريع موجود
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

-- 4. إدراج بيانات تجريبية
INSERT INTO projects (title, description, location, client_name, completion_date, project_type) VALUES
('مشروع تجريبي', 'وصف المشروع التجريبي', 'الرياض', 'عميل تجريبي', '2024-01-01', 'كهربائية')
ON CONFLICT DO NOTHING;











