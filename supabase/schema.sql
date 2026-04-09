-- Création des types ENUM
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE attendance_status AS ENUM ('present');
CREATE TYPE account_status AS ENUM ('pending', 'approved', 'rejected');

-- Table : users (étend les profils créés dans Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    name TEXT NOT NULL,
    status account_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table : groups (les classes ou groupes d'étudiants)
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    teacher_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de jointure : group_students
CREATE TABLE public.group_students (
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, student_id)
);

-- Table : attendance_sessions (session d'appel)
CREATE TABLE public.attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius DOUBLE PRECISION DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Table : attendance_records (émargement)
CREATE TABLE public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status attendance_status DEFAULT 'present',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, student_id) -- Un étudiant ne peut émarger qu'une fois par session
);

-- Activer le Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Ajout de quelques politiques par défaut (Afin de simplifier le test, nous allons les rendre ouvertes pour la MVP)
CREATE POLICY "Act on all users" ON public.users FOR ALL USING (true);
CREATE POLICY "Act on all groups" ON public.groups FOR ALL USING (true);
CREATE POLICY "Act on all group_students" ON public.group_students FOR ALL USING (true);
CREATE POLICY "Act on all sessions" ON public.attendance_sessions FOR ALL USING (true);
CREATE POLICY "Act on all records" ON public.attendance_records FOR ALL USING (true);

-- Fonction pour synchroniser automatiquement les utilisateurs Auth vers public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, status)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE((NEW.raw_user_meta_data->>'name')::text, 'Utilisateur'), 
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
    'pending'::account_status
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
