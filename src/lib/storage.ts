import { ClassItem, Trainer, Schedule, Booking } from './types';
import { INITIAL_CLASSES, INITIAL_TRAINERS, INITIAL_SCHEDULES } from './data';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  CLASSES: '11fc_classes',
  TRAINERS: '11fc_trainers',
  SCHEDULES: '11fc_schedules',
  BOOKINGS: '11fc_bookings',
};

// Helper for local storage access
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving to localStorage ${key}:`, err);
  }
}

// 1. CLASSES
export async function fetchClasses(): Promise<ClassItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('classes').select('*');
      if (!error && data && data.length > 0) {
        return data.map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          description: c.description || '',
          durationMinutes: c.duration_minutes || 90,
          intensity: c.intensity || 'All Levels',
          imageUrl: c.image_url || '',
          equipmentNeeded: c.equipment_needed || [],
          benefits: c.benefits || [],
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch classes error, falling back to local:', err);
    }
  }
  return getLocalItem<ClassItem[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
}

// 2. TRAINERS
export async function fetchTrainers(): Promise<Trainer[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('trainers').select('*');
      if (!error && data && data.length > 0) {
        return data.map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          specialty: t.specialty,
          bio: t.bio || '',
          photoUrl: t.photo_url || '',
          instagram: t.instagram,
          achievements: t.achievements || [],
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch trainers error, falling back to local:', err);
    }
  }
  return getLocalItem<Trainer[]>(STORAGE_KEYS.TRAINERS, INITIAL_TRAINERS);
}

// 3. SCHEDULES
export async function fetchSchedules(): Promise<Schedule[]> {
  const [classes, trainers] = await Promise.all([fetchClasses(), fetchTrainers()]);
  const classMap = new Map(classes.map((c) => [c.id, c]));
  const trainerMap = new Map(trainers.map((t) => [t.id, t]));

  let schedulesList: Schedule[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('start_time', { ascending: true });
      if (!error && data && data.length > 0) {
        schedulesList = data.map((s) => ({
          id: s.id,
          classId: s.class_id,
          trainerId: s.trainer_id,
          dayOfWeek: s.day_of_week,
          startTime: s.start_time?.slice(0, 5) || '16:00',
          endTime: s.end_time?.slice(0, 5) || '17:30',
          maxCapacity: s.max_capacity || 15,
          price: Number(s.price) || 75000,
          isActive: s.is_active ?? true,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch schedules error, falling back to local:', err);
    }
  }

  if (schedulesList.length === 0) {
    schedulesList = getLocalItem<Schedule[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  }

  return schedulesList.map((s) => ({
    ...s,
    classData: classMap.get(s.classId),
    trainerData: trainerMap.get(s.trainerId),
  }));
}

export async function saveNewSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
  const newSchedule: Schedule = {
    ...schedule,
    id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert({
          id: newSchedule.id,
          class_id: newSchedule.classId,
          trainer_id: newSchedule.trainerId,
          day_of_week: newSchedule.dayOfWeek,
          start_time: newSchedule.startTime,
          end_time: newSchedule.endTime,
          max_capacity: newSchedule.maxCapacity,
          price: newSchedule.price,
          is_active: newSchedule.isActive,
        })
        .select()
        .single();
      if (!error && data) {
        return newSchedule;
      }
    } catch (err) {
      console.warn('Supabase insert schedule error, falling back to local:', err);
    }
  }

  const current = getLocalItem<Schedule[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  const updated = [...current, newSchedule];
  setLocalItem(STORAGE_KEYS.SCHEDULES, updated);
  return newSchedule;
}

export async function deleteSchedule(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('schedules').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase delete schedule error:', err);
    }
  }

  const current = getLocalItem<Schedule[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  const filtered = current.filter((s) => s.id !== id);
  setLocalItem(STORAGE_KEYS.SCHEDULES, filtered);
  return true;
}

export async function toggleScheduleStatus(id: string, isActive: boolean): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('schedules').update({ is_active: isActive }).eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase update schedule error:', err);
    }
  }

  const current = getLocalItem<Schedule[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  const updated = current.map((s) => (s.id === id ? { ...s, isActive } : s));
  setLocalItem(STORAGE_KEYS.SCHEDULES, updated);
  return true;
}

// 4. BOOKINGS
export async function fetchBookings(): Promise<Booking[]> {
  const schedules = await fetchSchedules();
  const scheduleMap = new Map(schedules.map((s) => [s.id, s]));

  let bookingsList: Booking[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        bookingsList = data.map((b) => ({
          id: b.id,
          bookingCode: b.booking_code,
          scheduleId: b.schedule_id,
          bookingDate: b.booking_date,
          customerName: b.customer_name,
          customerPhone: b.customer_phone,
          customerEmail: b.customer_email,
          experienceLevel: b.experience_level || 'beginner',
          status: b.status || 'confirmed',
          notes: b.notes,
          createdAt: b.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch bookings error, falling back to local:', err);
    }
  }

  if (bookingsList.length === 0) {
    bookingsList = getLocalItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  }

  return bookingsList.map((b) => ({
    ...b,
    scheduleData: scheduleMap.get(b.scheduleId),
  }));
}

export async function createBooking(
  bookingInput: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'status'>
): Promise<Booking> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingCode = `11FC-${randomSuffix}`;
  const newBooking: Booking = {
    ...bookingInput,
    id: `book-${Date.now()}-${randomSuffix}`,
    bookingCode,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          id: newBooking.id,
          booking_code: newBooking.bookingCode,
          schedule_id: newBooking.scheduleId,
          booking_date: newBooking.bookingDate,
          customer_name: newBooking.customerName,
          customer_phone: newBooking.customerPhone,
          customer_email: newBooking.customerEmail,
          experience_level: newBooking.experienceLevel,
          status: newBooking.status,
          notes: newBooking.notes,
        })
        .select()
        .single();
      if (!error && data) {
        return newBooking;
      }
    } catch (err) {
      console.warn('Supabase create booking error, falling back to local:', err);
    }
  }

  const current = getLocalItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const updated = [newBooking, ...current];
  setLocalItem(STORAGE_KEYS.BOOKINGS, updated);
  return newBooking;
}

export async function updateBookingStatus(
  id: string,
  status: 'confirmed' | 'attended' | 'cancelled'
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase update booking status error:', err);
    }
  }

  const current = getLocalItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
  setLocalItem(STORAGE_KEYS.BOOKINGS, updated);
  return true;
}

export async function getBookedSeats(scheduleId: string, bookingDate: string): Promise<number> {
  const allBookings = await fetchBookings();
  const confirmed = allBookings.filter(
    (b) => b.scheduleId === scheduleId && b.bookingDate === bookingDate && b.status !== 'cancelled'
  );
  return confirmed.length;
}
