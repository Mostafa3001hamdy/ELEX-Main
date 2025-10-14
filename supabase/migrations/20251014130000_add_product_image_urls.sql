-- Add image_urls array column to products to store multiple image URLs
alter table if exists public.products
  add column if not exists image_urls text[] default '{}'::text[];





