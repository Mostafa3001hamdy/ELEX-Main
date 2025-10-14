# إعداد Supabase Storage لرفع ملفات المشاريع

## خطوات إعداد Storage:

### 1. إنشاء Bucket جديد:
```sql
-- في Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', true);
```

### 2. إعداد سياسات الأمان:
```sql
-- السماح بقراءة الملفات للجميع
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'project-files');

-- السماح بإنشاء ملفات جديدة للمصادقين
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-files' 
  AND auth.role() = 'authenticated'
);

-- السماح بتحديث الملفات للمصادقين
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'project-files' 
  AND auth.role() = 'authenticated'
);

-- السماح بحذف الملفات للمصادقين
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'project-files' 
  AND auth.role() = 'authenticated'
);
```

### 3. تشغيل الملفات:
```bash
# تشغيل migrations
supabase db push

# أو في Supabase Dashboard:
# 1. اذهب إلى SQL Editor
# 2. انسخ والصق محتوى ملف 001_create_projects_table.sql
# 3. انسخ والصق محتوى ملف 002_update_projects_table.sql
# 4. انسخ والصق محتوى سياسات Storage أعلاه
```

## ملاحظات:
- جميع الملفات ستكون عامة (public)
- الحد الأقصى لحجم الملف: 10 ميجابايت
- أنواع الملفات المدعومة: JPEG, PNG, GIF, WebP
- الملفات تُحفظ في مجلد `project-images/`








