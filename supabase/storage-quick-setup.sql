-- إعداد سريع لـ Supabase Storage
-- انسخ والصق هذا الكود في SQL Editor في Supabase Dashboard

-- 1. إنشاء bucket للملفات
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. إعداد سياسات الأمان (السماح للجميع بالقراءة والكتابة مؤقتاً)
CREATE POLICY IF NOT EXISTS "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'project-files');

CREATE POLICY IF NOT EXISTS "Public write access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-files');

CREATE POLICY IF NOT EXISTS "Public update access" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-files');

CREATE POLICY IF NOT EXISTS "Public delete access" ON storage.objects
FOR DELETE USING (bucket_id = 'project-files');

-- 3. التحقق من أن الجدول موجود
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











