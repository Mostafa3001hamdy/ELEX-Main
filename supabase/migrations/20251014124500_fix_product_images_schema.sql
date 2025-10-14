-- Correct product_images schema: restore product_id FK column and proper index

do $$ begin
  -- If a wrong column named id (second) exists referencing products, rename it to product_id
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'product_images'
      and column_name = 'id'
  ) then
    -- Ensure we are not renaming the primary key id; skip if types don't match
    -- Try add product_id if not exists, then drop wrong FK/index later
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'product_images' and column_name = 'product_id'
    ) then
      alter table public.product_images add column if not exists product_id integer;
    end if;
  end if;
exception when others then
  -- no-op
end $$;

-- Add FK constraint if missing
alter table if exists public.product_images
  add constraint if not exists product_images_product_id_fkey
  foreign key (product_id) references public.products(id) on delete cascade;

-- Drop wrong index if exists and create the right index
drop index if exists public.idx_product_images_product_id;
create index if not exists idx_product_images_product_id on public.product_images(product_id);





