-- ==============================================================================
-- 11TH UNIVERSE MMA / 11 FIGHT CAMP (PONTIANAK) - SUPABASE DATABASE SCHEMA
-- Execute this SQL in Supabase SQL Editor to set up tables and official seed data.
-- ==============================================================================

-- 1. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 75,
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
  max_capacity INT NOT NULL DEFAULT 16,
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
  experience_level TEXT DEFAULT 'first_time',
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
-- OFFICIAL SEED DATA - 11TH UNIVERSE MMA
-- ==============================================================================

INSERT INTO public.classes (id, title, category, description, duration_minutes, intensity, image_url, equipment_needed, benefits)
VALUES
('class-striking', 'Striking (Muay Thai & Boxing)', 'striking', 'Pukulan, tendangan, pad work dan heavy bag.', 75, 'All Levels', '/classes/striking.jpg', ARRAY['Handwrap', 'Glove', 'Baju Olahraga'], ARRAY['Bakar 700kcal', 'Teknik Pukul & Tendang', 'Reflek & Cardio']),
('class-bjj', 'Brazilian Jiu-Jitsu (BJJ)', 'bjj', 'Ground fighting, submissions, dan kuncian praktis.', 90, 'All Levels', '/classes/bjj.jpg', ARRAY['Gi / Rashguard', 'Mouthguard'], ARRAY['Submission Lock', 'Ground Defense', 'Core Stability']),
('class-hyrox', 'HYROX Functional Fitness', 'hyrox', 'Kombinasi lari dan functional training intensitas tinggi.', 60, 'High Intensity', '/classes/hyrox.jpg', ARRAY['Sepatu Running', 'Handuk', 'Air Minum'], ARRAY['Endurance Maksimal', 'Fat Loss Cepat', 'Stamina Tinggi']),
('class-bjj-kids', 'BJJ Kids', 'kids', 'Kelas BJJ anak melatih disiplin, anti-bullying, dan kelincahan.', 60, 'Beginner Friendly', '/classes/bjj-kids.jpg', ARRAY['Pakaian Olahraga / Gi'], ARRAY['Fokus & Disiplin', 'Anti-Bullying', 'Motorik']),
('class-muaykids', 'Muaykids (Muay Thai Kids)', 'kids', 'Dasar Muay Thai anak dengan cara yang aman dan seru.', 60, 'Beginner Friendly', '/classes/muaykids.jpg', ARRAY['Glove Anak'], ARRAY['Kebugaran', 'Koordinasi', 'Self-Confidence']),
('class-yoga-hatha', 'Yoga Hatha', 'yoga', 'Peregangan sendi, fleksibilitas otot, dan pernapasan.', 75, 'Beginner Friendly', '/classes/yoga.jpg', ARRAY['Matras (Disediakan)'], ARRAY['Recovery Otot', 'Anti-Stres', 'Fleksibilitas']),
('class-yoga-if', 'Yoga IF (Intermediate Flow)', 'yoga', 'Flow yoga dinamis untuk perbaikan postur dan stamina.', 75, 'Intermediate', '/classes/yoga.jpg', ARRAY['Matras Yoga'], ARRAY['Postur Tubuh', 'Keseimbangan']),
('class-zumba', 'Zumba Dance Fitness', 'zumba', 'Senam kardio dan tarian berenergi tinggi pembakar kalori.', 60, 'All Levels', '/classes/zumba.jpg', ARRAY['Sepatu Senam'], ARRAY['Bakar 500kcal', 'Mood Booster'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.trainers (id, name, role, specialty, bio, photo_url, instagram, achievements)
VALUES
('trainer-mahaji', 'Coach Mahaji Arbain Wicaksana', 'Head Coach', 'Muay Thai, Boxing, Conditioning, & MMA Striking', 'Head Coach resmi 11th Universe MMA / 11 Fight Camp Pontianak.', '/coach-mahaji.webp', '11fightcamp', ARRAY['Head Coach 11th Universe MMA', 'Muay Thai & Boxing Lead', 'MMA Striking Lead']),
('trainer-david', 'Coach David', 'BJJ Specialist', 'Brazilian Jiu-Jitsu (BJJ)', 'Spesialis kuncian ground fighting dewasa dan anak.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', '11fightcamp', ARRAY['BJJ Specialist', 'Kids Martial Arts Coach']),
('trainer-aris', 'Coach Aris', 'Hyrox Lead', 'Hyrox & Conditioning', 'Lead coach program functional race Hyrox.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80', '11fightcamp', ARRAY['Hyrox Certified Coach', 'Endurance Coach']),
('trainer-sarah', 'Coach Sarah', 'Yoga Instructor', 'Yoga Hatha & Mobility', 'Instruktur yoga dan pemulihan sendi.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80', '11fightcamp', ARRAY['Certified Yoga Alliance']),
('trainer-cindy', 'Coach Cindy', 'Zumba Lead', 'Zumba Fitness', 'Instruktur tari kardio berenergi tinggi.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', '11fightcamp', ARRAY['Licensed Zumba Instructor'])
ON CONFLICT (id) DO NOTHING;

-- Official Matrix Schedules
INSERT INTO public.schedules (id, class_id, trainer_id, day_of_week, start_time, end_time, max_capacity, price, is_active)
VALUES
-- Sabtu 07.00
('sch-sat-0700-hyrox', 'class-hyrox', 'trainer-aris', 6, '07:00', '08:15', 16, 75000, true),
-- 08.30 (Senin - Sabtu)
('sch-mon-0830-striking', 'class-striking', 'trainer-mahaji', 1, '08:30', '09:45', 15, 75000, true),
('sch-tue-0830-striking', 'class-striking', 'trainer-mahaji', 2, '08:30', '09:45', 15, 75000, true),
('sch-wed-0830-striking', 'class-striking', 'trainer-mahaji', 3, '08:30', '09:45', 15, 75000, true),
('sch-thu-0830-striking', 'class-striking', 'trainer-mahaji', 4, '08:30', '09:45', 15, 75000, true),
('sch-fri-0830-striking', 'class-striking', 'trainer-mahaji', 5, '08:30', '09:45', 15, 75000, true),
('sch-sat-0830-striking', 'class-striking', 'trainer-mahaji', 6, '08:30', '09:45', 15, 75000, true),
-- 10.00 (Senin - Sabtu + Minggu)
('sch-mon-1000-striking', 'class-striking', 'trainer-mahaji', 1, '10:00', '11:15', 15, 75000, true),
('sch-mon-1000-yoga-if', 'class-yoga-if', 'trainer-sarah', 1, '10:00', '11:15', 12, 70000, true),
('sch-tue-1000-striking', 'class-striking', 'trainer-mahaji', 2, '10:00', '11:15', 15, 75000, true),
('sch-wed-1000-striking', 'class-striking', 'trainer-mahaji', 3, '10:00', '11:15', 15, 75000, true),
('sch-thu-1000-striking', 'class-striking', 'trainer-mahaji', 4, '10:00', '11:15', 15, 75000, true),
('sch-fri-1000-striking', 'class-striking', 'trainer-mahaji', 5, '10:00', '11:15', 15, 75000, true),
('sch-sat-1000-striking', 'class-striking', 'trainer-mahaji', 6, '10:00', '11:15', 15, 75000, true),
('sch-sun-1000-bjj-kids', 'class-bjj-kids', 'trainer-david', 0, '10:00', '11:15', 12, 65000, true),
-- 15.00
('sch-sat-1500-muaykids', 'class-muaykids', 'trainer-mahaji', 6, '15:00', '16:00', 12, 65000, true),
-- 16.00 (Senin - Minggu)
('sch-mon-1600-striking', 'class-striking', 'trainer-mahaji', 1, '16:00', '17:15', 16, 75000, true),
('sch-tue-1600-striking', 'class-striking', 'trainer-mahaji', 2, '16:00', '17:15', 16, 75000, true),
('sch-wed-1600-striking', 'class-striking', 'trainer-mahaji', 3, '16:00', '17:15', 16, 75000, true),
('sch-thu-1600-striking', 'class-striking', 'trainer-mahaji', 4, '16:00', '17:15', 16, 75000, true),
('sch-fri-1600-striking', 'class-striking', 'trainer-mahaji', 5, '16:00', '17:15', 16, 75000, true),
('sch-sat-1600-striking', 'class-striking', 'trainer-mahaji', 6, '16:00', '17:15', 16, 75000, true),
('sch-sun-1600-striking', 'class-striking', 'trainer-mahaji', 0, '16:00', '17:15', 16, 75000, true),
-- 17.00 (Senin - Sabtu)
('sch-mon-1700-striking', 'class-striking', 'trainer-mahaji', 1, '17:00', '18:15', 16, 75000, true),
('sch-tue-1700-striking', 'class-striking', 'trainer-mahaji', 2, '17:00', '18:15', 16, 75000, true),
('sch-wed-1700-striking', 'class-striking', 'trainer-mahaji', 3, '17:00', '18:15', 16, 75000, true),
('sch-thu-1700-striking', 'class-striking', 'trainer-mahaji', 4, '17:00', '18:15', 16, 75000, true),
('sch-fri-1700-striking', 'class-striking', 'trainer-mahaji', 5, '17:00', '18:15', 16, 75000, true),
('sch-sat-1700-striking', 'class-striking', 'trainer-mahaji', 6, '17:00', '18:15', 16, 75000, true),
-- 18.30
('sch-mon-1830-yoga-hatha', 'class-yoga-hatha', 'trainer-sarah', 1, '18:30', '19:45', 14, 70000, true),
('sch-thu-1830-zumba', 'class-zumba', 'trainer-cindy', 4, '18:30', '19:30', 20, 60000, true),
('sch-fri-1830-yoga-hatha', 'class-yoga-hatha', 'trainer-sarah', 5, '18:30', '19:45', 14, 70000, true),
-- 19.00
('sch-wed-1900-hyrox', 'class-hyrox', 'trainer-aris', 3, '19:00', '20:15', 16, 75000, true),
-- 20.00
('sch-mon-2000-bjj', 'class-bjj', 'trainer-david', 1, '20:00', '21:30', 16, 80000, true),
('sch-mon-2000-hyrox', 'class-hyrox', 'trainer-aris', 1, '20:00', '21:15', 16, 75000, true),
('sch-wed-2000-bjj', 'class-bjj', 'trainer-david', 3, '20:00', '21:30', 16, 80000, true),
('sch-fri-2000-bjj', 'class-bjj', 'trainer-david', 5, '20:00', '21:30', 16, 80000, true)
ON CONFLICT (id) DO NOTHING;
