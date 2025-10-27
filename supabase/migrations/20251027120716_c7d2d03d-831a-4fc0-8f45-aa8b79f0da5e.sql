-- Fix 1: Add UPDATE and DELETE policies to threat_intelligence table
CREATE POLICY "Analysts can update threat intelligence"
ON public.threat_intelligence
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'analyst') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Analysts can delete threat intelligence"
ON public.threat_intelligence
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'analyst') OR public.has_role(auth.uid(), 'admin'));

-- Fix 2: Remove duplicate role field from user_profiles
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS role;

-- Update the handle_new_user trigger to not reference role field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;