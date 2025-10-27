-- Migration: 20241201000007_production_rls_policies
-- Description: Production-ready RLS policies (use after fixing infinite recursion)
-- Created: 2024-12-01

-- This migration should be applied AFTER the infinite recursion issue is fixed
-- It provides proper security policies for production use

-- Drop temporary policies
DROP POLICY IF EXISTS "Allow all operations on users" ON public.users;
DROP POLICY IF EXISTS "Allow all operations on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow all operations on notifications" ON public.notifications;

-- Create a secure function to check user role without recursion
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Get role from auth.users metadata first
    SELECT raw_user_meta_data->>'role' INTO user_role
    FROM auth.users 
    WHERE id = user_id;
    
    -- If not found in metadata, get from users table
    IF user_role IS NULL THEN
        SELECT role::TEXT INTO user_role
        FROM public.users 
        WHERE id = user_id AND is_active = true;
    END IF;
    
    -- Default to employee if not found
    RETURN COALESCE(user_role, 'employee');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create secure RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view all active users" ON public.users
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (get_user_role(auth.uid()) = 'admin');

-- Create secure RLS policies for blogs table
CREATE POLICY "Anyone can view published blogs" ON public.blogs
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view their own blogs" ON public.blogs
    FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Authors can create blogs" ON public.blogs
    FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own blogs" ON public.blogs
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own draft blogs" ON public.blogs
    FOR DELETE USING (author_id = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can view all blogs" ON public.blogs
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all blogs" ON public.blogs
    FOR UPDATE USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can delete any blog" ON public.blogs
    FOR DELETE USING (get_user_role(auth.uid()) = 'admin');

-- Create secure RLS policies for notifications table
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all notifications" ON public.notifications
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

-- Add comments for documentation
COMMENT ON FUNCTION get_user_role(UUID) IS 'Safely retrieves user role without causing infinite recursion';
COMMENT ON POLICY "Users can view their own profile" ON public.users IS 'Users can only view their own profile data';
COMMENT ON POLICY "Admins can view all users" ON public.users IS 'Admins can view all user profiles';
COMMENT ON POLICY "Anyone can view published blogs" ON public.blogs IS 'Published blogs are publicly viewable';
COMMENT ON POLICY "Authors can view their own blogs" ON public.blogs IS 'Authors can view their own blogs regardless of status';
