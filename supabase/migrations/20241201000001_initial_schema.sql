-- Migration: 20241201000001_initial_schema
-- Description: Initial database schema for blog management system
-- Created: 2024-12-01

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'employee');
CREATE TYPE blog_status AS ENUM ('draft', 'pending_approval', 'approved', 'published', 'rejected', 'archived');
CREATE TYPE notification_type AS ENUM ('blog_approved', 'blog_rejected', 'new_submission', 'blog_published', 'system_announcement');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    profile_picture_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    full_name TEXT
);

-- Blogs table
CREATE TABLE public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL, -- markdown content
    cover_image_url TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status blog_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    tags TEXT[] DEFAULT '{}',
    read_time INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_blogs_status ON public.blogs(status);
CREATE INDEX idx_blogs_author_id ON public.blogs(author_id);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all active users" ON public.users
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Blogs policies
CREATE POLICY "Anyone can view published blogs" ON public.blogs
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view their own blogs" ON public.blogs
    FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Admins can view all blogs" ON public.blogs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Authors can create blogs" ON public.blogs
    FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own blogs" ON public.blogs
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Admins can update all blogs" ON public.blogs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Authors can delete their own draft blogs" ON public.blogs
    FOR DELETE USING (author_id = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can delete any blog" ON public.blogs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Functions for common operations
CREATE OR REPLACE FUNCTION generate_blog_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'),
        '\s+', '-', 'g'
    ));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_read_time(content TEXT)
RETURNS INTEGER AS $$
BEGIN
    -- Estimate reading time: ~200 words per minute
    RETURN GREATEST(1, CEIL(length(regexp_replace(content, '\s+', ' ', 'g')) / 200));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug and read time
CREATE OR REPLACE FUNCTION blog_insert_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate slug if not provided or if title changed
    IF NEW.slug IS NULL OR NEW.slug = '' OR (TG_OP = 'UPDATE' AND OLD.title != NEW.title) THEN
        NEW.slug = generate_blog_slug(NEW.title);
    END IF;
    
    -- Calculate read time
    NEW.read_time = calculate_read_time(NEW.content);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_slug_read_time_trigger
    BEFORE INSERT OR UPDATE ON public.blogs
    FOR EACH ROW EXECUTE FUNCTION blog_insert_update();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type notification_type,
    p_message TEXT,
    p_blog_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, type, message, blog_id)
    VALUES (p_user_id, p_type, p_message, p_blog_id)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to approve blog
CREATE OR REPLACE FUNCTION approve_blog(
    p_blog_id UUID,
    p_approver_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    blog_author_id UUID;
BEGIN
    -- Get blog author
    SELECT author_id INTO blog_author_id
    FROM public.blogs
    WHERE id = p_blog_id AND status = 'pending_approval';
    
    IF blog_author_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Update blog status
    UPDATE public.blogs
    SET status = 'approved',
        approved_by = p_approver_id,
        approved_at = NOW(),
        updated_at = NOW()
    WHERE id = p_blog_id;
    
    -- Create notification for author
    PERFORM create_notification(
        blog_author_id,
        'blog_approved',
        'Your blog has been approved and is ready to be published!',
        p_blog_id
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to reject blog
CREATE OR REPLACE FUNCTION reject_blog(
    p_blog_id UUID,
    p_rejector_id UUID,
    p_rejection_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    blog_author_id UUID;
BEGIN
    -- Get blog author
    SELECT author_id INTO blog_author_id
    FROM public.blogs
    WHERE id = p_blog_id AND status = 'pending_approval';
    
    IF blog_author_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Update blog status
    UPDATE public.blogs
    SET status = 'rejected',
        rejection_reason = p_rejection_reason,
        updated_at = NOW()
    WHERE id = p_blog_id;
    
    -- Create notification for author
    PERFORM create_notification(
        blog_author_id,
        'blog_rejected',
        COALESCE('Your blog was rejected. Reason: ' || p_rejection_reason, 'Your blog was rejected. Please review and resubmit.'),
        p_blog_id
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to increment blog views
CREATE OR REPLACE FUNCTION increment_blog_views(blog_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blogs
    SET views_count = views_count + 1
    WHERE id = blog_id AND status = 'published';
END;
$$ LANGUAGE plpgsql;

-- Create views for easier querying
CREATE VIEW blog_with_author AS
SELECT 
    b.*,
    u.full_name as author_name,
    u.profile_picture_url as author_avatar,
    approver.full_name as approver_name
FROM public.blogs b
LEFT JOIN public.users u ON b.author_id = u.id
LEFT JOIN public.users approver ON b.approved_by = approver.id;

CREATE VIEW notification_with_blog AS
SELECT 
    n.*,
    b.title as blog_title,
    b.slug as blog_slug
FROM public.notifications n
LEFT JOIN public.blogs b ON n.blog_id = b.id;
