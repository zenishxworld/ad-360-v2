-- Create a trigger to automatically create a student_profiles record for new users

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.student_profiles (
    user_id,
    full_name,
    email,
    preferred_countries,
    degree_level,
    target_course,
    cgpa,
    english_test,
    english_score,
    gre_score,
    gmat_score,
    work_experience
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Unknown User'),
    NEW.email,
    ARRAY[]::text[],
    '',
    '',
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to allow re-running
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
