-- Add technical specification PDF URL to products
alter table public.products
add column if not exists spec_pdf_url text null;


