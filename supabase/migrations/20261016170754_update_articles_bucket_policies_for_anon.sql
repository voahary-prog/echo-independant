-- Drop the authenticated-only policies and replace with anon+authenticated
-- since the admin panel uses a hardcoded password, not Supabase Auth

DROP POLICY IF EXISTS "auth_upload_articles_bucket" ON storage.objects;
DROP POLICY IF EXISTS "auth_update_articles_bucket" ON storage.objects;
DROP POLICY IF EXISTS "auth_delete_articles_bucket" ON storage.objects;

-- Allow anon and authenticated to upload article images
CREATE POLICY "anon_auth_upload_articles_bucket" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'articles');

-- Allow anon and authenticated to update article images
CREATE POLICY "anon_auth_update_articles_bucket" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'articles')
  WITH CHECK (bucket_id = 'articles');

-- Allow anon and authenticated to delete article images
CREATE POLICY "anon_auth_delete_articles_bucket" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'articles');
