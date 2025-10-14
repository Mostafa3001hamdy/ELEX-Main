-- إضافة حقل featured للمنتجات
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- إضافة فهرس على featured للبحث السريع
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- تحديث المنتجات الموجودة لتكون غير مميزة افتراضياً
UPDATE products SET featured = FALSE WHERE featured IS NULL;

