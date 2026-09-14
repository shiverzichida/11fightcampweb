import { ClassItem, Trainer, Schedule, Booking, Member } from './types';
import { INITIAL_CLASSES, INITIAL_TRAINERS, INITIAL_SCHEDULES } from './data';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  CLASSES: '11fc_classes',
  TRAINERS: '11fc_trainers',
  SCHEDULES: '11fc_schedules',
  BOOKINGS: '11fc_bookings',
  MEMBERS: '11fc_members',
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
  const localItems = getLocalItem<ClassItem[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  return localItems.map((item) => {
    const fresh = INITIAL_CLASSES.find((ic) => ic.id === item.id);
    if (fresh && (item.imageUrl?.includes('unsplash') || !item.imageUrl)) {
      return { ...item, imageUrl: fresh.imageUrl };
    }
    return item;
  });
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

// ==============================================================================
// 5. MEMBERSHIP MANAGEMENT
// ==============================================================================

export async function fetchMembers(): Promise<Member[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((m) => ({
          id: m.id,
          memberCode: m.member_code,
          name: m.name,
          phone: m.phone,
          email: m.email || undefined,
          planId: m.plan_id,
          planTitle: m.plan_title,
          price: m.price,
          paymentMethod: m.payment_method,
          paymentStatus: m.payment_status,
          status: m.status,
          startDate: m.start_date,
          endDate: m.end_date,
          remainingSessions: m.remaining_sessions ?? undefined,
          totalSessions: m.total_sessions ?? undefined,
          notes: m.notes || undefined,
          createdAt: m.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch members error, falling back to local:', err);
    }
  }

  return getLocalItem<Member[]>(STORAGE_KEYS.MEMBERS, []);
}

export async function saveNewMember(data: {
  name: string;
  phone: string;
  email?: string;
  planId: string;
  planTitle: string;
  price: number;
  paymentMethod: 'cash' | 'transfer' | 'qris' | 'edc';
  paymentStatus: 'pending' | 'paid';
  startDate?: string;
  durationDays?: number;
  totalSessions?: number;
  notes?: string;
}): Promise<Member> {
  const now = new Date();
  const start = data.startDate ? new Date(data.startDate) : now;
  const duration = data.durationDays || 30;
  const end = new Date(start);
  end.setDate(end.getDate() + duration);

  const startFormatted = start.toISOString().split('T')[0];
  const endFormatted = end.toISOString().split('T')[0];

  const randomNum = Math.floor(100 + Math.random() * 900);
  const memberCode = `11FC-M${randomNum}`;
  const id = `member-${Date.now()}`;

  const isPaid = data.paymentStatus === 'paid';
  const memberStatus = isPaid ? 'active' : 'pending';

  const newMember: Member = {
    id,
    memberCode,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim(),
    planId: data.planId,
    planTitle: data.planTitle,
    price: data.price,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
    status: memberStatus,
    startDate: startFormatted,
    endDate: endFormatted,
    remainingSessions: data.totalSessions,
    totalSessions: data.totalSessions,
    notes: data.notes,
    createdAt: now.toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('members').insert({
        id: newMember.id,
        member_code: newMember.memberCode,
        name: newMember.name,
        phone: newMember.phone,
        email: newMember.email || null,
        plan_id: newMember.planId,
        plan_title: newMember.planTitle,
        price: newMember.price,
        payment_method: newMember.paymentMethod,
        payment_status: newMember.paymentStatus,
        status: newMember.status,
        start_date: newMember.startDate,
        end_date: newMember.endDate,
        remaining_sessions: newMember.remainingSessions || null,
        total_sessions: newMember.totalSessions || null,
        notes: newMember.notes || null,
      });

      if (!error) {
        const current = getLocalItem<Member[]>(STORAGE_KEYS.MEMBERS, []);
        setLocalItem(STORAGE_KEYS.MEMBERS, [newMember, ...current]);
        return newMember;
      }
    } catch (err) {
      console.warn('Supabase save member error, saving locally:', err);
    }
  }

  const current = getLocalItem<Member[]>(STORAGE_KEYS.MEMBERS, []);
  const updated = [newMember, ...current];
  setLocalItem(STORAGE_KEYS.MEMBERS, updated);
  return newMember;
}

export async function updateMemberStatus(
  id: string,
  paymentStatus: 'pending' | 'paid' | 'cancelled',
  status?: 'active' | 'pending' | 'expired' | 'inactive'
): Promise<boolean> {
  const current = getLocalItem<Member[]>(STORAGE_KEYS.MEMBERS, []);
  const member = current.find((m) => m.id === id);

  const finalStatus = status || (paymentStatus === 'paid' ? 'active' : paymentStatus === 'cancelled' ? 'inactive' : 'pending');

  let updateFields: Partial<Member> = {
    paymentStatus,
    status: finalStatus,
  };

  // If newly marked as paid, start the active countdown from TODAY
  if (paymentStatus === 'paid') {
    const now = new Date();
    const startFormatted = now.toISOString().split('T')[0];
    const duration = member?.planId === 'pack-10' || member?.planId === 'private-pack' ? 45 : 30;
    const end = new Date(now);
    end.setDate(end.getDate() + duration);
    const endFormatted = end.toISOString().split('T')[0];

    updateFields.startDate = startFormatted;
    updateFields.endDate = endFormatted;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const payload: any = {
        payment_status: updateFields.paymentStatus,
        status: updateFields.status,
      };
      if (updateFields.startDate) payload.start_date = updateFields.startDate;
      if (updateFields.endDate) payload.end_date = updateFields.endDate;

      const { error } = await supabase
        .from('members')
        .update(payload)
        .eq('id', id);

      if (!error) {
        // Also update local storage cache
        const updated = current.map((m) => (m.id === id ? { ...m, ...updateFields } : m));
        setLocalItem(STORAGE_KEYS.MEMBERS, updated);
        return true;
      }
    } catch (err) {
      console.warn('Supabase update member status error:', err);
    }
  }

  const updated = current.map((m) => (m.id === id ? { ...m, ...updateFields } : m));
  setLocalItem(STORAGE_KEYS.MEMBERS, updated);
  return true;
}

export async function decrementMemberSession(id: string): Promise<boolean> {
  const current = getLocalItem<Member[]>(STORAGE_KEYS.MEMBERS, []);
  const member = current.find((m) => m.id === id);
  if (!member || typeof member.remainingSessions !== 'number' || member.remainingSessions <= 0) {
    return false;
  }

  const newRemaining = member.remainingSessions - 1;
  const newStatus = newRemaining === 0 ? 'expired' : member.status;

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('members')
        .update({
          remaining_sessions: newRemaining,
          status: newStatus,
        })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase decrement member error:', err);
    }
  }

  const updated = current.map((m) =>
    m.id === id ? { ...m, remainingSessions: newRemaining, status: newStatus } : m
  );
  setLocalItem(STORAGE_KEYS.MEMBERS, updated);
  return true;
}

export async function deleteMember(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase delete member error:', err);
    }
  }

  const current = getLocalItem<Member[]>(STORAGE_KEYS.MEMBERS, []);
  const updated = current.filter((m) => m.id !== id);
  setLocalItem(STORAGE_KEYS.MEMBERS, updated);
  return true;
}

