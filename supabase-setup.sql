-- ============================================================
-- À coller dans Supabase > SQL Editor > New query > Run
-- Crée le bucket de stockage, la table des photos, et les
-- autorisations pour que les invités (non connectés) puissent
-- déposer et voir les photos.
-- ============================================================

-- 1. Bucket de stockage pour les fichiers images
insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do nothing;

-- 2. Autoriser tout le monde à lire les fichiers du bucket
create policy "Public read access on wedding photos"
on storage.objects for select
to public
using (bucket_id = 'wedding-photos');

-- 3. Autoriser tout le monde à déposer des fichiers dans le bucket
create policy "Public upload access on wedding photos"
on storage.objects for insert
to public
with check (bucket_id = 'wedding-photos');

-- 4. Table qui garde le prénom / message / date pour chaque photo
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  file_path text not null,
  name text,
  message text,
  created_at timestamptz not null default now()
);

alter table photos enable row level security;

-- 5. Tout le monde peut lire la liste des photos
create policy "Public read photos"
on photos for select
to public
using (true);

-- 6. Tout le monde peut ajouter une ligne (déposer une photo)
create policy "Public insert photos"
on photos for insert
to public
with check (true);
