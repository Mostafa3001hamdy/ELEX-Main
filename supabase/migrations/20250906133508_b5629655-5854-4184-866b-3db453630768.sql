-- Create storage buckets for product and project images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('projects', 'projects', true);

-- Create storage policies for product images
CREATE POLICY "Anyone can view product images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Admin can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'products' AND auth.uid() = '67177e71-c272-49c2-ac7e-bfeb68638680'::uuid);

CREATE POLICY "Admin can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'products' AND auth.uid() = '67177e71-c272-49c2-ac7e-bfeb68638680'::uuid);

CREATE POLICY "Admin can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'products' AND auth.uid() = '67177e71-c272-49c2-ac7e-bfeb68638680'::uuid);

-- Create storage policies for project images
CREATE POLICY "Anyone can view project images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'projects');

CREATE POLICY "Admin can upload project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'projects' AND auth.uid() = '67177e71-c272-49c2-ac7e-bfeb68638680'::uuid);

CREATE POLICY "Admin can update project images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'projects' AND auth.uid() = '67177e71-c272-49c2-ac7e-bfeb68638680'::uuid);

CREATE POLICY "Admin can delete project images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'projects' AND auth.uid() = '67177e71-c272-49c2-ac7e-bfeb68638680'::uuid);