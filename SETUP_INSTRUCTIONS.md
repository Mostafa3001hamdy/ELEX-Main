# تعليمات إعداد المشاريع

## المشكلة: "Bucket not found"

هذا الخطأ يعني أن Supabase Storage غير مُعدّ. اتبع هذه الخطوات:

### الخطوة 1: إعداد Storage في Supabase

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **SQL Editor** (في القائمة الجانبية)
4. انسخ والصق الكود التالي:

```sql
-- إنشاء bucket للملفات
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', true);

-- إعداد سياسات بسيطة
CREATE POLICY "Allow all operations" ON storage.objects
FOR ALL USING (bucket_id = 'project-files');

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
```

5. اضغط **Run** لتنفيذ الكود

### الخطوة 2: التحقق من الإعداد

1. اذهب إلى **Storage** في القائمة الجانبية
2. يجب أن ترى bucket باسم `project-files`
3. اذهب إلى **Table Editor**
4. يجب أن ترى جدول `projects`

### الخطوة 3: اختبار النظام

1. اذهب إلى لوحة الإدارة
2. جرب إنشاء مشروع جديد
3. يجب أن يعمل الآن بدون أخطاء

## إذا استمر الخطأ:

### الحل البديل: إنشاء المشاريع بدون صور

يمكنك إنشاء المشاريع بدون صور مؤقتاً:
1. لا ترفع أي صورة عند إنشاء المشروع
2. سيتم إنشاء المشروع بنجاح
3. يمكنك إضافة الصور لاحقاً بعد إعداد Storage

### التحقق من الأخطاء:

1. افتح **Developer Tools** (اضغط F12)
2. اذهب لتبويب **Console**
3. ستجد رسائل مفصلة عن الأخطاء

## نصائح:

- تأكد من أنك في المشروع الصحيح في Supabase
- تأكد من أن لديك صلاحيات إدارية
- إذا لم تنجح، جرب حذف وإعادة إنشاء bucket











