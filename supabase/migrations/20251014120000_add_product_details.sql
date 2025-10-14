-- Add product details columns to products table
-- Safe to run multiple times with IF NOT EXISTS guards

alter table if exists public.products
  add column if not exists watt integer,
  add column if not exists cri integer,
  add column if not exists beam_angle integer,
  add column if not exists voltage_range text,
  add column if not exists ip_rating text,
  add column if not exists total_lumen integer,
  add column if not exists warranty_years integer,
  add column if not exists base_type text,
  add column if not exists material text,
  add column if not exists usage_areas text;

comment on column public.products.watt is 'Power in watts';
comment on column public.products.cri is 'Color Rendering Index (>=80 etc.)';
comment on column public.products.beam_angle is 'Beam angle in degrees';
comment on column public.products.voltage_range is 'Voltage range e.g. 220V-240V';
comment on column public.products.ip_rating is 'Ingress Protection rating';
comment on column public.products.total_lumen is 'Total luminous flux (lm)';
comment on column public.products.warranty_years is 'Warranty duration in years';
comment on column public.products.base_type is 'Lamp base type e.g. GU10';
comment on column public.products.material is 'Material e.g. Aluminum and Glass';
comment on column public.products.usage_areas is 'Recommended usage areas description';


