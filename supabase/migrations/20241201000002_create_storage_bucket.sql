-- Migration: 20241201000002_create_storage_bucket
-- Description: Create storage bucket for blog images
-- Created: 2024-12-01

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Create storage policies for blog images
CREATE POLICY "Anyone can view blog images" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'blog-images' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own blog images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'blog-images' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can delete their own blog images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'blog-images' AND 
        auth.role() = 'authenticated'
    );
