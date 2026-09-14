-- ==============================================================================
-- 11 FIGHT CAMP (PONTIANAK) - SUPABASE DATABASE SCHEMA
-- Execute this SQL in Supabase SQL Editor to set up tables and initial seed data.
-- ==============================================================================

-- 1. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 90,
  intensity TEXT DEFAULT 'All Levels',
  image_url TEXT,
  equipment_needed TEXT[],
  benefits TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Trainers Table
CREATE TABLE IF NOT EXISTS public.trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  instagram TEXT,
  achievements TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Schedules Table
CREATE TABLE IF NOT EXISTS public.schedules (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  trainer_id TEXT REFERENCES public.trainers(id) ON DELETE SET NULL,
  day_of_week INT NOT NULL, -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INT NOT NULL DEFAULT 15,
  price NUMERIC NOT NULL DEFAULT 75000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  booking_code TEXT UNIQUE NOT NULL,
  schedule_id TEXT REFERENCES public.schedules(id) ON DELETE RESTRICT,
  booking_date DATE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  experience_level TEXT DEFAULT 'beginner',
  status TEXT DEFAULT 'confirmed', -- 'confirmed', 'attended', 'cancelled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read access on classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on trainers" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Allow public read access on schedules" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Allow public read access on bookings" ON public.bookings FOR SELECT USING (true);

-- Public Insert for Bookings (Guests can book classes)
CREATE POLICY "Allow public insert on bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Allow authenticated users (Admin) full access
CREATE POLICY "Allow authenticated full access on classes" ON public.classes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on trainers" ON public.trainers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on schedules" ON public.schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on bookings" ON public.bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

INSERT INTO public.classes (id, title, category, description, duration_minutes, intensity, image_url, equipment_needed, benefits)
VALUES
('class-muay-thai', 'Muay Thai (The Art of 8 Limbs)', 'muay-thai', 'Seni bela diri Thailand pukulan, tendangan, sikutan, dan lutut.', 90, 'All Levels', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80', ARRAY['Handwrap', 'Glove', 'Baju Olahraga'], ARRAY['Cardio 900kcal', 'Striking Mastery', 'Mental Toughness']),
('class-boxing', 'Boxing & Sweet Science', 'boxing', 'Teknik tinju murni, footwork, pad work, dan heavy bag.', 75, 'All Levels', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=80', ARRAY['Handwrap', 'Glove 12-14oz'], ARRAY['Agility', 'Core Strength', 'Reflex']),
('class-bjj', 'Brazilian Jiu-Jitsu (BJJ)', 'bjj', 'Seni ground fighting, leverage, dan submission.', 90, 'Beginner Friendly', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80', ARRAY['Gi / Rashguard', 'Mouthguard'], ARRAY['Submission Lock', 'Ground Defense', 'Low Joint Impact']),
('class-mma', 'MMA (Mixed Martial Arts)', 'mma', 'Integrasi striking dan wrestling dalam cage.', 90, 'High Intensity', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80', ARRAY['MMA Glove', 'Shin Guards'], ARRAY['Total Combat Readiness', 'Ultimate Conditioning']),
('class-conditioning', 'Fighter Strength & HIIT', 'conditioning', 'Latihan fungsional pembakar lemak khas petarung.', 60, 'High Intensity', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80', ARRAY['Air Minum', 'Handuk'], ARRAY['Fat Loss', 'Stamina', 'Toned Physique'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.trainers (id, name, role, specialty, bio, photo_url, instagram, achievements)
VALUES
('trainer-1', 'Coach Kevin "The Striker"', 'Head Muay Thai Coach', 'Muay Thai & K1 Striking', 'Atlet kompetisi striking dengan pengalaman lebih dari 8 tahun.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', '11fightcamp', ARRAY['Regional Muay Thai Champ', 'Head Coach 11FC']),
('trainer-2', 'Coach David "The Anaconda"', 'BJJ & MMA Specialist', 'Brazilian Jiu-Jitsu (BJJ)', 'Praktisi BJJ dengan pemahaman kuncian sendi dan takedown.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', '11fightcamp', ARRAY['BJJ Purple Belt', 'Submission Specialist']),
('trainer-3', 'Coach Aris "Thunder"', 'Boxing Coach', 'Boxing & Conditioning', 'Spesialis footwork, reflek pertahanan, dan program cutting berat badan.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80', '11fightcamp', ARRAY['Amateur Boxing Veteran', 'Strength Mentor'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.schedules (id, class_id, trainer_id, day_of_week, start_time, end_time, max_capacity, price, is_active)
VALUES
('sch-mon-1', 'class-muay-thai', 'trainer-1', 1, '16:30', '18:00', 15, 75000, true),
('sch-mon-2', 'class-boxing', 'trainer-3', 1, '19:00', '20:30', 12, 75000, true),
('sch-tue-1', 'class-bjj', 'trainer-2', 2, '16:30', '18:00', 14, 80000, true),
('sch-tue-2', 'class-conditioning', 'trainer-3', 2, '19:00', '20:15', 16, 65000, true),
('sch-wed-1', 'class-muay-thai', 'trainer-1', 3, '16:30', '18:00', 15, 75000, true),
('sch-wed-2', 'class-mma', 'trainer-2', 3, '19:00', '20:30', 12, 85000, true),
('sch-thu-1', 'class-boxing', 'trainer-3', 4, '16:30', '18:00', 12, 75000, true),
('sch-thu-2', 'class-bjj', 'trainer-2', 4, '19:00', '20:30', 14, 80000, true),
('sch-fri-1', 'class-muay-thai', 'trainer-1', 5, '16:30', '18:00', 15, 75000, true),
('sch-fri-2', 'class-conditioning', 'trainer-3', 5, '19:00', '20:15', 16, 65000, true),
('sch-sat-1', 'class-muay-thai', 'trainer-1', 6, '09:00', '10:30', 15, 75000, true),
('sch-sat-2', 'class-mma', 'trainer-2', 6, '16:00', '17:30', 12, 85000, true)
ON CONFLICT (id) DO NOTHING;
