-- Create a public bucket for article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read article images (public bucket)
CREATE POLICY "public_read_articles_bucket" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'articles');

-- Allow authenticated users to upload article images
CREATE POLICY "auth_upload_articles_bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'articles');

-- Allow authenticated users to update article images
CREATE POLICY "auth_update_articles_bucket" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'articles')
  WITH CHECK (bucket_id = 'articles');

-- Allow authenticated users to delete article images
CREATE POLICY "auth_delete_articles_bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'articles');
